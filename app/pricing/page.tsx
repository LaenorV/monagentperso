import { Zap } from "lucide-react";
import CtaButton from "@/components/CtaButton";

export default function PricingPage() {
  return (
    <div className="container pricing-page">
      <div className="flash-banner" style={{ margin: "0 auto 28px" }}>
        <Zap size={16} className="flash-ico" />
        Jusqu'au 21 juin, bénéficiez d'une offre unique de lancement
        <Zap size={16} className="flash-ico" />
      </div>
      <span className="pricing-eyebrow">Offre de lancement</span>
      <h1 style={{ marginTop: 18 }}>
        Offre de lancement : <span style={{ textDecoration: "line-through", color: "var(--muted)" }}>79,90€</span>{" "}
        <span style={{ color: "var(--accent)" }}>49,90€</span>
      </h1>
      <p className="section-sub" style={{ marginTop: 18, maxWidth: 760, fontSize: 19 }}>
        Le prix inclut le questionnaire, l'analyse de vos réponses, la création de votre agent IA personnalisé et la livraison sous 24h maximum à l'adresse email renseignée.
      </p>
      <div className="pricing-grid" style={{ marginTop: 40 }}>
        <div className="blog-card" style={{ cursor: "default" }}>
          <div className="big-picto">⏱</div>
          <h3>24h maximum</h3>
          <p>Vous recevez votre agent professionnel personnalisé rapidement, sans long cycle projet.</p>
        </div>
        <div className="blog-card" style={{ cursor: "default" }}>
          <div className="big-picto">✓</div>
          <h3>49,90€ en lancement</h3>
          <p>Un prix fixe, clair, réduit temporairement par rapport au tarif standard de 79,90€.</p>
          <CtaButton className="btn btn-primary btn-xl" style={{ marginTop: 8 }}>Réclamer mon agent IA →</CtaButton>
        </div>
      </div>
    </div>
  );
}
