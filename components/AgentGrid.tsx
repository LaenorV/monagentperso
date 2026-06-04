import Link from "next/link";
import { Bot, Sparkles, Check, ArrowRight } from "lucide-react";
import { agentsByType, AGENT_PRICE_LABEL } from "@/lib/ready-made-agents";
import AgentBuyButton from "./AgentBuyButton";
import ResumePurchaseBanner from "./ResumePurchaseBanner";

type Props = { platform: "gpt" | "claude" };

export default function AgentGrid({ platform }: Props) {
  const agents = agentsByType(platform);
  const isGpt = platform === "gpt";
  const other = isGpt
    ? { href: "/agents-claude", label: "Voir les agents Claude" }
    : { href: "/agents-gpt", label: "Voir les agents GPT" };

  return (
    <div className="container agents-page">
      <ResumePurchaseBanner />

      {/* HERO */}
      <div className="agents-hero">
        <span className="section-eyebrow">
          {isGpt ? "Agents GPT" : "Agents Claude"} · prêts à l'emploi
        </span>
        <h1 className="agents-title">
          Des agents experts, prêts en 2 minutes.
        </h1>
        <p className="agents-sub">
          Débloquez un agent {isGpt ? "ChatGPT" : "Claude"} déjà conçu et sur-entraîné pour une mission
          précise. Vous recevez ses instructions complètes et sa base de connaissance, à coller dans
          votre {isGpt ? "Custom GPT" : "Projet Claude"}. Simple, immédiat, réutilisable à volonté.
        </p>

        {/* Différenciation des deux offres */}
        <div className="agents-offers">
          <div className="agents-offer">
            <span className="agents-offer-tag">Prêt à l'emploi</span>
            <b>{AGENT_PRICE_LABEL}</b>
            <span>par agent · accès immédiat</span>
          </div>
          <div className="agents-offer-vs">ou</div>
          <div className="agents-offer agents-offer-muted">
            <span className="agents-offer-tag">Sur-mesure</span>
            <b>49,90 €</b>
            <span>agent 100 % personnalisé, livré sous 24h</span>
            <Link href="/" className="agents-offer-link">
              Découvrir l'offre personnalisée →
            </Link>
          </div>
        </div>

        <Link href={other.href} className="agents-toggle">
          {isGpt ? <Sparkles size={15} /> : <Bot size={15} />} {other.label}
        </Link>
      </div>

      {/* GRILLE */}
      <div className="agents-grid">
        {agents.map((a) => (
          <article className="agent-card" key={a.slug}>
            <div className="agent-card-head">
              <div className="agent-card-logo">{a.name.charAt(0)}</div>
              <div className="agent-card-badges">
                {(a.type === "gpt" || a.type === "both") && (
                  <span className="agent-badge agent-badge-gpt">
                    <Bot size={11} strokeWidth={2.4} /> GPT
                  </span>
                )}
                {(a.type === "claude" || a.type === "both") && (
                  <span className="agent-badge agent-badge-claude">
                    <Sparkles size={11} strokeWidth={2.4} /> Claude
                  </span>
                )}
              </div>
            </div>

            <span className="agent-card-cat">{a.category}</span>
            <h3 className="agent-card-name">{a.name}</h3>
            <p className="agent-card-desc">{a.shortDescription}</p>

            <ul className="agent-preview">
              {a.publicPreview.map((p) => (
                <li key={p}>
                  <Check size={14} strokeWidth={2.5} /> {p}
                </li>
              ))}
            </ul>

            <div className="agent-card-foot">
              <div className="agent-price">
                {a.priceLabel} <small>TTC</small>
              </div>
              <AgentBuyButton slug={a.slug} priceLabel={a.priceLabel} />
            </div>
            <p className="agent-card-note">
              Contenu complet débloqué après paiement, dans votre espace.
            </p>
          </article>
        ))}
      </div>

      <div className="agents-bottom">
        <Link href="/dashboard" className="btn btn-light">
          Mes agents achetés <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
