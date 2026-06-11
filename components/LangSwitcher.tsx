"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/lib/i18n/context";
import { LOCALE_COOKIE, type Locale } from "@/lib/i18n/config";

// Drapeaux en SVG inline : Windows ne rend pas les emojis drapeaux (🇫🇷/🇬🇧),
// on garantit donc un affichage correct partout.
function FlagFR() {
  return (
    <svg viewBox="0 0 18 12" width="22" height="15" aria-hidden="true" className="lang-flag">
      <rect width="6" height="12" fill="#0055A4" />
      <rect x="6" width="6" height="12" fill="#fff" />
      <rect x="12" width="6" height="12" fill="#EF4135" />
    </svg>
  );
}

function FlagGB() {
  return (
    <svg viewBox="0 0 60 30" width="22" height="15" aria-hidden="true" className="lang-flag">
      <clipPath id="gb-s"><path d="M0,0 v30 h60 v-30 z" /></clipPath>
      <clipPath id="gb-t"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" /></clipPath>
      <g clipPath="url(#gb-s)">
        <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
        <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#gb-t)" stroke="#C8102E" strokeWidth="4" />
        <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
      </g>
    </svg>
  );
}

export default function LangSwitcher({ compact = false }: { compact?: boolean }) {
  const { locale } = useLocale();
  const router = useRouter();
  const [pending, start] = useTransition();

  function choose(next: Locale) {
    if (next === locale || pending) return;
    document.cookie = `${LOCALE_COOKIE}=${next};path=/;max-age=31536000;samesite=lax`;
    // Recharge les Server Components avec la nouvelle locale (le provider est reseedé).
    start(() => router.refresh());
  }

  return (
    <div className={`lang-switch${compact ? " lang-switch-compact" : ""}`} role="group" aria-label="Language">
      <button
        type="button"
        className={`lang-btn${locale === "fr" ? " active" : ""}`}
        onClick={() => choose("fr")}
        aria-pressed={locale === "fr"}
        aria-label="Français"
        title="Français"
      >
        <FlagFR />
      </button>
      <button
        type="button"
        className={`lang-btn${locale === "en" ? " active" : ""}`}
        onClick={() => choose("en")}
        aria-pressed={locale === "en"}
        aria-label="English"
        title="English"
      >
        <FlagGB />
      </button>
    </div>
  );
}
