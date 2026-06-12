import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { sanitizeRef } from "@/lib/affiliate";
import { markPromoUsedByCode } from "@/lib/promo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  // 1. Vérifie la présence du secret
  const secretRaw = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secretRaw || secretRaw.trim().length === 0) {
    const msg =
      "STRIPE_WEBHOOK_SECRET est vide. Lance `stripe listen --forward-to localhost:3000/api/stripe/webhook`, " +
      "copie le whsec_... affiché, colle-le dans .env.local, puis redémarre `npm run dev`.";
    console.error("[/api/stripe/webhook]", msg);
    return NextResponse.json({ error: "webhook_not_configured", message: msg }, { status: 500 });
  }
  // Trim défensif contre les espaces / sauts de ligne en fin de variable.
  const secret = secretRaw.trim();

  // 2. Lit la signature
  const signature = req.headers.get("stripe-signature");
  console.log(
    "[/api/stripe/webhook] secret loaded:",
    `${secret.slice(0, 12)}…${secret.slice(-4)}`,
    "(length",
    secret.length + ")",
    "| signature header:",
    signature ? "present" : "ABSENT",
  );

  if (!signature) {
    return NextResponse.json(
      { error: "missing_signature", message: "Header 'stripe-signature' absent." },
      { status: 400 },
    );
  }

  // 3. Lit le raw body (OBLIGATOIRE pour la vérification de signature)
  const rawBody = await req.text();
  console.log("[/api/stripe/webhook] body length:", rawBody.length);

  // 4. Construit et vérifie l'événement
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, secret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Signature invalide";
    console.error("[/api/stripe/webhook] signature verification FAILED:", msg);
    console.error(
      "[/api/stripe/webhook] → Vérifie que le whsec_ dans .env.local correspond EXACTEMENT à celui " +
        "affiché par `stripe listen`. Ce secret change à chaque redémarrage de la CLI. " +
        "Après modif de .env.local, redémarre `npm run dev`.",
    );
    return NextResponse.json(
      {
        error: "invalid_signature",
        message:
          msg +
          " — Le secret dans .env.local ne correspond probablement plus au secret affiché par `stripe listen`.",
      },
      { status: 400 },
    );
  }

  console.log("[/api/stripe/webhook] event received:", event.type, "| id:", event.id);

  // 5. Filtre des événements traités. Spec : tout ce qui n'est pas checkout.session.completed → 200 ignored.
  if (event.type !== "checkout.session.completed") {
    console.log("[/api/stripe/webhook] ignored event type:", event.type);
    return NextResponse.json({ received: true, ignored: true });
  }

  // 6. Traitement de checkout.session.completed
  const session = event.data.object as Stripe.Checkout.Session;

  // 6bis. Branche AGENTS PRÊTS À L'EMPLOI (4,90 €) — totalement isolée de
  //       l'offre personnalisée 49,90 €. On traite puis on sort.
  if (session.metadata?.purchase_type === "ready_made_agent") {
    return handleReadyMadeAgent(session);
  }

  const pendingId = session.metadata?.pending_questionnaire_id;
  const userId = session.metadata?.user_id;
  console.log(
    "[/api/stripe/webhook] checkout.session.completed | session:",
    session.id,
    "| pending_questionnaire_id:",
    pendingId,
    "| user_id:",
    userId,
  );

  if (!pendingId) {
    console.warn(
      "[/api/stripe/webhook] pending_questionnaire_id absent dans metadata — session ignorée:",
      session.id,
    );
    // 200 quand même pour empêcher Stripe de retenter indéfiniment un event mal formé.
    return NextResponse.json({ received: true, warning: "no_pending_id" });
  }

  let admin;
  try {
    admin = createAdminClient();
  } catch (err) {
    console.error("[/api/stripe/webhook] createAdminClient failed:", err);
    return NextResponse.json(
      { error: "admin_client_error", message: err instanceof Error ? err.message : "Erreur admin client" },
      { status: 500 },
    );
  }

  // 7. Récupère le pending pour avoir le questionnaire stocké
  const { data: pending, error: getErr } = await admin
    .from("pending_questionnaires")
    .select("id, user_id, email, questionnaire, status, affiliate_ref")
    .eq("id", pendingId)
    .single();

  if (getErr || !pending) {
    console.error(
      "[/api/stripe/webhook] pending introuvable:",
      pendingId,
      "| supabase error:",
      getErr,
    );
    return NextResponse.json(
      { error: "pending_not_found", message: getErr?.message ?? "pending introuvable" },
      { status: 404 },
    );
  }

  // 7bis. Ref affilié : priorité au metadata Stripe, sinon valeur stockée sur le pending.
  const affiliateRef = sanitizeRef(
    session.metadata?.affiliate_ref ||
      (typeof pending.affiliate_ref === "string" ? pending.affiliate_ref : ""),
  );

  // 8. Insert idempotent dans paid_questionnaire_responses
  //    Les contraintes UNIQUE sur pending_questionnaire_id et stripe_checkout_session_id
  //    rejettent les doublons → code Postgres 23505.
  //    On récupère l'id (pour lier la conversion affiliée).
  let paidResponseId: string | null = null;
  const { data: insertedPaid, error: insertErr } = await admin
    .from("paid_questionnaire_responses")
    .insert({
      pending_questionnaire_id: pendingId,
      user_id: userId ?? pending.user_id,
      email: session.customer_email ?? pending.email,
      stripe_checkout_session_id: session.id,
      stripe_payment_intent_id:
        typeof session.payment_intent === "string" ? session.payment_intent : null,
      amount_total: session.amount_total,
      currency: session.currency,
      payment_status: session.payment_status,
      questionnaire: pending.questionnaire,
      affiliate_ref: affiliateRef || null,
    })
    .select("id")
    .maybeSingle();

  if (insertErr) {
    const isDuplicate =
      insertErr.code === "23505" || insertErr.message?.includes("duplicate");
    if (isDuplicate) {
      console.log(
        "[/api/stripe/webhook] duplicate event — paid_response déjà inséré pour",
        pendingId,
      );
      // On récupère l'id existant pour pouvoir (ré)assurer la conversion affiliée.
      const { data: existingPaid } = await admin
        .from("paid_questionnaire_responses")
        .select("id")
        .eq("stripe_checkout_session_id", session.id)
        .maybeSingle();
      paidResponseId = existingPaid?.id ?? null;
    } else {
      console.error("[/api/stripe/webhook] insert paid_response failed:", insertErr);
      return NextResponse.json(
        { error: "insert_failed", message: insertErr.message, details: insertErr },
        { status: 500 },
      );
    }
  } else {
    paidResponseId = insertedPaid?.id ?? null;
    console.log("[/api/stripe/webhook] paid_response inséré pour pending", pendingId);
  }

  // 8bis. Affiliation — JAMAIS bloquant pour le webhook ni pour le paiement.
  //       Si pas de ref, ou ref inconnu/inactif, on ignore en silence et on continue.
  if (affiliateRef) {
    try {
      const { data: affiliate, error: affErr } = await admin
        .from("affiliates")
        .select("id, commission_rate, status")
        .eq("slug", affiliateRef)
        .maybeSingle();

      if (affErr) {
        console.error("[/api/stripe/webhook] lookup affilié échoué (non bloquant):", affErr);
      } else if (affiliate && affiliate.status === "active") {
        const amountTotal = session.amount_total ?? 0; // centimes
        const rate = Number(affiliate.commission_rate ?? 0);
        const commissionAmount = Math.round((amountTotal * rate) / 100);

        const { error: convErr } = await admin.from("affiliate_conversions").insert({
          affiliate_id: affiliate.id,
          affiliate_ref: affiliateRef,
          user_id: userId ?? pending.user_id,
          email: session.customer_email ?? pending.email,
          stripe_checkout_session_id: session.id, // UNIQUE → idempotence
          paid_questionnaire_response_id: paidResponseId,
          amount_total: amountTotal,
          commission_rate: rate,
          commission_amount: commissionAmount,
          commission_status: "unpaid",
        });

        if (convErr) {
          const dup = convErr.code === "23505" || convErr.message?.includes("duplicate");
          if (dup) {
            console.log(
              "[/api/stripe/webhook] conversion déjà enregistrée (idempotent) pour",
              session.id,
            );
          } else {
            console.error(
              "[/api/stripe/webhook] insert conversion échoué (non bloquant):",
              convErr,
            );
          }
        } else {
          console.log(
            "[/api/stripe/webhook] conversion affiliée créée:",
            affiliateRef,
            "→",
            commissionAmount,
            "centimes",
          );
        }
      } else {
        console.log(
          "[/api/stripe/webhook] affiliate_ref inconnu ou inactif, ignoré:",
          affiliateRef,
        );
      }
    } catch (e) {
      console.error("[/api/stripe/webhook] bloc affiliation a échoué (non bloquant):", e);
    }
  }

  // 9. Met à jour le pending → 'paid'
  const { error: updateErr } = await admin
    .from("pending_questionnaires")
    .update({ status: "paid" })
    .eq("id", pendingId);

  if (updateErr) {
    console.error(
      "[/api/stripe/webhook] update pending → paid a échoué (non bloquant):",
      updateErr,
    );
  } else {
    console.log("[/api/stripe/webhook] pending", pendingId, "→ status='paid'");
  }

  // 10. Code promo (réduction partielle, ex. -30 %) : consommé après paiement confirmé.
  const promoCode = session.metadata?.promo_code;
  if (promoCode) {
    try {
      await markPromoUsedByCode(admin, promoCode);
      console.log("[/api/stripe/webhook] code promo consommé:", promoCode);
    } catch (e) {
      console.error("[/api/stripe/webhook] consommation code promo (non bloquant):", e);
    }
  }

  return NextResponse.json({ received: true, processed: true });
}

