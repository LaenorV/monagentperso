"use client";

import { useEffect } from "react";
import { getAffiliateRef, setAffiliateRef, sanitizeRef } from "@/lib/affiliate";

/**
 * Détecte ?ref=xxx à l'arrivée sur le site et le conserve 30 jours.
 * 100 % invisible pour l'utilisateur. Ne casse jamais la page (try/catch).
 * Monté dans le layout racine → exécuté à chaque chargement de page.
 */
export default function AffiliateTracker() {
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const incoming = sanitizeRef(params.get("ref"));
      if (!incoming) return;

      const current = getAffiliateRef();
      if (incoming !== current) {
        // Nouveau ref → remplace l'ancien.
        setAffiliateRef(incoming);
      }

      if (process.env.NODE_ENV !== "production") {
        console.log("Affiliate ref detected:", incoming);
      }
    } catch {
      // Tracking silencieux : on n'interrompt jamais le rendu.
    }
  }, []);

  return null;
}
