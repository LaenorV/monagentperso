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
function PromoCard({ m }: { m: Dictionary["mk"] }) {
  return (
    <article className="mk-promo-card">
      <div className="mk-promo-ico"><Sparkles size={22} strokeWidth={2} /></div>
      <h3>{m.promoTitle1}<em>{m.promoTitleEm}</em>{m.promoTitle2}</h3>
      <p>{m.promoText}</p>
      <CtaButton className="btn btn-primary mk-promo-btn">{m.promoBtn}</CtaButton>
      <Link href="/agents-gpt" className="mk-promo-link">{m.promoLink}</Link>
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
import { getDict, getLocale, dictFor } from "@/lib/i18n/server";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const t = dictFor(await getLocale());
  return { title: t.mk.metaTitle, description: t.mk.metaDesc };
}

type SearchParams = Promise<{
  q?: string;
  cat?: string;
  price?: string;
  sort?: string;
  page?: string;
}>;

// Onglets de types de contenu. Seul "Outils IA" est actif pour cette première version.
function contentTabs(m: Dictionary["mk"]): {
  key: string;
  label: string;
  Icon: typeof Store;
  active?: boolean;
  href?: string;
}[] {
  return [
    { key: "outils", label: m.tabOutils, Icon: Store, active: true },
    { key: "prompts", label: m.tabPrompts, Icon: FileText },
    { key: "gpt", label: m.tabGpt, Icon: Bot, href: "/agents-gpt" },
    { key: "claude", label: m.tabClaude, Icon: Sparkles, href: "/agents-claude" },
    { key: "workflows", label: m.tabWorkflows, Icon: Workflow },
  ];
}

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

function ToolCard({ tool, discoverLabel }: { tool: MarketplaceTool; discoverLabel: string }) {
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
        {discoverLabel} <ExternalLink size={14} strokeWidth={2.2} />
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

  const locale = await getLocale();
  const t = dictFor(locale);
  const m = t.mk;
  const nf = (n: number) => n.toLocaleString(locale === "en" ? "en-US" : "fr-FR");

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
            <b>{m.igTitle}</b>
            <span>{m.igText}</span>
          </div>
          <span className="ig-banner-btn">
            <IgIcon size={16} /> {m.igBtn}
          </span>
        </a>
      </div>

      {/* === HERO === */}
      <div className="mk-hero">
        <div className="container mk-hero-grid">
          <div>
            <span className="section-eyebrow">{m.eyebrow}</span>
            <h1 className="mk-hero-title">{m.heroTitle}</h1>
            <p className="mk-hero-sub">{m.heroSub}</p>
            <div className="mk-hero-stats">
              <div className="mk-stat">
                <b>{nf(TOOLS.length)}</b>
                <span>{m.statTools}</span>
              </div>
              <div className="mk-stat">
                <b>{CATEGORIES.length}</b>
                <span>{m.statCats}</span>
              </div>
              <div className="mk-stat">
                <b>{m.statSoon}</b>
                <span>{m.statSoonSub}</span>
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
            <strong>{m.promiseStrong}</strong>{m.promiseRest}
          </p>
          <CtaButton className="btn btn-primary mk-promise-btn">{m.promiseBtn}</CtaButton>
        </div>
      </div>

      <div className="container">
        {/* === ONGLETS TYPES DE CONTENU === */}
        <div className="mk-tabs" role="tablist" aria-label={m.tabsLabel}>
          {contentTabs(m).map(({ key, label, Icon, active, href }) =>
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
                <span className="mk-soon-badge">{m.soonBadge}</span>
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
            {m.catsAll}
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
            <strong>{nf(total)}</strong> {total > 1 ? m.resultToolPlur : m.resultToolSing}
            {cat && (
              <>
                {" "}
                · {m.resultCategory} <strong>{cat}</strong>
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
            {m.pageLabel.replace("{current}", String(current)).replace("{pages}", String(pages))}
          </span>
        </div>

        {items.length === 0 ? (
          <div className="mk-empty">
            <p>{m.emptyText}</p>
            <Link href="/marketplace" className="btn btn-light">
              {m.resetFilters}
            </Link>
          </div>
        ) : (
          <div className="mk-grid">
            {items.map((tool, i) => (
              <Fragment key={tool.slug || tool.name}>
                <ToolCard tool={tool} discoverLabel={m.discover} />
                {(i + 1) % 8 === 0 && i < items.length - 1 && <PromoCard key={`promo-${i}`} m={m} />}
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
                <ChevronLeft size={16} /> {m.prev}
              </Link>
            ) : (
              <span className="btn btn-light mk-page-btn mk-page-disabled">
                <ChevronLeft size={16} /> {m.prev}
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
                {m.next} <ChevronRight size={16} />
              </Link>
            ) : (
              <span className="btn btn-light mk-page-btn mk-page-disabled">
                {m.next} <ChevronRight size={16} />
              </span>
            )}
          </div>
        )}
      </div>

      {/* === BARRE CTA COLLANTE (C) — aucune mention de prix === */}
      <div className="mk-sticky">
        <span className="mk-sticky-text">
          {m.stickyA}{m.stickyStrong && <strong>{m.stickyStrong}</strong>}{m.stickyB}
        </span>
        <CtaButton className="btn btn-primary mk-sticky-btn">{m.stickyBtn}</CtaButton>
      </div>
    </div>
  );
}
