import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { stripe } from "@/lib/stripe";
import { getLocale, dictFor } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ session_id?: string }>;
};

function formatAmount(amount: number | null | undefined, currency: string | null | undefined, intlLocale: string) {
  if (amount == null || !currency) return null;
  try {
    return new Intl.NumberFormat(intlLocale, {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  } catch {
    return `${(amount / 100).toFixed(2)} ${currency.toUpperCase()}`;
  }
}

export default async function PaymentSuccessPage({ searchParams }: Props) {
  const { session_id: sessionId } = await searchParams;
  const locale = await getLocale();
  const p = dictFor(locale).payment;
  const intlLocale = locale === "en" ? "en-US" : "fr-FR";

  let confirmed = false;
  let amount: string | null = null;
  let email: string | null = null;

  if (sessionId) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      confirmed = session.payment_status === "paid";
      amount = formatAmount(session.amount_total, session.currency, intlLocale);
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
        <span className="section-eyebrow">{p.confirmedEyebrow}</span>
        <h1>{confirmed ? p.successTitle : p.processingTitle}</h1>
        <p style={{ fontSize: 17, color: "var(--muted)", lineHeight: 1.65, marginTop: 14 }}>
          {confirmed ? p.successBody : p.processingBody}
        </p>
        {amount && (
          <p style={{ marginTop: 18, fontSize: 22, fontWeight: 700, color: "var(--ink)" }}>
            {amount} {email && <small style={{ color: "var(--muted)", fontSize: 14, fontWeight: 500, display: "block", marginTop: 6 }}>{p.receiptTo.replace("{email}", email)}</small>}
          </p>
        )}
        <div style={{ display: "flex", gap: 12, flexDirection: "column", marginTop: 28 }}>
          <Link href="/dashboard" className="btn btn-primary btn-xl">{p.goSpace}</Link>
          <Link href="/" className="btn btn-light">{p.backHome}</Link>
        </div>
      </div>
    </div>
  );
}
