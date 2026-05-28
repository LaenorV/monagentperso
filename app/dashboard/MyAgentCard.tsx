import Link from "next/link";
import { Sparkles, Clock, CheckCircle2, AlertTriangle, ExternalLink } from "lucide-react";

export type DeliveryStatus = "in_progress" | "delivered" | "revision_needed";

export type AgentDelivery = {
  id: string;
  status: DeliveryStatus;
  agent_name: string | null;
  agent_url: string | null;
  agent_instructions: string | null;
  admin_note: string | null;
  delivered_at: string | null;
  created_at: string;
};

type Props = {
  hasPaidOrder: boolean;
  delivery: AgentDelivery | null;
};

function StatusBadge({ status }: { status: "pending" | "delivered" | "revision" }) {
  const config = {
    pending: { label: "En cours", className: "status-badge-pending", Icon: Clock },
    delivered: { label: "Livré", className: "status-badge-delivered", Icon: CheckCircle2 },
    revision: { label: "Modification en cours", className: "status-badge-revision", Icon: AlertTriangle },
  }[status];
  const Icon = config.Icon;
  return (
    <span className={`status-badge ${config.className}`}>
      <Icon size={13} strokeWidth={2.5} /> {config.label}
    </span>
  );
}

export default function MyAgentCard({ hasPaidOrder, delivery }: Props) {
  // === Cas 1 : aucune commande payée ===
  if (!hasPaidOrder) {
    return (
      <div className="dashboard-card agent-card">
        <div className="agent-card-head">
          <h2>Mon agent</h2>
        </div>
        <p>Vous n'avez pas encore réclamé votre agent.</p>
        <div style={{ marginTop: 18 }}>
          <Link href="/" className="btn btn-primary btn-xl">
            Réclamer mon agent →
          </Link>
        </div>
      </div>
    );
  }

  // === Cas 2 : commande payée mais aucune livraison enregistrée OU livraison en cours ===
  const isPending = !delivery || delivery.status === "in_progress";
  if (isPending) {
    return (
      <div className="dashboard-card agent-card">
        <div className="agent-card-head">
          <h2>Mon agent</h2>
          <StatusBadge status="pending" />
        </div>
        <div className="agent-card-status">
          <div className="agent-card-status-ico"><Clock size={22} strokeWidth={2} /></div>
          <div>
            <p className="agent-card-headline">Votre demande a bien été reçue.</p>
            <p className="agent-card-sub">
              Votre agent personnalisé est en cours de création. Il sera prêt sous 24h,
              envoyé par email et retrouvable directement dans cet espace utilisateur.
            </p>
            {delivery?.agent_name && (
              <p className="agent-card-meta">Nom prévu : <strong>{delivery.agent_name}</strong></p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // === Cas 4 : modification en cours ===
  if (delivery.status === "revision_needed") {
    return (
      <div className="dashboard-card agent-card">
        <div className="agent-card-head">
          <h2>Mon agent</h2>
          <StatusBadge status="revision" />
        </div>
        <div className="agent-card-status agent-card-status-revision">
          <div className="agent-card-status-ico"><AlertTriangle size={22} strokeWidth={2} /></div>
          <div>
            <p className="agent-card-headline">Une modification est en cours.</p>
            <p className="agent-card-sub">
              Nous ajustons votre agent suite à votre retour. Il sera de nouveau disponible
              très rapidement.
            </p>
            {delivery.admin_note && (
              <div className="agent-card-note">
                <strong>Note de l'équipe :</strong>
                <p>{delivery.admin_note}</p>
              </div>
            )}
            {delivery.agent_name && (
              <p className="agent-card-meta">Agent concerné : <strong>{delivery.agent_name}</strong></p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // === Cas 3 : agent livré ===
  const deliveredDate = delivery.delivered_at
    ? new Date(delivery.delivered_at).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="dashboard-card agent-card agent-card-delivered">
      <div className="agent-card-head">
        <h2>Mon agent</h2>
        <StatusBadge status="delivered" />
      </div>
      <div className="agent-card-hero">
        <div className="agent-card-hero-ico"><Sparkles size={28} strokeWidth={1.8} /></div>
        <div>
          <p className="agent-card-headline">Votre agent est prêt.</p>
          {delivery.agent_name && (
            <p className="agent-card-name">{delivery.agent_name}</p>
          )}
          {deliveredDate && (
            <p className="agent-card-meta">Livré le {deliveredDate}</p>
          )}
        </div>
      </div>

      {delivery.agent_url ? (
        <a
          href={delivery.agent_url}
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

      {delivery.agent_instructions && (
        <div className="agent-card-instructions">
          <h3>Instructions d'utilisation</h3>
          <p>{delivery.agent_instructions}</p>
        </div>
      )}
    </div>
  );
}
