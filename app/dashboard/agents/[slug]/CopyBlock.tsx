"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { useLocale } from "@/lib/i18n/context";

export default function CopyBlock({ title, text }: { title: string; text: string }) {
  const { t } = useLocale();
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard indisponible : l'utilisateur peut sélectionner manuellement */
    }
  }

  return (
    <div className="copyblock">
      <div className="copyblock-head">
        <b>{title}</b>
        <button type="button" className="btn btn-light btn-nav" onClick={copy}>
          {copied ? (
            <>
              <Check size={15} strokeWidth={2.4} /> {t.agentDetail.copied}
            </>
          ) : (
            <>
              <Copy size={15} strokeWidth={2.2} /> {t.agentDetail.copy}
            </>
          )}
        </button>
      </div>
      <pre className="copyblock-pre">{text}</pre>
    </div>
  );
}
