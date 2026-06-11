"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, X, Check, Bot, Sparkles } from "lucide-react";
import { useLocale } from "@/lib/i18n/context";

// Médias (identiques quelle que soit la langue) ; le texte vient du dictionnaire,
// parallèle par index à t.compare.cases.
const MEDIA = [
  { id: "julien", chatgptSrc: "/videos/julien-chatgpt.mp4", agentSrc: "/videos/julien-agent.mp4" },
  { id: "lea", chatgptSrc: "/videos/lea-chatgpt.mp4", agentSrc: "/videos/lea-agent.mp4" },
];

export default function ComparisonVideos() {
  const { t } = useLocale();
  const cases = t.compare.cases;
  const [idx, setIdx] = useState(0);
  const current = cases[idx];
  const media = MEDIA[idx];
  const prev = () => setIdx((i) => (i - 1 + cases.length) % cases.length);
  const next = () => setIdx((i) => (i + 1) % cases.length);

  return (
    <div className="compare-stage">
      <div className="compare-head">
        <button
          type="button"
          className="compare-nav"
          onClick={prev}
          aria-label={t.compare.prevLabel}
          disabled={cases.length <= 1}
        >
          <ChevronLeft size={22} strokeWidth={2.2} />
        </button>
        <div className="compare-meta">
          <span className="compare-eyebrow">
            {t.compare.caseLabel.replace("{n}", String(idx + 1)).replace("{total}", String(cases.length))}
          </span>
          <h3 className="compare-title">{current.persona}</h3>
          <p className="compare-scenario">{current.scenario}</p>
        </div>
        <button
          type="button"
          className="compare-nav"
          onClick={next}
          aria-label={t.compare.nextLabel}
          disabled={cases.length <= 1}
        >
          <ChevronRight size={22} strokeWidth={2.2} />
        </button>
      </div>

      <div className="compare-grid">
        {/* === ChatGPT classique === */}
        <article className="compare-col compare-col-bad">
          <div className="compare-badge compare-badge-bad">
            <Bot size={14} strokeWidth={2.4} /> {t.compare.chatgptBadge}
          </div>
          <div className="compare-video-wrap">
            <video
              key={`chatgpt-${media.id}`}
              src={media.chatgptSrc}
              controls
              preload="metadata"
              playsInline
              className="compare-video"
            />
          </div>
          <ul className="compare-bullets compare-bullets-bad">
            {current.chatgptBullets.map((b, i) => (
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
            <Sparkles size={14} strokeWidth={2.4} /> {t.compare.agentBadge}
          </div>
          <div className="compare-video-wrap">
            <video
              key={`agent-${media.id}`}
              src={media.agentSrc}
              controls
              preload="metadata"
              playsInline
              className="compare-video"
            />
          </div>
          <ul className="compare-bullets compare-bullets-good">
            {current.agentBullets.map((b, i) => (
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

      <div className="compare-dots" role="tablist" aria-label={t.compare.dotsLabel}>
        {cases.map((c, i) => (
          <button
            type="button"
            key={MEDIA[i].id}
            className={`compare-dot${i === idx ? " active" : ""}`}
            onClick={() => setIdx(i)}
            aria-label={t.compare.dotLabel.replace("{n}", String(i + 1)).replace("{persona}", c.persona)}
            aria-selected={i === idx}
            role="tab"
          />
        ))}
      </div>
    </div>
  );
}
