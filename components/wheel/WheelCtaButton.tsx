"use client";

import { Sparkles } from "lucide-react";
import { openWheel } from "./openWheel";

export default function WheelCtaButton({
  className = "btn btn-primary",
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <button type="button" className={className} onClick={openWheel}>
      <Sparkles size={16} strokeWidth={2.2} /> {children ?? "Tourner la roue"}
    </button>
  );
}
