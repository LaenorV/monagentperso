import { Gift, Ticket } from "lucide-react";
import WheelCtaButton from "@/components/wheel/WheelCtaButton";
import { getDict } from "@/lib/i18n/server";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export type PromoRow = {
  code: string;
  discount_type: string;
  discount_value: number;
  applies_to: string;
  status: string;
};

function usageLabel(p: PromoRow, d: Dictionary["dashboard"]): string {
  if (p.applies_to === "marketplace") return d.advMarketplaceFree;
  if (p.discount_value >= 100) return d.advAgentFree;
  return d.advDiscount.replace("{value}", String(p.discount_value));
}

export default async function MyAdvantages({
  promos,
  spun,
  spinLabel,
}: {
  promos: PromoRow[];
  spun: boolean;
  spinLabel: string | null;
}) {
  const t = await getDict();
  const d = t.dashboard;
  return (
    <div className="dashboard-card">
      <div className="agent-card-head">
        <h2>
          <Gift size={20} strokeWidth={2} style={{ verticalAlign: "-3px", marginRight: 8 }} />
          {d.advTitle}
        </h2>
        {!spun && <WheelCtaButton className="btn btn-primary btn-nav" />}
      </div>

      {!spun ? (
        <p style={{ color: "var(--muted)", marginTop: 8 }}>{d.advNotSpun}</p>
      ) : promos.length === 0 ? (
        <p style={{ color: "var(--muted)", marginTop: 8 }}>
          {d.advNoCodePrefix} <strong>{spinLabel ?? "—"}</strong>{d.advNoCodeSuffix}
        </p>
      ) : (
        <div className="advantages-list">
          {promos.map((p) => (
            <div className="advantage-item" key={p.code}>
              <div className="advantage-ico"><Ticket size={20} strokeWidth={2} /></div>
              <div className="advantage-info">
                <b>{usageLabel(p, d)}</b>
                <div className="advantage-meta">
                  <code className="advantage-code">{p.code}</code>
                  <span className={p.status === "active" ? "badge-unpaid" : "badge-paid"}>
                    {p.status === "active" ? d.advActive : d.advUsed}
                  </span>
                </div>
              </div>
            </div>
          ))}
          <p className="advantage-hint">{d.advHint}</p>
        </div>
      )}
    </div>
  );
}
