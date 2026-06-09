"use client";

import { Sparkles } from "lucide-react";
import { openWheel } from "./openWheel";

export default function WheelNavButton({ mobile = false }: { mobile?: boolean }) {
  return (
    <button
      type="button"
      className={mobile ? "wheel-nav-link wheel-nav-link-mobile" : "wheel-nav-link"}
      onClick={openWheel}
    >
      <Sparkles size={mobile ? 18 : 15} strokeWidth={2.2} />
      Tourner la roue
      <span className="wheel-new-badge">New</span>
    </button>
  );
}
