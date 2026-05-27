import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

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
    .select("id, user_id, email, questionnaire, status")
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

  // 8. Insert idempotent dans paid_questionnaire_responses
  //    Les contraintes UNIQUE sur pending_questionnaire_id et stripe_checkout_session_id
  //    rejettent les doublons → code Postgres 23505.
  const { error: insertErr } = await admin.from("paid_questionnaire_responses").insert({
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
  });

  if (insertErr) {
    const isDuplicate =
      insertErr.code === "23505" || insertErr.message?.includes("duplicate");
    if (isDuplicate) {
      console.log(
        "[/api/stripe/webhook] duplicate event — paid_response déjà inséré pour",
        pendingId,
      );
    } else {
      console.error("[/api/stripe/webhook] insert paid_response failed:", insertErr);
      return NextResponse.json(
        { error: "insert_failed", message: insertErr.message, details: insertErr },
        { status: 500 },
      );
    }
  } else {
    console.log("[/api/stripe/webhook] paid_response inséré pour pending", pendingId);
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

  return NextResponse.json({ received: true, processed: true });
}
