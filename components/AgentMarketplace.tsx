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
import { useLocale } from "@/lib/i18n/context";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import {
  getLocalizedAgents,
  agentPriceLabel,
  setPendingPurchase,
  clearPendingPurchase,
  type ReadyMadeAgent,
  type AgentType,
} from "@/lib/ready-made-agents";

type AgentsDict = Dictionary["agents"];

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
  { key: "all" },
  { key: "gpt" },
  { key: "claude" },
  { key: "prompt" },
  { key: "workflow" },
] as const;

type FilterKey = (typeof TYPE_FILTERS)[number]["key"];

function filterLabel(key: FilterKey, a: AgentsDict): string {
  return { all: a.tabAll, gpt: a.tabGpt, claude: a.tabClaude, prompt: a.tabPrompt, workflow: a.tabWorkflow }[key];
}

function typeLabel(t: AgentType, a: AgentsDict): string {
  if (t === "both") return a.typeLabelBoth;
  if (t === "gpt") return a.typeLabelGpt;
  if (t === "claude") return a.typeLabelClaude;
  if (t === "prompt") return a.typeLabelPrompt;
  return a.typeLabelWorkflow;
}

function typeNoun(t: AgentType, a: AgentsDict): string {
  if (t === "prompt") return a.typeNounPrompt;
  if (t === "workflow") return a.typeNounWorkflow;
  return a.typeNounAgent;
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

function TypeBadges({ type, a }: { type: AgentType; a: AgentsDict }) {
  return (
    <div className="agent-card-badges">
      {(type === "gpt" || type === "both") && (
        <span className="agent-badge agent-badge-gpt"><Bot size={11} strokeWidth={2.4} /> GPT</span>
      )}
      {(type === "claude" || type === "both") && (
        <span className="agent-badge agent-badge-claude"><Sparkles size={11} strokeWidth={2.4} /> Claude</span>
      )}
      {type === "prompt" && (
        <span className="agent-badge agent-badge-prompt"><FileText size={11} strokeWidth={2.4} /> {a.badgePrompt}</span>
      )}
      {type === "workflow" && (
        <span className="agent-badge agent-badge-workflow"><Workflow size={11} strokeWidth={2.4} /> {a.badgeWorkflow}</span>
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
  const { t, locale } = useLocale();
  const a = t.agents;
  const AGENTS = useMemo(() => getLocalizedAgents(locale), [locale]);
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
    () => Array.from(new Set(AGENTS.map((ag) => ag.category))).sort(),
    [AGENTS],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return AGENTS.filter((ag) => {
      if (!matchesType(ag, filter)) return false;
      if (usage && ag.category !== usage) return false;
      if (q) {
        const hay = (ag.name + " " + ag.shortDescription + " " + ag.category).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [filter, query, usage, AGENTS]);

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
        setPromoMsg(a.promoNotMarketplace);
      } else {
        setPromo(null);
        setPromoMsg(data.message || a.promoInvalid);
      }
    } catch {
      setPromoMsg(a.promoErr);
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
      setError(a.errPayment);
    } catch {
      setError(a.errPayment);
    }
    setConfirming(false);
  }

  return (
    <div className="container agents-page amk">
      <ResumePurchaseBanner />

      {/* HERO */}
      <div className="agents-hero">
        <span className="section-eyebrow">{a.eyebrow}</span>
        <h1 className="agents-title">{a.title}</h1>
        <p className="agents-sub">{a.sub}</p>
        <div className="agents-offers">
          <div className="agents-offer">
            <span className="agents-offer-tag">{a.offerReadyTag}</span>
            <b>{agentPriceLabel(locale)}</b>
            <span>{a.offerReadySub}</span>
          </div>
          <div className="agents-offer-vs">{a.offerOr}</div>
          <div className="agents-offer agents-offer-muted">
            <span className="agents-offer-tag">{a.offerCustomTag}</span>
            <b>{locale === "en" ? "€49.90" : "49,90 €"}</b>
            <span>{a.offerCustomSub}</span>
            <Link href="/" className="agents-offer-link">{a.offerCustomLink}</Link>
          </div>
        </div>
      </div>

      {/* FILTRES — toujours visibles (sticky) */}
      <div className="amk-filters">
        <div className="amk-tabs" role="tablist" aria-label={a.categoriesLabel}>
          {TYPE_FILTERS.map((tf) => {
            const count =
              tf.key === "all"
                ? AGENTS.length
                : AGENTS.filter((ag) => matchesType(ag, tf.key)).length;
            return (
              <button
                key={tf.key}
                type="button"
                role="tab"
                aria-selected={filter === tf.key}
                className={`amk-tab ${filter === tf.key ? "amk-tab-active" : ""}`}
                onClick={() => setFilter(tf.key)}
              >
                {filterLabel(tf.key, a)}
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
              placeholder={a.searchPlaceholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label={a.searchLabel}
            />
          </div>
          <select
            className="amk-select"
            value={usage}
            onChange={(e) => setUsage(e.target.value)}
            aria-label={a.usageLabel}
          >
            <option value="">{a.allUsages}</option>
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
            <p>{filter === "prompt" ? a.emptyPromptSoon : a.emptyWorkflowSoon}</p>
          ) : (
            <p>{a.emptyNoMatch}</p>
          )}
        </div>
      ) : (
        <div className="amk-grid">
          {visible.map((ag) => {
            const Icon = ICONS[ag.slug] ?? Bot;
            return (
              <article className="amk-card" key={ag.slug}>
                <div className="amk-card-top">
                  <div className="amk-icon"><Icon size={24} strokeWidth={1.9} /></div>
                  <TypeBadges type={ag.type} a={a} />
                </div>
                <span className="amk-cat">{ag.category}</span>
                <h3 className="amk-name">{ag.name}</h3>
                <p className="amk-desc">{ag.shortDescription}</p>
                <ul className="amk-preview">
                  {ag.publicPreview.slice(0, 3).map((p) => (
                    <li key={p}><Check size={13} strokeWidth={2.6} /> {p}</li>
                  ))}
                </ul>
                <div className="amk-foot">
                  <div className="amk-price">{ag.priceLabel}<small>{a.ttc}</small></div>
                  <button
                    type="button"
                    className="btn btn-primary amk-buy"
                    onClick={() => onUnlock(ag)}
                    onMouseEnter={() => onButtonEnter(ag)}
                    onMouseLeave={clearHover}
                  >
                    <Lock size={15} strokeWidth={2.3} /> {a.unlock}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <div className="agents-bottom">
        <Link href="/dashboard" className="btn btn-light">{a.libraryLink} <ArrowRight size={16} /></Link>
      </div>

      {/* MODALE DE CONFIRMATION */}
      {modalAgent && (
        <div className="agent-modal" role="dialog" aria-modal="true" aria-label={a.modalLabel}>
          <div className="agent-modal-backdrop" onClick={() => !confirming && setModalAgent(null)} />
          <div className="agent-modal-card">
            <button
              type="button"
              className="agent-modal-close"
              onClick={() => !confirming && setModalAgent(null)}
              aria-label={a.close}
            >
              <X size={18} />
            </button>

            <span className="section-eyebrow">{typeLabel(modalAgent.type, a)}</span>
            <h2 className="agent-modal-title">{a.unlockTitle.replace("{name}", modalAgent.name)}</h2>
            <TypeBadges type={modalAgent.type} a={a} />
            <p className="agent-modal-desc">{modalAgent.shortDescription}</p>

            {modalAgent.type === "both" && (
              <div className="agent-modal-version">
                <span className="agent-modal-version-label">{a.chooseVersion}</span>
                <div className="amk-seg" role="group" aria-label={a.versionGroupLabel}>
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
                  {a.versionNote1}<strong>{platformLabel}</strong>{a.versionNote2}
                </p>
              </div>
            )}

            <div className="agent-modal-price">
              <span>{a.uniquePrice}</span>
              {promo?.is_free ? (
                <b>
                  <s style={{ color: "var(--muted-2)", fontWeight: 600, marginRight: 8 }}>
                    {modalAgent.priceLabel}
                  </s>
                  {locale === "en" ? "€0.00" : "0,00 €"}
                </b>
              ) : (
                <b>{modalAgent.priceLabel}</b>
              )}
            </div>

            <div className="agent-modal-promo">
              <div className="amk-promo-row">
                <input
                  type="text"
                  placeholder={a.promoPlaceholder}
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                  disabled={!!promo}
                  aria-label={a.promoLabel}
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
                    {a.remove}
                  </button>
                ) : (
                  <button type="button" className="btn btn-light" onClick={applyPromo} disabled={promoLoading}>
                    {promoLoading ? a.loading : a.apply}
                  </button>
                )}
              </div>
              {promo?.is_free && <p className="amk-promo-ok">{a.promoFreeOk}</p>}
              {promoMsg && <p className="amk-promo-err">{promoMsg}</p>}
            </div>

            <p className="agent-modal-reassure">
              {a.reassureA}
              {modalAgent.type === "both"
                ? a.versionOf.replace("{platform}", platformLabel)
                : typeNoun(modalAgent.type, a)}
              {a.reassureB}<strong>{modalAgent.priceLabel}</strong>{a.reassureC}
            </p>
            <div className="agent-modal-points">
              <span><ShieldCheck size={14} /> {a.point1}</span>
              <span><Check size={14} /> {a.point2}</span>
            </div>

            {error && <p className="agent-buy-error" role="alert">⚠ {error}</p>}

            <div className="agent-modal-actions">
              <button
                type="button"
                className="btn btn-light"
                onClick={() => setModalAgent(null)}
                disabled={confirming}
              >
                {a.cancel}
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={confirmPurchase}
                disabled={confirming}
              >
                {confirming
                  ? a.confirmProcessing
                  : promo?.is_free
                  ? a.confirmFree.replace("{platform}", platformLabel)
                  : modalAgent.type === "both"
                  ? a.confirmBoth.replace("{platform}", platformLabel).replace("{price}", modalAgent.priceLabel)
                  : a.confirmSingle.replace("{price}", modalAgent.priceLabel)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
