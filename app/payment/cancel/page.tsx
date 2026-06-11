import Link from "next/link";
import { XCircle } from "lucide-react";
import { getDict } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export default async function PaymentCancelPage() {
  const p = (await getDict()).payment;
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
        <span className="section-eyebrow">{p.cancelEyebrow}</span>
        <h1>{p.cancelTitle}</h1>
        <p style={{ fontSize: 17, color: "var(--muted)", lineHeight: 1.65, marginTop: 14 }}>
          {p.cancelBody}
        </p>
        <div style={{ display: "flex", gap: 12, flexDirection: "column", marginTop: 28 }}>
          <Link href="/dashboard?openQuestionnaire=1" className="btn btn-primary btn-xl">
            {p.resumeOrder}
          </Link>
          <Link href="/" className="btn btn-light">{p.backHome}</Link>
        </div>
      </div>
    </div>
  );
}
