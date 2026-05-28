"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, X, Check, Bot, Sparkles } from "lucide-react";

type CaseData = {
  id: string;
  persona: string;
  scenario: string;
  chatgpt: {
    src: string;
    bullets: string[];
  };
  agent: {
    src: string;
    bullets: string[];
  };
};

const cases: CaseData[] = [
  {
    id: "julien",
    persona: "Julien · Mandataire immobilier Lyon",
    scenario: "Rédaction d'une annonce T3 haussmannien",
    chatgpt: {
      src: "/videos/julien-chatgpt.mp4",
      bullets: [
        "Prompt plus long à rédiger",
        "Résultat trop court",
        "Ajout de gras automatiquement",
        "Pas copiable directement",
        "Invente des données qu'il ne possède pas",
        "Annonce très amatrice",
      ],
    },
    agent: {
      src: "/videos/julien-agent.mp4",
      bullets: [
        "Prompt en quelques lignes",
        "Résultat copiable sans modification",
        "L'agent n'invente rien",
        "Précise ce qu'il reste à compléter",
        "Ton pro inspiré des meilleures annonces",
        "Connaît déjà les tâches du métier",
        "Système de commandes /",
        "Mémorise toutes les informations transmises",
      ],
    },
  },
  {
    id: "lea",
    persona: "Léa · Coach sportive Bordeaux",
    scenario: "Message WhatsApp à une cliente démotivée",
    chatgpt: {
      src: "/videos/lea-chatgpt.mp4",
      bullets: [
        "Prompt immense avec beaucoup de précisions à ajouter",
        "+ de 10 min perdues à rédiger",
        "Résultat non conforme aux demandes",
        "Règles métier non respectées",
        "Besoin de re-prompter et de modifier",
      ],
    },
    agent: {
      src: "/videos/lea-agent.mp4",
      bullets: [
        "Récap de toutes les actions de l'agent",
        "Commandes / pour un gain de temps immédiat",
        "Respect des consignes de l'utilisatrice",
        "Copiable directement",
        "Concis comme demandé",
        "Tutoiement et proximité avec la cliente",
        "7 lignes max, comme exigé",
        "Prompt rédigé en quelques dizaines de secondes",
      ],
    },
  },
];

export default function ComparisonVideos() {
  const [idx, setIdx] = useState(0);
  const current = cases[idx];
  const prev = () => setIdx((i) => (i - 1 + cases.length) % cases.length);
  const next = () => setIdx((i) => (i + 1) % cases.length);

  return (
    <div className="compare-stage">
      <div className="compare-head">
        <button
          type="button"
          className="compare-nav"
          onClick={prev}
          aria-label="Cas précédent"
          disabled={cases.length <= 1}
        >
          <ChevronLeft size={22} strokeWidth={2.2} />
        </button>
        <div className="compare-meta">
          <span className="compare-eyebrow">
            Cas n°{idx + 1} sur {cases.length}
          </span>
          <h3 className="compare-title">{current.persona}</h3>
          <p className="compare-scenario">{current.scenario}</p>
        </div>
        <button
          type="button"
          className="compare-nav"
          onClick={next}
          aria-label="Cas suivant"
          disabled={cases.length <= 1}
        >
          <ChevronRight size={22} strokeWidth={2.2} />
        </button>
      </div>

      <div className="compare-grid">
        {/* === ChatGPT classique === */}
        <article className="compare-col compare-col-bad">
          <div className="compare-badge compare-badge-bad">
            <Bot size={14} strokeWidth={2.4} /> ChatGPT classique
          </div>
          <div className="compare-video-wrap">
            <video
              key={`chatgpt-${current.id}`}
              src={current.chatgpt.src}
              controls
              preload="metadata"
              playsInline
              className="compare-video"
            />
          </div>
          <ul className="compare-bullets compare-bullets-bad">
            {current.chatgpt.bullets.map((b, i) => (
              <li key={i}>
                <span className="compare-bullet-ico">
                  <X size={13} strokeWidth={3} />
                </span>
                {b}
              </li>
            ))}
          </ul>
        </article>

        {/* === Diviseur VS === */}
        <div className="compare-vs" aria-hidden="true">
          VS
        </div>

        {/* === Agent personnalisé === */}
        <article className="compare-col compare-col-good">
          <div className="compare-badge compare-badge-good">
            <Sparkles size={14} strokeWidth={2.4} /> Agent personnalisé
          </div>
          <div className="compare-video-wrap">
            <video
              key={`agent-${current.id}`}
              src={current.agent.src}
              controls
              preload="metadata"
              playsInline
              className="compare-video"
            />
          </div>
          <ul className="compare-bullets compare-bullets-good">
            {current.agent.bullets.map((b, i) => (
              <li key={i}>
                <span className="compare-bullet-ico">
                  <Check size={13} strokeWidth={3} />
                </span>
                {b}
              </li>
            ))}
          </ul>
        </article>
      </div>

      <div className="compare-dots" role="tablist" aria-label="Sélecteur de cas">
        {cases.map((c, i) => (
          <button
            type="button"
            key={c.id}
            className={`compare-dot${i === idx ? " active" : ""}`}
            onClick={() => setIdx(i)}
            aria-label={`Voir cas ${i + 1} — ${c.persona}`}
            aria-selected={i === idx}
            role="tab"
          />
        ))}
      </div>
    </div>
  );
}
