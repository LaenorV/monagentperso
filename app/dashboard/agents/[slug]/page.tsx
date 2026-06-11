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
import { getAgentLocalized } from "@/lib/ready-made-agents";
import { getAgentInstructions } from "@/lib/agent-content";
import { getLocale, dictFor } from "@/lib/i18n/server";
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
  const locale = await getLocale();
  const agent = getAgentLocalized(slug, locale);
  if (!agent) redirect("/marketplace");
  const ad = dictFor(locale).agentDetail;

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
          <ArrowLeft size={15} /> {ad.backMarketplace}
        </Link>
        <div className="dashboard-card" style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: 26 }}>{ad.notUnlockedTitle}</h1>
          <p style={{ color: "var(--muted)", margin: "12px 0 20px" }}>
            <strong>{agent.name}</strong> — {agent.shortDescription}
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
            <AgentBuyButton slug={agent.slug} platform="gpt" priceLabel={agent.priceLabel} label={ad.versionGpt.replace("{price}", agent.priceLabel)} />
            <AgentBuyButton slug={agent.slug} platform="claude" priceLabel={agent.priceLabel} label={ad.versionClaude.replace("{price}", agent.priceLabel)} />
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
        <ArrowLeft size={15} /> {ad.backSpace}
      </Link>

      <span className="section-eyebrow">{ad.eyebrow}</span>
      <h1 style={{ margin: "10px 0 6px" }}>{agent.name}</h1>
      <p style={{ color: "var(--muted)", lineHeight: 1.6 }}>{agent.shortDescription}</p>

      {/* ===================== VERSION CHATGPT ===================== */}
      {ownsGpt && (
        <div className="dashboard-card agent-card agent-card-delivered" style={{ marginTop: 24 }}>
          <div className="agent-card-head">
            <h2>
              <Bot size={18} strokeWidth={2.1} style={{ verticalAlign: "-3px", marginRight: 8 }} />
              {ad.yourGpt}
            </h2>
            <span className="agent-badge agent-badge-gpt"><Bot size={11} strokeWidth={2.4} /> GPT</span>
          </div>

          {gptUrl ? (
            <>
              <p className="agent-card-sub" style={{ marginBottom: 16 }}>
                {ad.gptIntro}
              </p>
              <a
                href={gptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-xl agent-card-cta"
              >
                {ad.openGpt} <ExternalLink size={18} strokeWidth={2.2} />
              </a>
              <div className="agent-install" style={{ marginTop: 18 }}>
                <h3 style={{ fontSize: 15, marginTop: 0 }}>{ad.howToUse}</h3>
                <ol style={{ lineHeight: 1.7, color: "var(--ink-2)", paddingLeft: 20, margin: 0 }}>
                  {ad.gptSteps.map((s, i) => <li key={i}>{s}</li>)}
                </ol>
              </div>
            </>
          ) : (
            <p className="agent-card-sub">
              {ad.gptLinkByEmail}
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
              {ad.yourClaude}
            </h2>
            <span className="agent-badge agent-badge-claude"><Sparkles size={11} strokeWidth={2.4} /> Claude</span>
          </div>

          <p className="agent-card-sub" style={{ marginBottom: 14 }}>
            {ad.claudeIntroPre}<strong>{ad.claudeIntroStrong}</strong>{ad.claudeIntroSuffix}
          </p>

          <div className="agent-files">
            <a href={`/api/agents/${slug}/claude`} className="btn btn-primary agent-file-btn">
              <Download size={16} strokeWidth={2.2} /> {ad.dlInstructions}
            </a>
            <a href={`/api/agents/${slug}/knowledge`} className="btn btn-beige agent-file-btn">
              <Download size={16} strokeWidth={2.2} /> {ad.dlKnowledge}
            </a>
          </div>

          <div className="agent-install" style={{ marginTop: 18 }}>
            <h3 style={{ fontSize: 16, marginTop: 0 }}>{ad.claudeSetupTitle}</h3>
            <ol style={{ lineHeight: 1.75, color: "var(--ink-2)", paddingLeft: 20, margin: "0 0 12px" }}>
              {ad.claudeSteps.map((s, i) => (
                <li key={i} dangerouslySetInnerHTML={{ __html: s }} />
              ))}
            </ol>
            <div className="agent-docs-note">
              <FileText size={15} strokeWidth={2.1} />
              <div>
                <strong>{ad.docsNoteTitle}</strong>
                <p dangerouslySetInnerHTML={{ __html: ad.docsNote }} />
              </div>
            </div>
          </div>

          {claude && (
            <details className="agent-copy-details">
              <summary>{ad.copyDetailsSummary}</summary>
              <CopyBlock title={ad.copyTitle} text={claude} />
            </details>
          )}
        </div>
      )}
    </div>
  );
}
