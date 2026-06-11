import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { getDict } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export default async function AgentSuccessPage() {
  const p = (await getDict()).payment;
  return (
    <div className="container payment-page">
      <div className="payment-box" style={{ textAlign: "center" }}>
        <div style={{ color: "var(--success)", display: "flex", justifyContent: "center", marginBottom: 8 }}>
          <CheckCircle2 size={56} strokeWidth={1.8} />
        </div>
        <span className="section-eyebrow">{p.confirmedEyebrow}</span>
        <h1 style={{ margin: "12px 0 0" }}>{p.agentTitle}</h1>
        <p style={{ fontSize: 17, color: "var(--muted)", lineHeight: 1.6, marginTop: 14 }}>
          {p.agentBodyPre}<strong>{p.agentBodyStrong}</strong>{p.agentBodySuffix}
        </p>
        <p style={{ fontSize: 14, color: "var(--muted-2)", marginTop: 8 }}>
          {p.agentBody2}
        </p>
        <Link
          href="/dashboard"
          className="btn btn-primary btn-xl"
          style={{ width: "100%", marginTop: 22, justifyContent: "center" }}
        >
          {p.agentGoSpace}
        </Link>
        <Link
          href="/agents-gpt"
          className="btn btn-light"
          style={{ width: "100%", marginTop: 12, justifyContent: "center" }}
        >
          {p.seeOtherAgents}
        </Link>
      </div>
    </div>
  );
}
