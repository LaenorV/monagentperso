import Link from "next/link";
import { redirect } from "next/navigation";
import { Download, ArrowLeft, FileText } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getAgent } from "@/lib/ready-made-agents";
import { getAgentInstructions } from "@/lib/agent-content";
import AgentBuyButton from "@/components/AgentBuyButton";
import CopyBlock from "./CopyBlock";

export const dynamic = "force-dynamic";

export default async function PurchasedAgentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const agent = getAgent(slug);
  if (!agent) redirect("/marketplace");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?redirectedFrom=/dashboard/agents/${slug}`);

  // Vérification d'achat CÔTÉ SERVEUR (RLS). On récupère TOUTES les versions achetées.
  const { data: purchases } = await supabase
    .from("ready_made_agent_purchases")
    .select("agent_type, created_at")
    .eq("user_id", user.id)
    .eq("agent_slug", slug);

  const types = (purchases ?? []).map((p) => p.agent_type);
  const ownsGpt = types.some((t) => t === "gpt" || t === "both");
  const ownsClaude = types.some((t) => t === "claude" || t === "both");

  // Pas acheté → aucun contenu, juste l'invitation à débloquer (par version).
  if (!ownsGpt && !ownsClaude) {
    return (
      <div className="container" style={{ padding: "60px 0 90px", maxWidth: 640 }}>
        <Link href="/marketplace" className="agents-toggle" style={{ marginBottom: 18 }}>
          <ArrowLeft size={15} /> Retour à la marketplace
        </Link>
        <div className="dashboard-card" style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: 26 }}>Vous n'avez pas encore débloqué cet agent</h1>
          <p style={{ color: "var(--muted)", margin: "12px 0 20px" }}>
            <strong>{agent.name}</strong> — {agent.shortDescription}
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
            <AgentBuyButton slug={agent.slug} platform="gpt" priceLabel={agent.priceLabel} label={`Version ChatGPT · ${agent.priceLabel}`} />
            <AgentBuyButton slug={agent.slug} platform="claude" priceLabel={agent.priceLabel} label={`Version Claude · ${agent.priceLabel}`} />
          </div>
        </div>
      </div>
    );
  }

  // Acheté → on lit le contenu, mais on n'affiche QUE la/les version(s) possédée(s).
  const { gpt, claude } = await getAgentInstructions(slug);
  const showGpt = ownsGpt && gpt;
  const showClaude = ownsClaude && claude;
  const onlyClaude = ownsClaude && !ownsGpt;

  return (
    <div className="container" style={{ padding: "48px 0 90px", maxWidth: 880 }}>
      <Link href="/dashboard" className="agents-toggle" style={{ marginBottom: 16 }}>
        <ArrowLeft size={15} /> Mon espace
      </Link>

      <span className="section-eyebrow">
        Agent débloqué · version {onlyClaude ? "Claude" : ownsGpt && ownsClaude ? "ChatGPT + Claude" : "ChatGPT"}
      </span>
      <h1 style={{ margin: "10px 0 6px" }}>{agent.name}</h1>
      <p style={{ color: "var(--muted)", lineHeight: 1.6 }}>{agent.shortDescription}</p>

      <div className="agent-install">
        <h2 style={{ fontSize: 18, marginTop: 0 }}>Comment l'installer (2 min)</h2>
        <ol style={{ lineHeight: 1.7, color: "var(--ink-2)", paddingLeft: 20 }}>
          <li>Téléchargez la base de connaissance (PDF) ci-dessous.</li>
          <li>
            {onlyClaude ? (
              <>Créez votre agent : <strong>Claude</strong> → Projects → Create project.</>
            ) : ownsGpt && ownsClaude ? (
              <>Créez votre agent : <strong>ChatGPT</strong> → Explorer les GPTs → Créer, ou <strong>Claude</strong> → Projects.</>
            ) : (
              <>Créez votre agent : <strong>ChatGPT</strong> → Explorer les GPTs → Créer.</>
            )}
          </li>
          <li>Collez les instructions ci-dessous dans le champ « Instructions ».</li>
          <li>Uploadez le PDF dans la « Knowledge » {onlyClaude ? "(Project knowledge)" : "(Knowledge)"}.</li>
          <li>Lancez une conversation : votre agent est prêt 🎉</li>
        </ol>
        <a href={`/api/agents/${slug}/knowledge`} className="btn btn-beige" style={{ marginTop: 6 }}>
          <Download size={16} strokeWidth={2.2} /> Télécharger la base de connaissance (PDF)
        </a>
      </div>

      {showGpt && <CopyBlock title="Instructions — version ChatGPT (Custom GPT)" text={gpt!} />}
      {showClaude && <CopyBlock title="Instructions — version Claude (Project)" text={claude!} />}

      {!showGpt && !showClaude && (
        <p className="auth-error" style={{ marginTop: 20 }}>
          <FileText size={15} /> Contenu temporairement indisponible. Contactez le support.
        </p>
      )}
    </div>
  );
}
