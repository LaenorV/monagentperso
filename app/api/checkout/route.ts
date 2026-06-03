import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { stripe } from "@/lib/stripe";
import { sanitizeRef } from "@/lib/affiliate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const isDev = process.env.NODE_ENV !== "production";

// En dev, renvoie l'erreur réelle pour faciliter le diagnostic.
// En prod, message générique.
function devOrGeneric(devMsg: string, prodMsg: string) {
  return isDev ? devMsg : prodMsg;
}

export async function POST(req: NextRequest) {
  // 1. Parse body — accepte { questionnaire } (flux modal) ou { pendingId } (flux /payment)
  let body: { questionnaire?: unknown; pendingId?: unknown; affiliate_ref?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "invalid_body", message: "Body JSON invalide." },
      { status: 400 },
    );
  }

  const questionnaire = body.questionnaire;
  const pendingIdInput = body.pendingId;
  // Affiliation : ref nettoyé. "" si absent/invalide → on stockera null.
  const bodyAffiliateRef = sanitizeRef(typeof body.affiliate_ref === "string" ? body.affiliate_ref : "");

  if (
    (!questionnaire || typeof questionnaire !== "object") &&
    (typeof pendingIdInput !== "string" || pendingIdInput.length === 0)
  ) {
    return NextResponse.json(
      {
        error: "missing_input",
        message: "Fournissez soit `questionnaire`, soit `pendingId`.",
      },
      { status: 400 },
    );
  }

  // 2. Auth check (cookies → session utilisateur)
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json(
      { error: "unauthenticated", message: "Vous devez être connecté pour réclamer votre agent." },
      { status: 401 },
    );
  }

  // 3. Config env
  const priceId = process.env.STRIPE_PRICE_ID;
  if (!priceId) {
    console.error("[/api/checkout] STRIPE_PRICE_ID manquant dans .env.local");
    return NextResponse.json(
      { error: "config_missing_price_id", message: "STRIPE_PRICE_ID manquant côté serveur." },
      { status: 500 },
    );
  }
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("[/api/checkout] SUPABASE_SERVICE_ROLE_KEY manquant");
    return NextResponse.json(
      { error: "config_missing_service_role", message: "SUPABASE_SERVICE_ROLE_KEY manquant côté serveur." },
      { status: 500 },
    );
  }
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;

  // 4. Récupère / crée le pending_questionnaire
  let admin;
  try {
    admin = createAdminClient();
  } catch (err) {
    console.error("[/api/checkout] createAdminClient failed:", err);
    return NextResponse.json(
      { error: "admin_client_error", message: err instanceof Error ? err.message : "Erreur admin client" },
      { status: 500 },
    );
  }

  let pending: { id: string } | null = null;
  // Ref affilié effectif pour cette session (body en flux modal, pending en flux /payment).
  let affiliateRef = bodyAffiliateRef;

  if (typeof pendingIdInput === "string" && pendingIdInput.length > 0) {
    // Cas A — flux /payment : reprise d'un pending existant. Sécurité : on vérifie ownership.
    const { data: existing, error: fetchErr } = await admin
      .from("pending_questionnaires")
      .select("id, user_id, status, affiliate_ref")
      .eq("id", pendingIdInput)
      .single();

    if (fetchErr || !existing) {
      console.error("[/api/checkout] pending introuvable:", pendingIdInput, fetchErr);
      return NextResponse.json(
        { error: "pending_not_found", message: "Questionnaire en attente introuvable." },
        { status: 404 },
      );
    }

    if (existing.user_id !== user.id) {
      console.error("[/api/checkout] ownership mismatch:", existing.user_id, "≠", user.id);
      return NextResponse.json(
        { error: "forbidden", message: "Ce questionnaire n'appartient pas à votre compte." },
        { status: 403 },
      );
    }

    if (existing.status !== "pending_payment") {
      return NextResponse.json(
        {
          error: "wrong_status",
          message: `Ce questionnaire est déjà au statut '${existing.status}'.`,
        },
        { status: 409 },
      );
    }

    pending = { id: existing.id };
    // En reprise, on conserve le ref déjà capté lors de la création du pending.
    affiliateRef = sanitizeRef(existing.affiliate_ref) || bodyAffiliateRef;
  } else {
    // Cas B — flux modal : insertion d'un nouveau pending.
    const { data: created, error: insertError } = await admin
      .from("pending_questionnaires")
      .insert({
        user_id: user.id,
        email: user.email,
        questionnaire,
        status: "pending_payment",
        affiliate_ref: affiliateRef || null,
      })
      .select()
      .single();

    if (insertError || !created) {
      console.error("[/api/checkout] Insert pending_questionnaire failed:", insertError);
      return NextResponse.json(
        {
          error: "db_insert_failed",
          message: devOrGeneric(
            `Insert pending_questionnaires : ${insertError?.message ?? "résultat vide"}. ` +
              "Vérifiez que la migration SQL a bien été exécutée dans Supabase.",
            "Impossible d'enregistrer votre demande. Réessayez.",
          ),
          details: isDev ? insertError : undefined,
        },
        { status: 500 },
      );
    }

    pending = { id: created.id };
  }

  // 5. Crée la Stripe Checkout Session
  // metadata : on n'ajoute affiliate_ref que s'il existe (valeurs Stripe = strings).
  const metadata: Record<string, string> = {
    pending_questionnaire_id: pending.id,
    user_id: user.id,
  };
  if (affiliateRef) metadata.affiliate_ref = affiliateRef;

  let session;
  try {
    session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: user.email ?? undefined,
      metadata,
      success_url: `${siteUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/payment/cancel`,
    });
  } catch (err) {
    console.error("[/api/checkout] Stripe Checkout creation failed:", err);
    return NextResponse.json(
      {
        error: "stripe_error",
        message: devOrGeneric(
          err instanceof Error ? `Stripe : ${err.message}` : "Erreur Stripe inconnue.",
          "Impossible de créer la session de paiement. Réessayez.",
        ),
      },
      { status: 500 },
    );
  }

  // 6. Met à jour le pending avec l'id de session Stripe
  await admin
    .from("pending_questionnaires")
    .update({ stripe_checkout_session_id: session.id })
    .eq("id", pending.id);

  if (!session.url) {
    console.error("[/api/checkout] Stripe session sans URL:", session.id);
    return NextResponse.json(
      { error: "no_url", message: "Stripe n'a pas retourné d'URL de paiement." },
      { status: 500 },
    );
  }

  console.log("[/api/checkout] OK — session", session.id, "→ redirect", session.url);
  return NextResponse.json({ url: session.url });
}
