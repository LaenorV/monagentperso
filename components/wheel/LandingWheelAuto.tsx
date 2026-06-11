"use client";

import { useEffect } from "react";
import { openWheel, WHEEL_SEEN_KEY } from "./openWheel";

/**
 * Ouvre automatiquement la roue à l'arrivée sur la landing page —
 * une seule fois (tant que l'utilisateur ne l'a pas déjà vue/fermée).
 * L'accès reste possible ensuite via le menu « Tourner la roue ».
 */
export default function LandingWheelAuto() {
  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    // 1) Court-circuit local : si on a déjà vu/fermé la roue sur cet appareil.
    let seen = false;
    try {
      seen = localStorage.getItem(WHEEL_SEEN_KEY) === "1";
    } catch {
      /* ignore */
    }
    if (seen) return;

    // 2) Source de vérité = Supabase. On ne re-propose jamais la roue si le
    //    compte a déjà tourné (même après reconnexion / autre appareil).
    (async () => {
      try {
        const res = await fetch("/api/wheel/status", { method: "GET" });
        const data = await res.json();
        if (cancelled) return;
        if (data?.hasSpun) {
          // Déjà tourné → on mémorise localement et on n'ouvre rien.
          try {
            localStorage.setItem(WHEEL_SEEN_KEY, "1");
          } catch {
            /* ignore */
          }
          return;
        }
      } catch {
        // En cas d'échec réseau, on laisse l'ouverture auto (le serveur reste
        // l'arbitre final si l'utilisateur tente de tourner).
      }
      if (cancelled) return;
      timer = setTimeout(() => openWheel(), 1200);
    })();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, []);

  return null;
}
