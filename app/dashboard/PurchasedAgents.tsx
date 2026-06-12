import Link from "next/link";
import { Store, Bot, Sparkles, ArrowRight } from "lucide-react";
import { getLocale, dictFor } from "@/lib/i18n/server";
import { getAgentLocalized } from "@/lib/ready-made-agents";

export type AgentPurchaseRow = {
  agent_slug: string;
  agent_name: string;
  agent_type: string | null;
  created_at: string;
};

type Grouped = {
  slug: string;
  name: string;
  description: string;
  types: Set<string>;
  date: string;
};

/**
 * Section dédiée « Mes agents achetés » (marketplace 4,90 €).
 * Lit public.ready_made_agent_purchases (deja filtre par user_id cote serveur).
 * Regroupe par slug (un utilisateur peut posseder les versions GPT et Claude).
 */
export default async function PurchasedAgents({
  purchases,
}: {
  purchases: AgentPurchaseRow[];
}) {
  const locale = await getLocale();
  const t = dictFor(locale);
  const d = t.dashboard;
  const dateLocale = locale === "en" ? "en-US" : "fr-FR";

  // Regroupe par slug, en conservant la date la plus recente.
  const bySlug = new Map<string, Grouped>();
  for (const p of purchases) {
    const agent = getAgentLocalized(p.agent_slug, locale);
    const existing = bySlug.get(p.agent_slug);
    if (existing) {
      if (p.agent_type) existing.types.add(p.agent_type);
      if (new Date(p.created_at) > new Date(existing.date)) existing.date = p.created_at;
    } else {
      bySlug.set(p.agent_slug, {
        slug: p.agent_slug,
        name: agent?.name ?? p.agent_name,
        description: agent?.shortDescription ?? "",
        types: new Set(p.agent_type ? [p.agent_type] : []),
        date: p.created_at,
      });
    }
  }
  const agents = [...bySlug.values()];

  return (
    <div className="dashboard-card">
      <div className="agent-card-head">
        <h2>
          <Store size={20} strokeWidth={2} style={{ verticalAlign: "-3px", marginRight: 8 }} />
          {d.purchasedTitle}
        </h2>
        <Link href="/agents-gpt" className="btn btn-light btn-nav">{d.libDiscover}</Link>
      </div>

      {agents.length === 0 ? (
        <div className="library-empty">
          <p>{d.purchasedEmpty}</p>
          <Link href="/agents-gpt" className="btn btn-primary">{d.purchasedEmptyCta}</Link>
        </div>
      ) : (
        <div className="library-grid">
          {agents.map((a) => (
            <article className="library-item" key={a.slug}>
              <div className="library-item-top">
                <div className="purchased-agent-logo">{a.name.charAt(0)}</div>
                <div className="agent-card-badges">
                  {(a.types.has("gpt") || a.types.has("both")) && (
                    <span className="agent-badge agent-badge-gpt"><Bot size={11} strokeWidth={2.4} /> GPT</span>
                  )}
                  {(a.types.has("claude") || a.types.has("both")) && (
                    <span className="agent-badge agent-badge-claude"><Sparkles size={11} strokeWidth={2.4} /> Claude</span>
                  )}
                </div>
              </div>
              <h3 className="library-item-name">{a.name}</h3>
              {a.description && <p className="amk-desc" style={{ margin: "4px 0 8px" }}>{a.description}</p>}
              <div className="library-item-meta">
                <span className="purchased-agent-date">
                  {d.purchasedOn.replace(
                    "{date}",
                    new Date(a.date).toLocaleDateString(dateLocale, {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }),
                  )}
                </span>
              </div>
              <div className="library-item-foot">
                <Link href={`/dashboard/agents/${a.slug}`} className="btn btn-primary btn-nav">
                  {d.purchasedOpen} <ArrowRight size={15} strokeWidth={2.2} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
