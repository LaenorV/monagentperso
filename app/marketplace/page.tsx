import type { Metadata } from "next";
import { Fragment } from "react";
import Link from "next/link";
import CtaButton from "@/components/CtaButton";
import {
  Store,
  ExternalLink,
  Star,
  ChevronLeft,
  ChevronRight,
  FileText,
  Bot,
  Workflow,
  Sparkles,
} from "lucide-react";

// Icône Instagram en SVG inline (l'icône de marque n'est pas exportée par lucide).
function IgIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

// Carte promo insérée dans la grille (proposition B) — aucune mention de prix.
function PromoCard() {
  return (
    <article className="mk-promo-card">
      <div className="mk-promo-ico"><Sparkles size={22} strokeWidth={2} /></div>
      <h3>Aucun outil ne fait <em>exactement</em> ce qu'il vous faut ?</h3>
      <p>On vous crée un agent IA sur‑mesure pour votre métier, livré sous 24h.</p>
      <CtaButton className="btn btn-primary mk-promo-btn">Réclamer mon agent →</CtaButton>
      <Link href="/agents-gpt" className="mk-promo-link">ou voir les agents prêts à l'emploi</Link>
    </article>
  );
}
import {
  filterTools,
  CATEGORIES,
  PRICES,
  TOOLS,
  type MarketplaceTool,
} from "@/lib/data/marketplace";
import MarketplaceControls from "./MarketplaceControls";

export const metadata: Metadata = {
  title: "Marketplace IA — Outils, prompts, agents & workflows | MonAgentPerso",
  description:
    "Explorez la marketplace IA : des milliers d'outils, des prompts prêts à l'emploi, des agents GPT et Claude sur-entraînés et des workflows JSON.",
};

type SearchParams = Promise<{
  q?: string;
  cat?: string;
  price?: string;
  sort?: string;
  page?: string;
}>;

// Onglets de types de contenu. Seul "Outils IA" est actif pour cette première version.
const CONTENT_TABS: {
  key: string;
  label: string;
  Icon: typeof Store;
  active?: boolean;
  href?: string;
}[] = [
  { key: "outils", label: "Outils IA", Icon: Store, active: true },
  { key: "prompts", label: "Prompts", Icon: FileText },
  { key: "gpt", label: "Agents GPT", Icon: Bot, href: "/agents-gpt" },
  { key: "claude", label: "Agents Claude", Icon: Sparkles, href: "/agents-claude" },
  { key: "workflows", label: "Workflows JSON", Icon: Workflow },
];

function buildHref(
  base: { q: string; cat: string; price: string; sort: string; page?: string },
  overrides: Record<string, string>,
): string {
  const merged = { ...base, ...overrides };
  const params = new URLSearchParams();
  if (merged.q) params.set("q", merged.q);
  if (merged.cat) params.set("cat", merged.cat);
  if (merged.price) params.set("price", merged.price);
  if (merged.sort && merged.sort !== "score") params.set("sort", merged.sort);
  if (merged.page && merged.page !== "1") params.set("page", merged.page);
  const qs = params.toString();
  return qs ? `/marketplace?${qs}` : "/marketplace";
}

