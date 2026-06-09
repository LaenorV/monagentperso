"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Lock } from "lucide-react";
import { useAuth } from "./AuthProvider";
import { getAffiliateRef } from "@/lib/affiliate";
import { setPendingPurchase, clearPendingPurchase } from "@/lib/ready-made-agents";

export type AgentPlatform = "gpt" | "claude";

type Props = {
  slug: string;
  platform: AgentPlatform;
  priceLabel: string;
  label?: string;
};

/**
 * Lance le checkout Stripe pour un agent dans une version précise (gpt | claude).
 * Utilisé ici et par la bannière de reprise.
 */
export async function launchAgentCheckout(
  slug: string,
  platform: AgentPlatform,
  promoCode?: string,
): Promise<string | null> {
  const res = await fetch("/api/agent-checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      agent_slug: slug,
      platform,
      affiliate_ref: getAffiliateRef() || undefined,
      promo_code: promoCode || undefined,
    }),
  });
  if (res.status === 401) return "UNAUTH";
  const data: { url?: string; message?: string } = await res.json().catch(() => ({}));
  if (!res.ok || !data.url) throw new Error(data.message || "checkout_failed");
  return data.url;
}

/** Encode l'intention d'achat (slug + version) pour la reprise après connexion. */
export function encodePending(slug: string, platform: AgentPlatform): string {
  return `${slug}::${platform}`;
}

export default function AgentBuyButton({ slug, platform, priceLabel, label }: Props) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleClick() {
    setError("");
    if (!user) {
      setPendingPurchase(encodePending(slug, platform));
      router.push(`/signup?redirect=${encodeURIComponent(pathname || "/marketplace")}`);
      return;
    }
    setLoading(true);
    try {
      const url = await launchAgentCheckout(slug, platform);
      if (url === "UNAUTH") {
        setPendingPurchase(encodePending(slug, platform));
        router.push(`/signup?redirect=${encodeURIComponent(pathname || "/marketplace")}`);
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
            <Lock size={15} strokeWidth={2.3} /> {label ?? `Débloquer pour ${priceLabel}`}
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
