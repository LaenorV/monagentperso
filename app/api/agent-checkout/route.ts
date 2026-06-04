import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";
import { sanitizeRef } from "@/lib/affiliate";
import { getAgent, AGENT_PRICE_CENTS } from "@/lib/ready-made-agents";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Checkout dédié aux AGENTS PRÊTS À L'EMPLOI (4,90 €).
// Séparé de /api/checkout (offre personnalisée 49,90 €) pour ne rien casser.
export async function POST(req: NextRequest) {
  // 1. Body
  let body: { agent_slug?: unknown; platform?: unknown; affiliate_ref?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }
  const slug = typeof body.agent_slug === "string" ? body.agent_slug : "";

  // Version choisie : "gpt" ou "claude" (défaut "gpt"). Détermine le contenu livré.
  const platform: "gpt" | "claude" = body.platform === "claude" ? "claude" : "gpt";

  // 2. Slug autorisé ? (source de vérité serveur)
  const agent = getAgent(slug);
  if (!agent) {
    return NextResponse.json(
      { error: "unknown_agent", message: "Agent inconnu." },
      { status: 400 },
    );
  }
  // L'agent doit proposer la version demandée (tous nos agents = "both").
  const offersPlatform =
    agent.type === "both" || agent.type === platform;
  if (!offersPlatform) {
    return NextResponse.json(
      { error: "platform_unavailable", message: "Version indisponible pour cet agent." },
      { status: 400 },
    );
  }

  // 3. Auth obligatoire
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json(
      { error: "unauthenticated", message: "Connectez-vous pour débloquer cet agent." },
      { status: 401 },
    );
  }

  // 4. Stripe (clé serveur uniquement)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;
  const affiliateRef = sanitizeRef(
    typeof body.affiliate_ref === "string" ? body.affiliate_ref : "",
  );

  // agent_type = la VERSION achetée (gpt | claude), pas le type catalogue.
  // C'est ce qui détermine le contenu auquel l'utilisateur aura accès.
  const platformLabel = platform === "claude" ? "Claude" : "ChatGPT";
  const metadata: Record<string, string> = {
    purchase_type: "ready_made_agent",
    agent_slug: agent.slug,
    agent_name: agent.name,
    agent_type: platform,
    user_id: user.id,
  };
  if (affiliateRef) metadata.affiliate_ref = affiliateRef;

  let session;
  try {
    session = await stripe.checkout.sessions.create({
      mode: "payment",
      // Prix DÉFINI CÔTÉ SERVEUR — on ne fait jamais confiance au frontend.
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: AGENT_PRICE_CENTS, // 490
            product_data: {
              name: `Agent ${platformLabel} — ${agent.name}`,
            },
          },
        },
      ],
      customer_email: user.email ?? undefined,
      metadata,
      success_url: `${siteUrl}/payment/agent-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/agents-gpt`,
    });
  } catch (err) {
    console.error("[/api/agent-checkout] Stripe error:", err);
    return NextResponse.json(
      { error: "stripe_error", message: "Impossible de créer la session de paiement." },
      { status: 500 },
    );
  }

  if (!session.url) {
    return NextResponse.json(
      { error: "no_url", message: "Stripe n'a pas retourné d'URL de paiement." },
      { status: 500 },
    );
  }

  console.log("[/api/agent-checkout] OK —", agent.slug, "session", session.id);
  return NextResponse.json({ url: session.url });
}
