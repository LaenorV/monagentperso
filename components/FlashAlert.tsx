"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { useModal } from "./ModalContext";
import { useLocale } from "@/lib/i18n/context";

// Routes où le pop-up est masqué.
const HIDDEN_PATHS = ["/login", "/signup", "/dashboard"];

export default function FlashAlert() {
  const { user } = useAuth();
  const { t } = useLocale();
  const { isOpen: modalOpen } = useModal();
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Timer de 9s au montage de l'app. Ré-armé à chaque refresh (état React reset).
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 9000);
    return () => clearTimeout(t);
  }, []);

  function dismiss() {
    setVisible(false);
    setDismissed(true);
  }

  function handleClick() {
    setVisible(false);
    setDismissed(true);
    router.push(user ? "/dashboard?openQuestionnaire=1" : "/login?next=questionnaire");
  }

  // Masque définitif : utilisateur a fermé via la croix.
  if (dismissed) return null;
  // Masque temporaire : pages auth/dashboard ou modal ouvert. Reviendra automatiquement
  // dès qu'on quitte ces pages ou qu'on ferme le modal (le composant reste monté dans le layout).
  if (modalOpen) return null;
  if (HIDDEN_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return null;

  return (
    <div className={`flash-alert${visible ? " show" : ""}`} role="alert" aria-live="polite">
      <button className="flash-alert-close" onClick={dismiss} aria-label={t.flash.close}>×</button>
      <div className="flash-alert-top">
        <div className="flash-alert-bang">!</div>
        <div>
          <span className="flash-alert-tag">{t.flash.tag}</span>
          <h4>{t.flash.title}</h4>
        </div>
      </div>
      <div className="flash-alert-body">
        <p>{t.flash.body}</p>
        <div className="flash-alert-price">
          <span className="old">79,90€</span>
          <span className="new">
            49,90€<small>TTC</small>
          </span>
        </div>
      </div>
      <button className="flash-alert-cta" onClick={handleClick}>
        {t.flash.cta}
      </button>
    </div>
  );
}
