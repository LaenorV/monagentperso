"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { useAuth } from "./AuthProvider";
import { getAffiliateRef } from "@/lib/affiliate";
import { setPendingPurchase, clearPendingPurchase } from "@/lib/ready-made-agents";

type Props = {
  slug: string;
  priceLabel: string;
};

/** Lance le checkout Stripe pour un agent. Utilisé ici et par la bannière de reprise. */
export async function launchAgentCheckout(slug: string): Promise<string | null> {
  const res = await fetch("/api/agent-checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      agent_slug: slug,
      affiliate_ref: getAffiliateRef() || undefined,
    }),
  });
  if (res.status === 401) return "UNAUTH";
  const data: { url?: string; message?: string } = await res.json().catch(() => ({}));
  if (!res.ok || !data.url) throw new Error(data.message || "checkout_failed");
  return data.url;
}

export default function AgentBuyButton({ slug, priceLabel }: Props) {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleClick() {
    setError("");

    // Non connecté → on garde l'intention d'achat et on envoie créer un compte.
    if (!user) {
      setPendingPurchase(slug);
      const here =
        typeof window !== "undefined" ? window.location.pathname : "/agents-gpt";
      router.push(`/signup?redirect=${encodeURIComponent(here)}`);
      return;
    }

    setLoading(true);
    try {
      const url = await launchAgentCheckout(slug);
      if (url === "UNAUTH") {
        setPendingPurchase(slug);
        router.push(`/signup?redirect=/agents-gpt`);
        return;
      }
      if (url) {
        clearPendingPurchase();
        window.location.href = url;
        return;
      }
    } catch {
      setError("Impossible de lancer le paiement — réessayez.");
    }
    setLoading(false);
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
