import Link from "next/link";
import { Bot, Sparkles, ArrowRight, ShoppingBag } from "lucide-react";

export type AgentPurchase = {
  agent_slug: string;
  agent_name: string;
  agent_type: string | null;
  created_at: string;
};

export default function PurchasedAgents({ purchases }: { purchases: AgentPurchase[] }) {
  return (
    <div className="dashboard-card">
      <div className="agent-card-head">
        <h2>Mes agents</h2>
        <Link href="/agents-gpt" className="btn btn-light btn-nav">
          <ShoppingBag size={15} strokeWidth={2.2} /> Découvrir d'autres agents
        </Link>
      </div>

      {purchases.length === 0 ? (
        <p style={{ color: "var(--muted)", marginTop: 10 }}>
          Vous n'avez pas encore débloqué d'agent prêt à l'emploi.{" "}
          <Link href="/agents-gpt" style={{ color: "var(--accent)", fontWeight: 700 }}>
            Voir le catalogue (4,90 €)
          </Link>
          .
        </p>
      ) : (
        <div className="purchased-agents">
          {purchases.map((p) => {
            const date = new Date(p.created_at).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            });
            return (
              <div className="purchased-agent" key={p.agent_slug}>
                <div className="purchased-agent-logo">{p.agent_name.charAt(0)}</div>
                <div className="purchased-agent-info">
                  <b>{p.agent_name}</b>
                  <div className="purchased-agent-meta">
                    {(p.agent_type === "gpt" || p.agent_type === "both") && (
                      <span className="agent-badge agent-badge-gpt">
                        <Bot size={11} strokeWidth={2.4} /> GPT
                      </span>
                    )}
                    {(p.agent_type === "claude" || p.agent_type === "both") && (
                      <span className="agent-badge agent-badge-claude">
                        <Sparkles size={11} strokeWidth={2.4} /> Claude
                      </span>
                    )}
                    <span className="purchased-agent-date">Débloqué le {date}</span>
                  </div>
                </div>
                <Link
                  href={`/dashboard/agents/${p.agent_slug}`}
                  className="btn btn-primary btn-nav"
                >
                  Ouvrir <ArrowRight size={15} strokeWidth={2.2} />
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
