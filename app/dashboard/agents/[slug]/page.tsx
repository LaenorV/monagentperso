import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Download,
  ArrowLeft,
  ExternalLink,
  Bot,
  Sparkles,
  FileText,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getAgent } from "@/lib/ready-made-agents";
import { getAgentInstructions } from "@/lib/agent-content";
import { getAgentGptUrl } from "@/lib/agent-links";
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
    .select("agent_type")
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

  const gptUrl = ownsGpt ? getAgentGptUrl(slug) : null;
  const { claude } = ownsClaude
    ? await getAgentInstructions(slug)
    : { claude: null as string | null };

  return (
    <div className="container" style={{ padding: "48px 0 90px", maxWidth: 880 }}>
      <Link href="/dashboard" className="agents-toggle" style={{ marginBottom: 16 }}>
        <ArrowLeft size={15} /> Mon espace
      </Link>

      <span className="section-eyebrow">Agent débloqué</span>
      <h1 style={{ margin: "10px 0 6px" }}>{agent.name}</h1>
      <p style={{ color: "var(--muted)", lineHeight: 1.6 }}>{agent.shortDescription}</p>

      {/* ===================== VERSION CHATGPT ===================== */}
      {ownsGpt && (
        <div className="dashboard-card agent-card agent-card-delivered" style={{ marginTop: 24 }}>
          <div className="agent-card-head">
            <h2>
              <Bot size={18} strokeWidth={2.1} style={{ verticalAlign: "-3px", marginRight: 8 }} />
              Votre agent ChatGPT
            </h2>
            <span className="agent-badge agent-badge-gpt"><Bot size={11} strokeWidth={2.4} /> GPT</span>
          </div>

          {gptUrl ? (
            <>
              <p className="agent-card-sub" style={{ marginBottom: 16 }}>
                Votre agent est déjà configuré et hébergé sur ChatGPT. Cliquez pour l'ouvrir, puis
                discutez directement — aucune installation nécessaire.
              </p>
              <a
                href={gptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-xl agent-card-cta"
              >
                Ouvrir mon agent GPT <ExternalLink size={18} strokeWidth={2.2} />
              </a>
              <div className="agent-install" style={{ marginTop: 18 }}>
                <h3 style={{ fontSize: 15, marginTop: 0 }}>Comment l'utiliser</h3>
                <ol style={{ lineHeight: 1.7, color: "var(--ink-2)", paddingLeft: 20, margin: 0 }}>
                  <li>Cliquez sur « Ouvrir mon agent GPT » (un compte ChatGPT est nécessaire).</li>
                  <li>Le GPT s'ajoute à votre barre latérale ChatGPT pour y revenir quand vous voulez.</li>
                  <li>Décrivez votre besoin en langage naturel : l'agent est déjà entraîné.</li>
                </ol>
              </div>
            </>
          ) : (
            <p className="agent-card-sub">
              Le lien de votre agent GPT vous a été envoyé par email. Si vous ne le retrouvez pas,
              contactez le support depuis votre espace.
            </p>
          )}
        </div>
      )}

      {/* ===================== VERSION CLAUDE ===================== */}
      {ownsClaude && (
        <div className="dashboard-card agent-card agent-card-delivered" style={{ marginTop: 24 }}>
          <div className="agent-card-head">
            <h2>
              <Sparkles size={18} strokeWidth={2.1} style={{ verticalAlign: "-3px", marginRight: 8 }} />
              Votre agent Claude
            </h2>
            <span className="agent-badge agent-badge-claude"><Sparkles size={11} strokeWidth={2.4} /> Claude</span>
          </div>

          <p className="agent-card-sub" style={{ marginBottom: 14 }}>
            Téléchargez vos deux fichiers, puis suivez le guide ci-dessous pour paramétrer votre agent
            dans un <strong>Projet Claude</strong>.
          </p>

          <div className="agent-files">
            <a href={`/api/agents/${slug}/claude`} className="btn btn-primary agent-file-btn">
              <Download size={16} strokeWidth={2.2} /> Télécharger le fichier instructions (.md)
            </a>
            <a href={`/api/agents/${slug}/knowledge`} className="btn btn-beige agent-file-btn">
              <Download size={16} strokeWidth={2.2} /> Télécharger la base de connaissance (PDF)
            </a>
          </div>

          <div className="agent-install" style={{ marginTop: 18 }}>
            <h3 style={{ fontSize: 16, marginTop: 0 }}>Paramétrer votre agent Claude (2 min)</h3>
            <ol style={{ lineHeight: 1.75, color: "var(--ink-2)", paddingLeft: 20, margin: "0 0 12px" }}>
              <li>
                Ouvrez <strong>claude.ai</strong> → menu <strong>« Projects »</strong> →{" "}
                <strong>« Create project »</strong> (donnez-lui le nom de l'agent).
              </li>
              <li>
                Ouvrez le projet, puis <strong>« Set custom instructions »</strong> (ou « Instructions »).
                Collez-y <strong>tout le contenu du fichier .md</strong> téléchargé. Enregistrez.
              </li>
              <li>
                Dans le projet, section <strong>« Project knowledge »</strong> →{" "}
                <strong>« Add content »</strong> → uploadez le <strong>PDF de connaissance</strong>.
              </li>
              <li>
                Démarrez une <strong>nouvelle conversation dans le projet</strong> : votre agent est prêt.
              </li>
            </ol>
            <div className="agent-docs-note">
              <FileText size={15} strokeWidth={2.1} />
              <div>
                <strong>Quels documents mettre dans « Project knowledge » ?</strong>
                <p>
                  Le <strong>PDF de connaissance fourni</strong> est indispensable (c'est le savoir
                  de l'agent). Vous pouvez aussi y ajouter <strong>vos propres documents</strong> pour
                  des réponses plus personnalisées — par exemple votre CV pour l'agent CV, votre cours
                  pour Fiches &amp; Quiz, ou votre brief pour Slides. Le fichier <strong>.md</strong>,
                  lui, va dans les <strong>instructions</strong> du projet, pas dans la connaissance.
                </p>
              </div>
            </div>
          </div>

          {claude && (
            <details className="agent-copy-details">
              <summary>Afficher / copier les instructions (au lieu de télécharger)</summary>
              <CopyBlock title="Instructions — version Claude (Project)" text={claude} />
            </details>
          )}
        </div>
      )}
    </div>
  );
}