// ============================================================================
// Achat d'un AGENT PRÊT À L'EMPLOI (4,90 €). Insert idempotent + affiliation.
// Ne touche jamais à la logique de l'offre personnalisée.
// ============================================================================
async function handleReadyMadeAgent(session: Stripe.Checkout.Session) {
  const slug = session.metadata?.agent_slug ?? "";
  const name = session.metadata?.agent_name ?? "";
  const type = session.metadata?.agent_type ?? null;
  const email =
    session.customer_email ?? session.customer_details?.email ?? null;
  let userId = session.metadata?.user_id ?? null;

  console.log(
    "[/api/stripe/webhook] ready_made_agent | slug:",
    slug,
    "| user:",
    userId,
    "| email:",
    email,
    "| session:",
    session.id,
  );

  // Le slug est indispensable. Sans lui, on ne peut rien rattacher.
  if (!slug) {
    console.warn("[/api/stripe/webhook] metadata agent sans slug — ignoré:", session.id);
    return NextResponse.json({ received: true, warning: "incomplete_metadata" });
  }

  let admin;
  try {
    admin = createAdminClient();
  } catch (err) {
    console.error("[/api/stripe/webhook] admin client failed:", err);
    return NextResponse.json({ error: "admin_client_error" }, { status: 500 });
  }

  // Robustesse : si user_id absent du metadata mais email présent (Stripe),
  // on tente de retrouver l'utilisateur par email (profils créés à l'inscription).
  // Sans user_id résolu, la ligne reste tracée par email pour récupération manuelle.
  if (!userId && email) {
    const { data: prof } = await admin
      .from("profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();
    if (prof?.id) {
      userId = prof.id;
      console.log("[/api/stripe/webhook] user_id résolu par email:", email, "→", userId);
    } else {
      console.warn(
        "[/api/stripe/webhook] user_id absent et introuvable par email:",
        email,
        "— ligne tracée par email uniquement.",
      );
    }
  }

  // Insert idempotent (stripe_checkout_session_id UNIQUE)
  const { error: insErr } = await admin.from("ready_made_agent_purchases").insert({
    user_id: userId,
    email,
    agent_slug: slug,
    agent_name: name,
    agent_type: type,
    stripe_checkout_session_id: session.id,
    stripe_payment_intent_id:
      typeof session.payment_intent === "string" ? session.payment_intent : null,
    amount_total: session.amount_total,
    currency: session.currency,
    payment_status: session.payment_status,
  });

  if (insErr) {
    const dup = insErr.code === "23505" || insErr.message?.includes("duplicate");
    if (dup) {
      console.log("[/api/stripe/webhook] achat agent déjà enregistré (idempotent):", session.id);
    } else {
      console.error("[/api/stripe/webhook] insert achat agent échoué:", insErr);
      return NextResponse.json(
        { error: "insert_failed", message: insErr.message },
        { status: 500 },
      );
    }
  } else {
    console.log("[/api/stripe/webhook] achat agent enregistré:", slug, "pour", userId);
  }

  // Affiliation — non bloquant. Commission aussi sur les ventes à 4,90 €.
  const affiliateRef = sanitizeRef(session.metadata?.affiliate_ref || "");
  if (affiliateRef) {
    try {
      const { data: affiliate } = await admin
        .from("affiliates")
        .select("id, commission_rate, status")
        .eq("slug", affiliateRef)
        .maybeSingle();
      if (affiliate && affiliate.status === "active") {
        const amountTotal = session.amount_total ?? 0;
        const rate = Number(affiliate.commission_rate ?? 0);
        const commissionAmount = Math.round((amountTotal * rate) / 100);
        const { error: convErr } = await admin.from("affiliate_conversions").insert({
          affiliate_id: affiliate.id,
          affiliate_ref: affiliateRef,
          user_id: userId,
          email: session.customer_email ?? null,
          stripe_checkout_session_id: session.id, // UNIQUE → idempotence
          paid_questionnaire_response_id: null, // pas de questionnaire pour ces achats
          amount_total: amountTotal,
          commission_rate: rate,
          commission_amount: commissionAmount,
          commission_status: "unpaid",
        });
        if (convErr) {
          const dup = convErr.code === "23505" || convErr.message?.includes("duplicate");
          if (!dup) console.error("[/api/stripe/webhook] conv agent échouée (non bloquant):", convErr);
        } else {
          console.log("[/api/stripe/webhook] commission agent:", affiliateRef, commissionAmount, "centimes");
        }
      }
    } catch (e) {
      console.error("[/api/stripe/webhook] bloc affiliation agent (non bloquant):", e);
    }
  }

  return NextResponse.json({ received: true, processed: "ready_made_agent" });
}
