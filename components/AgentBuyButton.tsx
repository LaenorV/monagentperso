"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { useAuth } from "./AuthProvider";
import { getAffiliateRef } from "@/lib/affiliate";

type Props = {
  slug: string;
  priceLabel: string;
};

export default function AgentBuyButton({ slug, priceLabel }: Props) {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleClick() {
    setError("");

    // Non connecté → on l'envoie se connecter puis revenir sur la page agents.
    if (!user) {
      router.push(`/login?next=agents&redirectedFrom=/agents-gpt`);
      return;
    }

    setLoading(true);
    let res: Response;
    try {
      res = await fetch("/api/agent-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agent_slug: slug,
          affiliate_ref: getAffiliateRef() || undefined,
        }),
      });
    } catch {
      setError("Erreur réseau — réessayez.");
      setLoading(false);
      return;
    }

    if (res.status === 401) {
      router.push(`/login?next=agents`);
      return;
    }

    let data: { url?: string; message?: string } = {};
    try {
      data = await res.json();
    } catch {
      setError("Réponse serveur invalide.");
      setLoading(false);
      return;
    }

    if (!res.ok || !data.url) {
      setError(data.message || "Impossible de lancer le paiement.");
      setLoading(false);
      return;
    }

    window.location.href = data.url;
  }

  return (
    <>
      <button
        type="button"
        className="btn btn-primary agent-buy-btn"
        onClick={handleClick}
        disabled={loading}
      >
        {loading ? (
          "Redirection vers le paiement…"
        ) : (
          <>
            <Lock size={15} strokeWidth={2.3} /> Débloquer pour {priceLabel}
          </>
        )}
      </button>
      {error && (
        <p className="agent-buy-error" role="alert">
          ⚠ {error}
        </p>
      )}
    </>
  );
}
