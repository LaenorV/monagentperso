import { Sparkles, Clock, CheckCircle2, AlertTriangle, ExternalLink } from "lucide-react";
import QuestionnaireCta from "@/components/QuestionnaireCta";
import { getLocale, dictFor } from "@/lib/i18n/server";
import type { Dictionary } from "@/lib/i18n/dictionaries";

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

function StatusBadge({ status, d }: { status: "pending" | "delivered" | "revision"; d: Dictionary["dashboard"] }) {
  const config = {
    pending: { label: d.badgePending, className: "status-badge-pending", Icon: Clock },
    delivered: { label: d.badgeDelivered, className: "status-badge-delivered", Icon: CheckCircle2 },
    revision: { label: d.badgeRevision, className: "status-badge-revision", Icon: AlertTriangle },
  }[status];
  const Icon = config.Icon;
  return (
    <span className={`status-badge ${config.className}`}>
      <Icon size={13} strokeWidth={2.5} /> {config.label}
    </span>
  );
}

export default async function MyAgentCard({ hasPaidOrder, delivery }: Props) {
  const locale = await getLocale();
  const t = dictFor(locale);
  const d = t.dashboard;
  const dateLocale = locale === "en" ? "en-US" : "fr-FR";

  // === Cas 1 : aucune commande payée ===
  if (!hasPaidOrder) {
    return (
      <div className="dashboard-card agent-card">
        <div className="agent-card-head">
          <h2>{d.myAgent}</h2>
        </div>
        <p>{d.notClaimed}</p>
        <div style={{ marginTop: 18 }}>
          <QuestionnaireCta className="btn btn-primary btn-xl">
            {d.claimCta}
          </QuestionnaireCta>
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
          <h2>{d.myAgent}</h2>
          <StatusBadge status="pending" d={d} />
        </div>
        <div className="agent-card-status">
          <div className="agent-card-status-ico"><Clock size={22} strokeWidth={2} /></div>
          <div>
            <p className="agent-card-headline">{d.receivedHeadline}</p>
            <p className="agent-card-sub">{d.receivedSub}</p>
            {delivery?.agent_name && (
              <p className="agent-card-meta">{d.plannedName} <strong>{delivery.agent_name}</strong></p>
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
          <h2>{d.myAgent}</h2>
          <StatusBadge status="revision" d={d} />
        </div>
        <div className="agent-card-status agent-card-status-revision">
          <div className="agent-card-status-ico"><AlertTriangle size={22} strokeWidth={2} /></div>
          <div>
            <p className="agent-card-headline">{d.revisionHeadline}</p>
            <p className="agent-card-sub">{d.revisionSub}</p>
            {delivery.admin_note && (
              <div className="agent-card-note">
                <strong>{d.teamNote}</strong>
                <p>{delivery.admin_note}</p>
              </div>
            )}
            {delivery.agent_name && (
              <p className="agent-card-meta">{d.agentConcerned} <strong>{delivery.agent_name}</strong></p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // === Cas 3 : agent livré ===
  const deliveredDate = delivery.delivered_at
    ? new Date(delivery.delivered_at).toLocaleDateString(dateLocale, {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="dashboard-card agent-card agent-card-delivered">
      <div className="agent-card-head">
        <h2>{d.myAgent}</h2>
        <StatusBadge status="delivered" d={d} />
      </div>
      <div className="agent-card-hero">
        <div className="agent-card-hero-ico"><Sparkles size={28} strokeWidth={1.8} /></div>
        <div>
          <p className="agent-card-headline">{d.agentReady}</p>
          {delivery.agent_name && (
            <p className="agent-card-name">{delivery.agent_name}</p>
          )}
          {deliveredDate && (
            <p className="agent-card-meta">{d.deliveredOn.replace("{date}", deliveredDate)}</p>
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
          {d.openAgent} <ExternalLink size={18} strokeWidth={2.2} />
        </a>
      ) : (
        <p className="agent-card-sub" style={{ marginTop: 18 }}>
          {d.linkByEmail}
        </p>
      )}

      {delivery.agent_instructions && (
        <div className="agent-card-instructions">
          <h3>{d.instructionsTitle}</h3>
          <p>{delivery.agent_instructions}</p>
        </div>
      )}
    </div>
  );
}
