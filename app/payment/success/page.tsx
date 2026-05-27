import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { stripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ session_id?: string }>;
};

function formatAmount(amount: number | null | undefined, currency: string | null | undefined) {
  if (amount == null || !currency) return null;
  try {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  } catch {
    return `${(amount / 100).toFixed(2)} ${currency.toUpperCase()}`;
  }
}

export default async function PaymentSuccessPage({ searchParams }: Props) {
  const { session_id: sessionId } = await searchParams;

  let confirmed = false;
  let amount: string | null = null;
  let email: string | null = null;

  if (sessionId) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      confirmed = session.payment_status === "paid";
      amount = formatAmount(session.amount_total, session.currency);
      email = session.customer_details?.email ?? session.customer_email ?? null;
    } catch (err) {
      console.error("Stripe session retrieve failed:", err);
    }
  }

  return (
    <div className="container payment-page">
      <div className="payment-box">
        <div
          style={{
            width: 78,
            height: 78,
            borderRadius: 22,
            background: "var(--success)",
            color: "var(--paper)",
            display: "grid",
            placeItems: "center",
            margin: "0 auto 22px",
          }}
        >
          <CheckCircle2 size={42} strokeWidth={2} />
        </div>
        <span className="section-eyebrow">Paiement confirmé</span>
        <h1>{confirmed ? "Merci pour votre commande !" : "Paiement en cours de traitement…"}</h1>
        <p style={{ fontSize: 17, color: "var(--muted)", lineHeight: 1.65, marginTop: 14 }}>
          {confirmed
            ? "Vos réponses sont enregistrées. Vous recevrez votre agent IA personnalisé sous 24h maximum."
            : "Le traitement Stripe est en cours. Si ce message persiste, rafraîchissez la page dans quelques secondes."}
        </p>
        {amount && (
          <p style={{ marginTop: 18, fontSize: 22, fontWeight: 700, color: "var(--ink)" }}>
            {amount} {email && <small style={{ color: "var(--muted)", fontSize: 14, fontWeight: 500, display: "block", marginTop: 6 }}>Reçu envoyé à {email}</small>}
          </p>
        )}
        <div style={{ display: "flex", gap: 12, flexDirection: "column", marginTop: 28 }}>
          <Link href="/dashboard" className="btn btn-primary btn-xl">Accéder à mon espace →</Link>
          <Link href="/" className="btn btn-light">Retour à l'accueil</Link>
        </div>
      </div>
    </div>
  );
}
