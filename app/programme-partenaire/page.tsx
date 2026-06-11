import type { Metadata } from "next";
import Link from "next/link";
import { Link2, LineChart, BadgeCheck, Wallet, ShieldCheck, Mail } from "lucide-react";
import { getDict, getLocale, dictFor } from "@/lib/i18n/server";

const ICONS = [Link2, LineChart, BadgeCheck, Wallet, ShieldCheck, Mail];

export async function generateMetadata(): Promise<Metadata> {
  const t = dictFor(await getLocale());
  return { title: t.partner.metaTitle, description: t.partner.metaDesc };
}

export default async function ProgrammePartenairePage() {
  const t = await getDict();
  const p = t.partner;
  return (
    <div className="container" style={{ padding: "72px 0 90px", maxWidth: 880 }}>
      <span className="section-eyebrow">{p.eyebrow}</span>
      <h1 style={{ margin: "16px 0 0" }}>{p.h1}</h1>
      <p style={{ color: "var(--muted)", fontSize: 18, lineHeight: 1.6, marginTop: 18 }}>
        {p.intro}
      </p>

      <div className="card-grid" style={{ marginTop: 40, gridTemplateColumns: "repeat(3,1fr)" }}>
        {p.points.map((point, i) => {
          const Icon = ICONS[i];
          return (
            <article className="benefit-card" key={point.title}>
              <div className="big-picto"><Icon size={26} strokeWidth={1.9} /></div>
              <h3>{point.title}</h3>
              <p>{point.text}</p>
            </article>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 40,
          padding: "24px 28px",
          background: "var(--paper)",
          border: "1px solid var(--line)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow)",
        }}
      >
        <h2 style={{ fontSize: 22, margin: 0 }}>{p.howTitle}</h2>
        <ol style={{ color: "var(--ink-2)", lineHeight: 1.8, marginTop: 12, paddingLeft: 20 }}>
          {p.howSteps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
        <p style={{ color: "var(--muted)", fontSize: 14, marginTop: 14, lineHeight: 1.6 }}>
          {p.howNote}
        </p>
        <Link
          href="/"
          className="btn btn-primary btn-xl"
          style={{ marginTop: 22 }}
        >
          {p.cta}
        </Link>
        <p style={{ color: "var(--muted-2)", fontSize: 13, marginTop: 10 }}>
          {p.contactNote}
        </p>
      </div>
    </div>
  );
}
