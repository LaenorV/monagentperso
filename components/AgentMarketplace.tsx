"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Bot,
  Sparkles,
  Wand2,
  GraduationCap,
  FileCheck2,
  ScrollText,
  Brain,
  PencilRuler,
  MessagesSquare,
  Presentation,
  FileText,
  Workflow,
  Search,
  Lock,
  Check,
  X,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "./AuthProvider";
import { launchAgentCheckout, encodePending, type AgentPlatform } from "./AgentBuyButton";
import ResumePurchaseBanner from "./ResumePurchaseBanner";
import {
  READY_MADE_AGENTS,
  AGENT_PRICE_LABEL,
  setPendingPurchase,
  clearPendingPurchase,
  type ReadyMadeAgent,
  type AgentType,
} from "@/lib/ready-made-agents";

const ICONS: Record<string, typeof Bot> = {
  humanizer: Wand2,
  dissertation: GraduationCap,
  "cv-optimizer": FileCheck2,
  resumeur: ScrollText,
  "fiches-quiz": Brain,
  "meta-prompt": PencilRuler,
  entretien: MessagesSquare,
  slides: Presentation,
};

const TYPE_FILTERS = [
  { key: "all", label: "Tous" },
  { key: "gpt", label: "Agents GPT" },
  { key: "claude", label: "Agents Claude" },
  { key: "prompt", label: "Prompts" },
  { key: "workflow", label: "Workflows" },
] as const;

type FilterKey = (typeof TYPE_FILTERS)[number]["key"];

function typeLabel(t: AgentType): string {
  if (t === "both") return "Agent GPT & Claude";
  if (t === "gpt") return "Agent GPT";
  if (t === "claude") return "Agent Claude";
  if (t === "prompt") return "Prompt";
  return "Workflow";
}

function typeNoun(t: AgentType): string {
  if (t === "prompt") return "ce prompt";
  if (t === "workflow") return "ce workflow";
  return "cet agent IA";
}

function defaultPlatform(f: FilterKey): AgentPlatform {
  return f === "claude" ? "claude" : "gpt";
}

function matchesType(a: ReadyMadeAgent, f: FilterKey): boolean {
  if (f === "all") return true;
  if (f === "gpt") return a.type === "gpt" || a.type === "both";
  if (f === "claude") return a.type === "claude" || a.type === "both";
  return a.type === f;
}

function TypeBadges({ type }: { type: AgentType }) {
  return (
    <div className="agent-card-badges">
      {(type === "gpt" || type === "both") && (
        <span className="agent-badge agent-badge-gpt"><Bot size={11} strokeWidth={2.4} /> GPT</span>
      )}
      {(type === "claude" || type === "both") && (
        <span className="agent-badge agent-badge-claude"><Sparkles size={11} strokeWidth={2.4} /> Claude</span>
      )}
      {type === "prompt" && (
        <span className="agent-badge agent-badge-prompt"><FileText size={11} strokeWidth={2.4} /> Prompt</span>
      )}
      {type === "workflow" && (
        <span className="agent-badge agent-badge-workflow"><Workflow size={11} strokeWidth={2.4} /> Workflow</span>
      )}
    </div>
  );
}

