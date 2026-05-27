"use client";

import { Suspense, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useModal } from "@/components/ModalContext";

function Inner() {
  const params = useSearchParams();
  const router = useRouter();
  const { open } = useModal();
  const triggered = useRef(false);

  useEffect(() => {
    if (triggered.current) return;
    if (params.get("openQuestionnaire") !== "1") return;
    triggered.current = true;
    open();
    // Nettoie l'URL pour éviter de re-déclencher au refresh.
    router.replace("/dashboard");
  }, [params, router, open]);

  return null;
}

export default function AutoOpenQuestionnaire() {
  return (
    <Suspense fallback={null}>
      <Inner />
    </Suspense>
  );
}
