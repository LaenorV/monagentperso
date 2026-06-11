"use client";

import { Sparkles } from "lucide-react";
import { openWheel } from "./openWheel";
import { useLocale } from "@/lib/i18n/context";

export default function WheelNavButton({ mobile = false }: { mobile?: boolean }) {
  const { t } = useLocale();
  return (
    <button
      type="button"
      className={mobile ? "wheel-nav-link wheel-nav-link-mobile" : "wheel-nav-link"}
      onClick={openWheel}
    >
      <Sparkles size={mobile ? 18 : 15} strokeWidth={2.2} />
      {t.wheel.navLabel}
      <span className="wheel-new-badge">{t.wheel.newBadge}</span>
    </button>
  );
}