export default function AgentMarketplace({
  initialFilter = "all",
}: {
  initialFilter?: FilterKey;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [filter, setFilter] = useState<FilterKey>(initialFilter);
  const [query, setQuery] = useState("");
  const [usage, setUsage] = useState("");
  const [modalAgent, setModalAgent] = useState<ReadyMadeAgent | null>(null);
  const [platform, setPlatform] = useState<AgentPlatform>("gpt");
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");
  const [promoInput, setPromoInput] = useState("");
  const [promo, setPromo] = useState<{ code: string; final_amount: number; is_free: boolean } | null>(null);
  const [promoMsg, setPromoMsg] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);

  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoverCapable = useRef(false);

  useEffect(() => {
    hoverCapable.current =
      typeof window !== "undefined" &&
      window.matchMedia?.("(hover: hover) and (pointer: fine)").matches;
  }, []);

  // Verrouille le scroll quand la modale est ouverte.
  useEffect(() => {
    if (modalAgent) document.body.classList.add("modal-open");
    else document.body.classList.remove("modal-open");
    return () => document.body.classList.remove("modal-open");
  }, [modalAgent]);

  const usages = useMemo(
    () => Array.from(new Set(READY_MADE_AGENTS.map((a) => a.category))).sort(),
    [],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return READY_MADE_AGENTS.filter((a) => {
      if (!matchesType(a, filter)) return false;
      if (usage && a.category !== usage) return false;
      if (q) {
        const hay = (a.name + " " + a.shortDescription + " " + a.category).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [filter, query, usage]);

  const platformLabel = platform === "claude" ? "Claude" : "ChatGPT";

  function clearHover() {
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
  }

  // Clic "Débloquer" : non connecté → signup (intention conservée) ; connecté → modale.
  function onUnlock(a: ReadyMadeAgent) {
    clearHover();
    if (!user) {
      setPendingPurchase(encodePending(a.slug, defaultPlatform(filter)));
      router.push(`/signup?redirect=${encodeURIComponent(pathname || "/marketplace")}`);
      return;
    }
    openModal(a);
  }

  function openModal(a: ReadyMadeAgent) {
    setError("");
    setConfirming(false);
    setPlatform(defaultPlatform(filter)); // version pré-sélectionnée selon l'onglet
    setPromo(null);
    setPromoInput("");
    setPromoMsg("");
    setModalAgent(a);
  }

  async function applyPromo() {
    if (!promoInput.trim()) return;
    setPromoLoading(true);
    setPromoMsg("");
    try {
      const res = await fetch("/api/promo/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoInput.trim(), purchase_type: "marketplace" }),
      });
      const data = await res.json();
      if (data.valid && data.is_free) {
        setPromo({ code: data.code, final_amount: data.final_amount, is_free: true });
        setPromoMsg("");
      } else if (data.valid && !data.is_free) {
        setPromo(null);
        setPromoMsg("Ce code ne s'applique pas à la marketplace.");
      } else {
        setPromo(null);
        setPromoMsg(data.message || "Code invalide.");
      }
    } catch {
      setPromoMsg("Erreur de vérification du code.");
    }
    setPromoLoading(false);
  }

  // Hover ~3s (desktop, utilisateur connecté) → ouvre la modale (jamais Stripe).
  function onButtonEnter(a: ReadyMadeAgent) {
    if (!hoverCapable.current || !user || modalAgent) return;
    clearHover();
    hoverTimer.current = setTimeout(() => openModal(a), 3000);
  }

  async function confirmPurchase() {
    if (!modalAgent) return;
    setConfirming(true);
    setError("");
    try {
      const url = await launchAgentCheckout(modalAgent.slug, platform, promo?.code);
      if (url === "UNAUTH") {
        setPendingPurchase(encodePending(modalAgent.slug, platform));
        router.push(`/signup?redirect=${encodeURIComponent(pathname || "/marketplace")}`);
        return;
      }
      if (url) {
        clearPendingPurchase();
        window.location.href = url;
        return;
      }
      setError("Impossible de lancer le paiement — réessayez.");
    } catch {
      setError("Impossible de lancer le paiement — réessayez.");
    }
    setConfirming(false);
  }

  return (
    <div className="container agents-page amk">
      <ResumePurchaseBanner />

      {/* HERO */}
      <div className="agents-hero">
        <span className="section-eyebrow">Marketplace · agents prêts à l'emploi</span>
        <h1 className="agents-title">Des agents experts, prêts en 2 minutes.</h1>
        <p className="agents-sub">
          Débloquez un agent ChatGPT ou Claude déjà conçu et sur-entraîné pour une mission précise.
          Instructions complètes + base de connaissance, livrées dans votre espace, réutilisables à
          volonté.
        </p>
        <div className="agents-offers">
          <div className="agents-offer">
            <span className="agents-offer-tag">Prêt à l'emploi</span>
            <b>{AGENT_PRICE_LABEL}</b>
            <span>par agent · accès immédiat</span>
          </div>
          <div className="agents-offer-vs">ou</div>
          <div className="agents-offer agents-offer-muted">
            <span className="agents-offer-tag">Sur-mesure</span>
            <b>49,90 €</b>
            <span>agent 100 % personnalisé, livré sous 24h</span>
            <Link href="/" className="agents-offer-link">Découvrir l'offre personnalisée →</Link>
          </div>
        </div>
      </div>

      {/* FILTRES — toujours visibles (sticky) */}
      <div className="amk-filters">
        <div className="amk-tabs" role="tablist" aria-label="Catégories">
          {TYPE_FILTERS.map((t) => {
            const count =
              t.key === "all"
                ? READY_MADE_AGENTS.length
                : READY_MADE_AGENTS.filter((a) => matchesType(a, t.key)).length;
            return (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={filter === t.key}
                className={`amk-tab ${filter === t.key ? "amk-tab-active" : ""}`}
                onClick={() => setFilter(t.key)}
              >
                {t.label}
                <span className="amk-tab-count">{count}</span>
              </button>
            );
          })}
        </div>
        <div className="amk-tools">
          <div className="amk-search">
            <Search size={16} className="amk-search-ico" />
            <input
              type="search"
              placeholder="Rechercher un agent…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Rechercher"
            />
          </div>
          <select
            className="amk-select"
            value={usage}
            onChange={(e) => setUsage(e.target.value)}
            aria-label="Filtrer par usage"
          >
            <option value="">Tous les usages</option>
            {usages.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>
      </div>

      {/* GRILLE */}
      {visible.length === 0 ? (
        <div className="amk-empty">
          {filter === "prompt" || filter === "workflow" ? (
            <p>De nouveaux {filter === "prompt" ? "prompts" : "workflows"} arrivent bientôt 🚀</p>
          ) : (
            <p>Aucun agent ne correspond à votre recherche.</p>
          )}
        </div>
      ) : (
        <div className="amk-grid">
          {visible.map((a) => {
            const Icon = ICONS[a.slug] ?? Bot;
            return (
              <article className="amk-card" key={a.slug}>
                <div className="amk-card-top">
                  <div className="amk-icon"><Icon size={24} strokeWidth={1.9} /></div>
                  <TypeBadges type={a.type} />
                </div>
                <span className="amk-cat">{a.category}</span>
                <h3 className="amk-name">{a.name}</h3>
                <p className="amk-desc">{a.shortDescription}</p>
                <ul className="amk-preview">
                  {a.publicPreview.slice(0, 3).map((p) => (
                    <li key={p}><Check size={13} strokeWidth={2.6} /> {p}</li>
                  ))}
                </ul>
                <div className="amk-foot">
                  <div className="amk-price">{a.priceLabel}<small>TTC</small></div>
                  <button
                    type="button"
                    className="btn btn-primary amk-buy"
                    onClick={() => onUnlock(a)}
                    onMouseEnter={() => onButtonEnter(a)}
                    onMouseLeave={clearHover}
                  >
                    <Lock size={15} strokeWidth={2.3} /> Débloquer
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <div className="agents-bottom">
        <Link href="/dashboard" className="btn btn-light">Ma bibliothèque <ArrowRight size={16} /></Link>
      </div>

      {/* MODALE DE CONFIRMATION */}
      {modalAgent && (
        <div className="agent-modal" role="dialog" aria-modal="true" aria-label="Confirmation d'achat">
          <div className="agent-modal-backdrop" onClick={() => !confirming && setModalAgent(null)} />
          <div className="agent-modal-card">
            <button
              type="button"
              className="agent-modal-close"
              onClick={() => !confirming && setModalAgent(null)}
              aria-label="Fermer"
            >
              <X size={18} />
            </button>

            <span className="section-eyebrow">{typeLabel(modalAgent.type)}</span>
            <h2 className="agent-modal-title">Débloquer {modalAgent.name}</h2>
            <TypeBadges type={modalAgent.type} />
            <p className="agent-modal-desc">{modalAgent.shortDescription}</p>

            {modalAgent.type === "both" && (
              <div className="agent-modal-version">
                <span className="agent-modal-version-label">Choisissez votre version</span>
                <div className="amk-seg" role="group" aria-label="Version de l'agent">
                  <button
                    type="button"
                    className={platform === "gpt" ? "amk-seg-on" : ""}
                    onClick={() => setPlatform("gpt")}
                  >
                    <Bot size={15} strokeWidth={2.2} /> ChatGPT
                  </button>
                  <button
                    type="button"
                    className={platform === "claude" ? "amk-seg-on" : ""}
                    onClick={() => setPlatform("claude")}
                  >
                    <Sparkles size={15} strokeWidth={2.2} /> Claude
                  </button>
                </div>
                <p className="agent-modal-version-note">
                  Vous recevrez uniquement la version <strong>{platformLabel}</strong> (instructions
                  dédiées + base de connaissance).
                </p>
              </div>
            )}

            <div className="agent-modal-price">
              <span>Prix unique</span>
              {promo?.is_free ? (
                <b>
                  <s style={{ color: "var(--muted-2)", fontWeight: 600, marginRight: 8 }}>
                    {modalAgent.priceLabel}
                  </s>
                  0,00 €
                </b>
              ) : (
                <b>{modalAgent.priceLabel}</b>
              )}
            </div>

            <div className="agent-modal-promo">
              <div className="amk-promo-row">
                <input
                  type="text"
                  placeholder="Code promo (optionnel)"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                  disabled={!!promo}
                  aria-label="Code promo"
                />
                {promo ? (
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => {
                      setPromo(null);
                      setPromoInput("");
                      setPromoMsg("");
                    }}
                  >
                    Retirer
                  </button>
                ) : (
                  <button type="button" className="btn btn-light" onClick={applyPromo} disabled={promoLoading}>
                    {promoLoading ? "…" : "Appliquer"}
                  </button>
                )}
              </div>
              {promo?.is_free && <p className="amk-promo-ok">✓ Code appliqué — cet agent vous est offert.</p>}
              {promoMsg && <p className="amk-promo-err">{promoMsg}</p>}
            </div>

            <p className="agent-modal-reassure">
              Vous êtes sur le point de débloquer{" "}
              {modalAgent.type === "both"
                ? `la version ${platformLabel} de cet agent IA`
                : typeNoun(modalAgent.type)}{" "}
              pour <strong>{modalAgent.priceLabel}</strong>. Après validation du paiement, il sera
              automatiquement ajouté à votre espace utilisateur, dans votre bibliothèque. Vous pourrez
              le consulter à tout moment depuis votre compte.
            </p>
            <div className="agent-modal-points">
              <span><ShieldCheck size={14} /> Disponible directement dans votre espace utilisateur</span>
              <span><Check size={14} /> Retrouvable dans votre bibliothèque client</span>
            </div>

            {error && <p className="agent-buy-error" role="alert">⚠ {error}</p>}

            <div className="agent-modal-actions">
              <button
                type="button"
                className="btn btn-light"
                onClick={() => setModalAgent(null)}
                disabled={confirming}
              >
                Annuler
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={confirmPurchase}
                disabled={confirming}
              >
                {confirming
                  ? "Traitement…"
                  : promo?.is_free
                  ? `Débloquer gratuitement · version ${platformLabel}`
                  : modalAgent.type === "both"
                  ? `Confirmer · version ${platformLabel} · ${modalAgent.priceLabel}`
                  : `Confirmer l'achat · ${modalAgent.priceLabel}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
