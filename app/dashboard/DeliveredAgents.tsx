import { Sparkles, CheckCircle2, ExternalLink } from "lucide-react";
import type { AgentDelivery } from "./MyAgentCard";

/**
 * Affiche les lignes de public.agent_deliveries au statut "delivered"
 * pour l'utilisateur connecté : nom de l'agent, instructions, et bouton
 * "Ouvrir mon agent GPT" (ouvre agent_url dans un nouvel onglet).
 * Les données sont déjà filtrées par user_id côté serveur (RLS + .eq).
 */
export default function DeliveredAgents({ deliveries }: { deliveries: AgentDelivery[] }) {
  return (
    <>
      {deliveries.map((d) => {
        const deliveredDate = d.delivered_at
          ? new Date(d.delivered_at).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })
          : null;

        return (
          <div className="dashboard-card agent-card agent-card-delivered" key={d.id}>
            <div className="agent-card-head">
              <h2>Mon agent personnalisé</h2>
              <span className="status-badge status-badge-delivered">
                <CheckCircle2 size={13} strokeWidth={2.5} /> Livré
              </span>
            </div>

            <div className="agent-card-hero">
              <div className="agent-card-hero-ico">
                <Sparkles size={28} strokeWidth={1.8} />
              </div>
              <div>
                <p className="agent-card-headline">Votre agent est prêt.</p>
                {d.agent_name && <p className="agent-card-name">{d.agent_name}</p>}
                {deliveredDate && <p className="agent-card-meta">Livré le {deliveredDate}</p>}
              </div>
            </div>

            {d.agent_url ? (
              <a
                href={d.agent_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-xl agent-card-cta"
              >
                Ouvrir mon agent GPT <ExternalLink size={18} strokeWidth={2.2} />
              </a>
            ) : (
              <p className="agent-card-sub" style={{ marginTop: 18 }}>
                Le lien d'accès à votre agent vous a été envoyé par email.
              </p>
            )}

            {d.agent_instructions && (
              <div className="agent-card-instructions">
                <h3>Instructions d'utilisation</h3>
                <p>{d.agent_instructions}</p>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
