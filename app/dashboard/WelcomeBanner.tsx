"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { CheckCircle2, X } from "lucide-react";

function Inner() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const triggered = useRef(false);

  useEffect(() => {
    if (triggered.current) return;
    if (params.get("welcome") !== "1") return;
    triggered.current = true;
    setVisible(true);
    // Nettoie l'URL pour éviter le re-déclenchement au refresh.
    // Conserve les autres params (ex : openQuestionnaire=1).
    const remaining = new URLSearchParams(params.toString());
    remaining.delete("welcome");
    const cleaned = remaining.toString();
    router.replace(cleaned ? `${pathname}?${cleaned}` : pathname);
  }, [params, router, pathname]);

  if (!visible) return null;

  return (
    <div className="welcome-banner" role="status" aria-live="polite">
      <span className="welcome-banner-ico">
        <CheckCircle2 size={18} strokeWidth={2.4} />
      </span>
      <span className="welcome-banner-text">Compte créé avec succès.</span>
      <button
        type="button"
        className="welcome-banner-close"
        onClick={() => setVisible(false)}
        aria-label="Fermer"
      >
        <X size={16} strokeWidth={2.4} />
      </button>
    </div>
  );
}

export default function WelcomeBanner() {
  return (
    <Suspense fallback={null}>
      <Inner />
    </Suspense>
  );
}
