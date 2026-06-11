"use client";

import { Sparkles } from "lucide-react";
import { openWheel } from "./openWheel";
import { useLocale } from "@/lib/i18n/context";

export default function WheelCtaButton({
  className = "btn btn-primary",
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const { t } = useLocale();
  return (
    <button type="button" className={className} onClick={openWheel}>
      <Sparkles size={16} strokeWidth={2.2} /> {children ?? t.wheel.navLabel}
    </button>
  );
}
