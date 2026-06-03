import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default function AgentSuccessPage() {
  return (
    <div className="container payment-page">
      <div className="payment-box" style={{ textAlign: "center" }}>
        <div style={{ color: "var(--success)", display: "flex", justifyContent: "center", marginBottom: 8 }}>
          <CheckCircle2 size={56} strokeWidth={1.8} />
        </div>
        <span className="section-eyebrow">Paiement confirmé</span>
        <h1 style={{ margin: "12px 0 0" }}>Votre agent est débloqué 🎉</h1>
        <p style={{ fontSize: 17, color: "var(--muted)", lineHeight: 1.6, marginTop: 14 }}>
          Merci ! Vous retrouvez votre agent — ses instructions complètes et sa base de connaissance —
          dans votre espace utilisateur, section <strong>« Mes agents »</strong>.
        </p>
        <p style={{ fontSize: 14, color: "var(--muted-2)", marginTop: 8 }}>
          L'accès s'active dès la confirmation du paiement (quelques secondes). Si l'agent n'apparaît
          pas tout de suite, actualisez la page dans un instant.
        </p>
        <Link
          href="/dashboard"
          className="btn btn-primary btn-xl"
          style={{ width: "100%", marginTop: 22, justifyContent: "center" }}
        >
          Aller à mon espace →
        </Link>
        <Link
          href="/agents-gpt"
          className="btn btn-light"
          style={{ width: "100%", marginTop: 12, justifyContent: "center" }}
        >
          Voir d'autres agents
        </Link>
      </div>
    </div>
  );
}
