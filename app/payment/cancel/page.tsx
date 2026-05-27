import Link from "next/link";
import { XCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default function PaymentCancelPage() {
  return (
    <div className="container payment-page">
      <div className="payment-box">
        <div
          style={{
            width: 78,
            height: 78,
            borderRadius: 22,
            background: "var(--danger)",
            color: "var(--paper)",
            display: "grid",
            placeItems: "center",
            margin: "0 auto 22px",
          }}
        >
          <XCircle size={42} strokeWidth={2} />
        </div>
        <span className="section-eyebrow">Paiement annulé</span>
        <h1>Paiement non finalisé</h1>
        <p style={{ fontSize: 17, color: "var(--muted)", lineHeight: 1.65, marginTop: 14 }}>
          Aucun montant n'a été débité. Vos réponses au questionnaire ont été conservées, vous pouvez
          relancer le paiement à tout moment depuis votre espace.
        </p>
        <div style={{ display: "flex", gap: 12, flexDirection: "column", marginTop: 28 }}>
          <Link href="/dashboard?openQuestionnaire=1" className="btn btn-primary btn-xl">
            Reprendre la commande →
          </Link>
          <Link href="/" className="btn btn-light">Retour à l'accueil</Link>
        </div>
      </div>
    </div>
  );
}
