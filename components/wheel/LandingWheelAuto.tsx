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
    let seen = false;
    try {
      seen = localStorage.getItem(WHEEL_SEEN_KEY) === "1";
    } catch {
      /* ignore */
    }
    if (seen) return;
    const t = setTimeout(() => openWheel(), 1200);
    return () => clearTimeout(t);
  }, []);

  return null;
}
