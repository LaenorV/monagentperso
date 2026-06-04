"use client";

import { useEffect, useState } from "react";
import { ShoppingCart, X } from "lucide-react";
import { useAuth } from "./AuthProvider";
import {
  getAgent,
  getPendingPurchase,
  clearPendingPurchase,
} from "@/lib/ready-made-agents";
import { launchAgentCheckout, type AgentPlatform } from "./AgentBuyButton";

function parsePending(raw: string): { slug: string; platform: AgentPlatform } {
  const [slug, p] = raw.split("::");
  return { slug, platform: p === "claude" ? "claude" : "gpt" };
}

/**
 * Si l'utilisateur revient connecté avec une intention d'achat en attente
 * (stockée avant signup/login), on lui propose de reprendre l'achat en 1 clic.
 */
export default function ResumePurchaseBanner() {
  const { user } = useAuth();
  const [slug, setSlug] = useState("");
  const [platform, setPlatform] = useState<AgentPlatform>("gpt");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    const pending = getPendingPurchase();
    if (!pending) return;
    const { slug: s, platform: p } = parsePending(pending);
    if (getAgent(s)) {
      setSlug(s);
      setPlatform(p);
    } else {
      clearPendingPurchase(); // slug obsolète
    }
  }, [user]);

  if (!user || !slug) return null;
  const agent = getAgent(slug);
  if (!agent) return null;
  const platformLabel = platform === "claude" ? "Claude" : "ChatGPT";

  async function resume() {
    setLoading(true);
    try {
      const url = await launchAgentCheckout(slug, platform);
      if (url && url !== "UNAUTH") {
        clearPendingPurchase();
        window.location.href = url;
        return;
      }
    } catch {
      /* on retombe sur l'état normal */
    }
    setLoading(false);
  }

  function dismiss() {
    clearPendingPurchase();
    setSlug("");
  }

  return (
    <div className="resume-banner" role="status">
      <ShoppingCart size={18} strokeWidth={2.2} />
      <span>
        Reprenez votre achat : <strong>{agent.name}</strong> — version {platformLabel} (
        {agent.priceLabel}).
      </span>
      <button type="button" className="btn btn-primary btn-nav" onClick={resume} disabled={loading}>
        {loading ? "Redirection…" : `Continuer l'achat`}
      </button>
      <button
        type="button"
        className="resume-banner-close"
        onClick={dismiss}
        aria-label="Ignorer"
      >
        <X size={16} />
      </button>
    </div>
  );
}
