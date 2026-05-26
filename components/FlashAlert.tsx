"use client";

import { useEffect, useState } from "react";
import { useModal } from "./ModalContext";

export default function FlashAlert() {
  const { open } = useModal();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const wasShown = sessionStorage.getItem("flashAlertShown");
    if (wasShown === "1") return;
    const t = setTimeout(() => {
      setVisible(true);
      sessionStorage.setItem("flashAlertShown", "1");
    }, 9000);
    return () => clearTimeout(t);
  }, []);

  function dismiss() {
    setVisible(false);
    setDismissed(true);
  }

  function handleClick() {
    setVisible(false);
    setDismissed(true);
    open();
  }

  if (dismissed) return null;

  return (
    <div className={`flash-alert${visible ? " show" : ""}`} role="alert" aria-live="polite">
      <button className="flash-alert-close" onClick={dismiss} aria-label="Fermer">×</button>
      <div className="flash-alert-top">
        <div className="flash-alert-bang">!</div>
        <div>
          <span className="flash-alert-tag">Offre flash</span>
          <h4>Lancement spécial — jusqu'au 21 juin</h4>
        </div>
      </div>
      <div className="flash-alert-body">
        <p>Bénéficiez d'une réduction exceptionnelle sur votre agent IA personnalisé livré sous 24h.</p>
        <div className="flash-alert-price">
          <span className="old">79,90€</span>
          <span className="new">
            49,90€<small>TTC</small>
          </span>
        </div>
      </div>
      <button className="flash-alert-cta" onClick={handleClick}>
        Je me lance ! →
      </button>
    </div>
  );
}
