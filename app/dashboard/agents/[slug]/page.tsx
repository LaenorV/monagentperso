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
  if (!agent) redirect("/agents-gpt");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?redirectedFrom=/dashboard/agents/${slug}`);

  // Vérification d'achat CÔTÉ SERVEUR (RLS : l'utilisateur ne voit que ses achats).
  const { data: purchase } = await supabase
    .from("ready_made_agent_purchases")
    .select("id, created_at")
    .eq("user_id", user.id)
    .eq("agent_slug", slug)
    .maybeSingle();

  // Pas acheté → on n'affiche AUCUN contenu, juste l'invitation à débloquer.
  if (!purchase) {
    return (
      <div className="container" style={{ padding: "60px 0 90px", maxWidth: 640 }}>
        <Link href="/agents-gpt" className="agents-toggle" style={{ marginBottom: 18 }}>
          <ArrowLeft size={15} /> Retour aux agents
        </Link>
        <div className="dashboard-card" style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: 26 }}>Vous n'avez pas encore débloqué cet agent</h1>
          <p style={{ color: "var(--muted)", margin: "12px 0 20px" }}>
            <strong>{agent.name}</strong> — {agent.shortDescription}
          </p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <AgentBuyButton slug={agent.slug} priceLabel={agent.priceLabel} />
          </div>
        </div>
      </div>
    );
  }

  // Acheté → on lit le contenu complet (server-only) et on l'affiche.
  const { gpt, claude } = await getAgentInstructions(slug);

  return (
    <div className="container" style={{ padding: "48px 0 90px", maxWidth: 880 }}>
      <Link href="/dashboard" className="agents-toggle" style={{ marginBottom: 16 }}>
        <ArrowLeft size={15} /> Mon espace
      </Link>

      <span className="section-eyebrow">Agent débloqué</span>
      <h1 style={{ margin: "10px 0 6px" }}>{agent.name}</h1>
      <p style={{ color: "var(--muted)", lineHeight: 1.6 }}>{agent.shortDescription}</p>

      <div className="agent-install">
        <h2 style={{ fontSize: 18, marginTop: 0 }}>Comment l'installer (2 min)</h2>
        <ol style={{ lineHeight: 1.7, color: "var(--ink-2)", paddingLeft: 20 }}>
          <li>Téléchargez la base de connaissance (PDF) ci-dessous.</li>
          <li>
            Créez votre agent : <strong>ChatGPT</strong> → Explorer les GPTs → Créer, ou{" "}
            <strong>Claude</strong> → Projects → Create project.
          </li>
          <li>Collez les instructions ci-dessous dans le champ « Instructions ».</li>
          <li>Uploadez le PDF dans la « Knowledge » (GPT) / « Project knowledge » (Claude).</li>
          <li>Lancez une conversation : votre agent est prêt 🎉</li>
        </ol>
        <a
          href={`/api/agents/${slug}/knowledge`}
          className="btn btn-beige"
          style={{ marginTop: 6 }}
        >
          <Download size={16} strokeWidth={2.2} /> Télécharger la base de connaissance (PDF)
        </a>
      </div>

      {gpt && <CopyBlock title="Instructions — version ChatGPT (Custom GPT)" text={gpt} />}
      {claude && <CopyBlock title="Instructions — version Claude (Project)" text={claude} />}

      {!gpt && !claude && (
        <p className="auth-error" style={{ marginTop: 20 }}>
          <FileText size={15} /> Contenu temporairement indisponible. Contactez le support.
        </p>
      )}
    </div>
  );
}
