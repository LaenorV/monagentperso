import { FileText } from "lucide-react";

type CheckboxAnswer = { selected: string[]; other?: string };
type AnyAnswer = string | string[] | CheckboxAnswer | Record<string, unknown> | null | undefined;

type Props = {
  paidAt: string;
  questionnaire: Record<string, AnyAnswer>;
};

// Champs clés à afficher en résumé (ordre voulu)
const KEY_FIELDS = [
  "Métier",
  "Spécialité",
  "Statut",
  "Entreprise",
  "Rôle agent",
  "Plateforme",
  "Nom agent",
] as const;

function formatAnswer(value: AnyAnswer): string | null {
  if (value == null || value === "") return null;
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.length > 0 ? value.join(" · ") : null;
  if (typeof value === "object") {
    // CheckboxAnswer { selected, other? }
    const obj = value as { selected?: unknown; other?: unknown };
    if (Array.isArray(obj.selected)) {
      const parts = [...obj.selected];
      if (typeof obj.other === "string" && obj.other.trim().length > 0) parts.push(obj.other);
      return parts.length > 0 ? parts.join(" · ") : null;
    }
  }
  return null;
}

export default function MyRequestCard({ paidAt, questionnaire }: Props) {
  const date = new Date(paidAt).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const rows = KEY_FIELDS.map((key) => ({
    key,
    value: formatAnswer(questionnaire[key]),
  })).filter((r) => r.value !== null);

  if (rows.length === 0) {
    return null;
  }

  return (
    <div className="dashboard-card request-card">
      <div className="request-card-head">
        <div className="request-card-ico"><FileText size={20} strokeWidth={2} /></div>
        <div>
          <h2>Votre demande</h2>
          <p className="request-card-date">Soumise le {date}</p>
        </div>
      </div>
      <dl className="request-grid">
        {rows.map(({ key, value }) => (
          <div className="request-row" key={key}>
            <dt>{key}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
