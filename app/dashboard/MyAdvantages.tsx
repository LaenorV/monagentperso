import { Gift, Ticket } from "lucide-react";
import WheelCtaButton from "@/components/wheel/WheelCtaButton";

export type PromoRow = {
  code: string;
  discount_type: string;
  discount_value: number;
  applies_to: string;
  status: string;
};

function usageLabel(p: PromoRow): string {
  if (p.applies_to === "marketplace") return "1 achat marketplace offert";
  if (p.discount_value >= 100) return "Agent personnalisé offert";
  return `-${p.discount_value} % sur l'agent personnalisé`;
}

export default function MyAdvantages({
  promos,
  spun,
  spinLabel,
}: {
  promos: PromoRow[];
  spun: boolean;
  spinLabel: string | null;
}) {
  return (
    <div className="dashboard-card">
      <div className="agent-card-head">
        <h2>
          <Gift size={20} strokeWidth={2} style={{ verticalAlign: "-3px", marginRight: 8 }} />
          Mes avantages
        </h2>
        {!spun && <WheelCtaButton className="btn btn-primary btn-nav" />}
      </div>

      {!spun ? (
        <p style={{ color: "var(--muted)", marginTop: 8 }}>
          Vous n'avez pas encore tourné la roue. Tentez votre chance pour gagner une réduction ou un
          agent offert.
        </p>
      ) : promos.length === 0 ? (
        <p style={{ color: "var(--muted)", marginTop: 8 }}>
          Résultat de la roue : <strong>{spinLabel ?? "—"}</strong>. Pas de code cette fois — mais
          découvrez nos agents prêts à l'emploi dans la marketplace.
        </p>
      ) : (
        <div className="advantages-list">
          {promos.map((p) => (
            <div className="advantage-item" key={p.code}>
              <div className="advantage-ico"><Ticket size={20} strokeWidth={2} /></div>
              <div className="advantage-info">
                <b>{usageLabel(p)}</b>
                <div className="advantage-meta">
                  <code className="advantage-code">{p.code}</code>
                  <span className={p.status === "active" ? "badge-unpaid" : "badge-paid"}>
                    {p.status === "active" ? "Actif" : "Utilisé"}
                  </span>
                </div>
              </div>
            </div>
          ))}
          <p className="advantage-hint">
            Saisissez votre code au moment de payer (après le questionnaire pour l'agent personnalisé,
            ou dans la marketplace au moment de débloquer un agent).
          </p>
        </div>
      )}
    </div>
  );
}
