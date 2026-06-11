import { Zap } from "lucide-react";
import CtaButton from "@/components/CtaButton";
import { getDict } from "@/lib/i18n/server";

export default async function PricingPage() {
  const t = await getDict();
  const p = t.pricing;
  return (
    <div className="container pricing-page">
      <div className="flash-banner" style={{ margin: "0 auto 28px" }}>
        <Zap size={16} className="flash-ico" />
        {p.flashBanner}
        <Zap size={16} className="flash-ico" />
      </div>
      <span className="pricing-eyebrow">{p.eyebrow}</span>
      <h1 style={{ marginTop: 18 }}>
        {p.h1Prefix} <span style={{ textDecoration: "line-through", color: "var(--muted)" }}>79,90€</span>{" "}
        <span style={{ color: "var(--accent)" }}>49,90€</span>
      </h1>
      <p className="section-sub" style={{ marginTop: 18, maxWidth: 760, fontSize: 19 }}>
        {p.sub}
      </p>
      <div className="pricing-grid" style={{ marginTop: 40 }}>
        <div className="blog-card" style={{ cursor: "default" }}>
          <div className="big-picto">⏱</div>
          <h3>{p.card1Title}</h3>
          <p>{p.card1}</p>
        </div>
        <div className="blog-card" style={{ cursor: "default" }}>
          <div className="big-picto">✓</div>
          <h3>{p.card2Title}</h3>
          <p>{p.card2}</p>
          <CtaButton className="btn btn-primary btn-xl" style={{ marginTop: 8 }}>{p.cta}</CtaButton>
        </div>
      </div>
    </div>
  );
}
