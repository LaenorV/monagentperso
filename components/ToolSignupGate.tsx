"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { X, Sparkles } from "lucide-react";
import { useAuth } from "./AuthProvider";
import { useLocale } from "@/lib/i18n/context";

const CLICK_KEY = "map_tool_clicks";
const SHOWN_KEY = "map_tool_gate_shown";
const THRESHOLD = 2;

/**
 * Incite a l'inscription : pour un visiteur NON connecte, apres 2 clics sur des
 * outils IA de la marketplace, affiche une modale d'inscription (sans rediriger
 * ni rafraichir). Montree une seule fois, puis la navigation reste libre.
 * Aucun effet pour un utilisateur connecte.
 */
export default function ToolSignupGate() {
  const { user } = useAuth();
  const { t } = useLocale();
  const [open, setOpen] = useState(false);

  const handleClick = useCallback(
    (e: MouseEvent) => {
      if (user) return;
      const target = e.target as Element | null;
      // On ne compte que les liens "outil" des cartes de la marketplace.
      const link = target?.closest<HTMLAnchorElement>(".mk-card a[href]");
      if (!link) return;

      let shown = "0";
      try {
        shown = localStorage.getItem(SHOWN_KEY) ?? "0";
      } catch {
        /* ignore */
      }
      if (shown === "1") return; // deja montree : on ne bloque plus la navigation

      let count = 0;
      try {
        count = parseInt(localStorage.getItem(CLICK_KEY) ?? "0", 10) || 0;
      } catch {
        /* ignore */
      }
      count += 1;
      try {
        localStorage.setItem(CLICK_KEY, String(count));
      } catch {
        /* ignore */
      }

      if (count >= THRESHOLD) {
        // 2e clic : on intercepte CE clic pour montrer la modale au lieu d'ouvrir l'outil.
        e.preventDefault();
        e.stopPropagation();
        try {
          localStorage.setItem(SHOWN_KEY, "1");
        } catch {
          /* ignore */
        }
        setOpen(true);
      }
      // 1er clic : on laisse l'outil s'ouvrir normalement.
    },
    [user],
  );

  useEffect(() => {
    if (user) return; // connecte → jamais de modale, aucun listener
    document.addEventListener("click", handleClick, true); // capture
    return () => document.removeEventListener("click", handleClick, true);
  }, [user, handleClick]);

  // Verrou scroll quand la modale est ouverte.
  useEffect(() => {
    if (open) document.body.classList.add("modal-open");
    else document.body.classList.remove("modal-open");
    return () => document.body.classList.remove("modal-open");
  }, [open]);

  if (user || !open) return null;

  return (
    <div className="signup-gate" role="dialog" aria-modal="true" aria-label={t.auth.modalTitle}>
      <div className="signup-gate-backdrop" onClick={() => setOpen(false)} />
      <div className="signup-gate-card">
        <button
          type="button"
          className="signup-gate-close"
          onClick={() => setOpen(false)}
          aria-label={t.auth.modalClose}
        >
          <X size={20} />
        </button>
        <div className="signup-gate-ico"><Sparkles size={30} strokeWidth={1.9} /></div>
        <h2 className="signup-gate-title">{t.auth.modalTitle}</h2>
        <p className="signup-gate-text">{t.auth.incentive}</p>
        <div className="signup-gate-actions">
          <Link href="/signup" className="btn btn-primary btn-xl">{t.auth.modalSignup}</Link>
          <Link href="/login" className="btn btn-light">{t.auth.modalLogin}</Link>
        </div>
      </div>
    </div>
  );
}