function ToolCard({ tool }: { tool: MarketplaceTool }) {
  return (
    <article className="mk-card">
      <div className="mk-card-head">
        <div className="mk-card-logo">{tool.name.charAt(0).toUpperCase()}</div>
        <div className="mk-card-titles">
          <h3>{tool.name}</h3>
          <div className="mk-card-meta">
            {tool.price && <span className="mk-price">{tool.price}</span>}
            {tool.score != null && (
              <span className="mk-score">
                <Star size={12} strokeWidth={2.5} fill="currentColor" /> {tool.score.toFixed(1)}
              </span>
            )}
          </div>
        </div>
      </div>

      <p className="mk-card-desc">{tool.desc}</p>

      {tool.functions.length > 0 && (
        <div className="mk-card-tags">
          {tool.functions.slice(0, 3).map((f) => (
            <span key={f} className="mk-tag">
              {f}
            </span>
          ))}
        </div>
      )}

      <a
        href={tool.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mk-card-cta"
      >
        Découvrir l'outil <ExternalLink size={14} strokeWidth={2.2} />
      </a>
    </article>
  );
}

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const q = sp.q ?? "";
  const cat = sp.cat ?? "";
  const price = sp.price ?? "";
  const sort = sp.sort ?? "score";
  const page = Number(sp.page ?? "1") || 1;

  const base = { q, cat, price, sort };
  const { items, total, page: current, pages } = filterTools({ q, cat, price, sort, page });

  return (
    <div className="mk">
      {/* === BANNIÈRE INSTAGRAM (bien visible, en haut) === */}
      <div className="container">
        <a
          href="https://www.instagram.com/evolify_ai/"
          target="_blank"
          rel="noopener noreferrer"
          className="ig-banner"
        >
          <div className="ig-banner-ico"><IgIcon size={28} /></div>
          <div className="ig-banner-text">
            <b>L'actualité IA, c'est par ici 👉 @evolify_ai</b>
            <span>
              Prompts prêts à l'emploi, agents IA, outils IA méconnus et nouveautés : suivez-nous sur
              Instagram pour ne rien rater.
            </span>
          </div>
          <span className="ig-banner-btn">
            <IgIcon size={16} /> Suivre sur Instagram
          </span>
        </a>
      </div>

      {/* === HERO === */}
      <div className="mk-hero">
        <div className="container mk-hero-grid">
          <div>
            <span className="section-eyebrow">Marketplace</span>
            <h1 className="mk-hero-title">La marketplace IA, tout au même endroit.</h1>
            <p className="mk-hero-sub">
              Des milliers d'outils IA, des prompts prêts à l'emploi, des agents GPT et Claude
              sur-entraînés et des workflows automatisés. Explorez, comparez, adoptez.
            </p>
            <div className="mk-hero-stats">
              <div className="mk-stat">
                <b>{TOOLS.length.toLocaleString("fr-FR")}</b>
                <span>outils référencés</span>
              </div>
              <div className="mk-stat">
                <b>{CATEGORIES.length}</b>
                <span>catégories</span>
              </div>
              <div className="mk-stat">
                <b>Bientôt</b>
                <span>prompts & agents</span>
              </div>
            </div>
          </div>
          <div className="mk-hero-icon" aria-hidden="true">
            <Store size={96} strokeWidth={1.4} />
          </div>
        </div>
      </div>

      {/* === BANDEAU PROMESSE (A) — version compacte, aucune mention de prix === */}
      <div className="container">
        <div className="mk-promise">
          <div className="mk-promise-ico"><Sparkles size={20} strokeWidth={2.2} /></div>
          <p className="mk-promise-line">
            <strong>Aucun outil ne colle parfaitement à votre métier ?</strong> On vous crée un agent
            IA sur‑mesure, livré sous 24h.
          </p>
          <CtaButton className="btn btn-primary mk-promise-btn">Réclamer mon agent →</CtaButton>
        </div>
      </div>

      <div className="container">
        {/* === ONGLETS TYPES DE CONTENU === */}
        <div className="mk-tabs" role="tablist" aria-label="Types de contenu">
          {CONTENT_TABS.map(({ key, label, Icon, active, href }) =>
            active ? (
              <span key={key} className="mk-tab mk-tab-active" role="tab" aria-selected="true">
                <Icon size={16} strokeWidth={2.1} /> {label}
              </span>
            ) : href ? (
              <Link key={key} href={href} className="mk-tab" role="tab">
                <Icon size={16} strokeWidth={2.1} /> {label}
              </Link>
            ) : (
              <span key={key} className="mk-tab mk-tab-soon" role="tab" aria-disabled="true">
                <Icon size={16} strokeWidth={2.1} /> {label}
                <span className="mk-soon-badge">Bientôt</span>
              </span>
            ),
          )}
        </div>

        {/* === CONTRÔLES === */}
        <MarketplaceControls q={q} cat={cat} price={price} sort={sort} prices={PRICES} />

        {/* === PILLS CATÉGORIES === */}
        <div className="mk-cats">
          <Link
            href={buildHref(base, { cat: "", page: "1" })}
            className={`mk-cat ${cat === "" ? "mk-cat-active" : ""}`}
          >
            Toutes
          </Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c.name}
              href={buildHref(base, { cat: c.name, page: "1" })}
              className={`mk-cat ${cat === c.name ? "mk-cat-active" : ""}`}
            >
              {c.name} <span className="mk-cat-count">{c.count}</span>
            </Link>
          ))}
        </div>

        {/* === RÉSULTATS === */}
        <div className="mk-resultline">
          <span>
            <strong>{total.toLocaleString("fr-FR")}</strong> outil{total > 1 ? "s" : ""}
            {cat && (
              <>
                {" "}
                · catégorie <strong>{cat}</strong>
              </>
            )}
            {q && (
              <>
                {" "}
                · « {q} »
              </>
            )}
          </span>
          <span className="mk-resultline-page">
            Page {current} / {pages}
          </span>
        </div>

        {items.length === 0 ? (
          <div className="mk-empty">
            <p>Aucun outil ne correspond à votre recherche.</p>
            <Link href="/marketplace" className="btn btn-light">
              Réinitialiser les filtres
            </Link>
          </div>
        ) : (
          <div className="mk-grid">
            {items.map((tool, i) => (
              <Fragment key={tool.slug || tool.name}>
                <ToolCard tool={tool} />
                {(i + 1) % 8 === 0 && i < items.length - 1 && <PromoCard key={`promo-${i}`} />}
              </Fragment>
            ))}
          </div>
        )}

        {/* === PAGINATION === */}
        {pages > 1 && (
          <div className="mk-pagination">
            {current > 1 ? (
              <Link
                href={buildHref(base, { page: String(current - 1) })}
                className="btn btn-light mk-page-btn"
              >
                <ChevronLeft size={16} /> Précédent
              </Link>
            ) : (
              <span className="btn btn-light mk-page-btn mk-page-disabled">
                <ChevronLeft size={16} /> Précédent
              </span>
            )}
            <span className="mk-page-info">
              {current} / {pages}
            </span>
            {current < pages ? (
              <Link
                href={buildHref(base, { page: String(current + 1) })}
                className="btn btn-light mk-page-btn"
              >
                Suivant <ChevronRight size={16} />
              </Link>
            ) : (
              <span className="btn btn-light mk-page-btn mk-page-disabled">
                Suivant <ChevronRight size={16} />
              </span>
            )}
          </div>
        )}
      </div>

      {/* === BARRE CTA COLLANTE (C) — aucune mention de prix === */}
      <div className="mk-sticky">
        <span className="mk-sticky-text">
          🚀 Votre agent IA métier <strong>sur‑mesure</strong>, livré sous 24h.
        </span>
        <CtaButton className="btn btn-primary mk-sticky-btn">Réclamer mon agent →</CtaButton>
      </div>
    </div>
  );
}
