"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bot,
  Sparkles,
  FileText,
  Workflow,
  Star,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Library as LibraryIcon,
} from "lucide-react";
import { useLocale } from "@/lib/i18n/context";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export type LibraryItemKind =
  | "both"
  | "gpt"
  | "claude"
  | "custom"
  | "prompt"
  | "workflow";

export type LibraryItem = {
  key: string;
  name: string;
  kind: LibraryItemKind;
  category: string;
  date: string | null;
  status?: "en_cours" | "livre" | "revision" | null;
  href?: string | null;
  external?: boolean;
  locked?: boolean;
};

const FILTERS = [
  { key: "all" },
  { key: "gpt" },
  { key: "claude" },
  { key: "prompt" },
  { key: "workflow" },
  { key: "custom" },
] as const;

type FilterKey = (typeof FILTERS)[number]["key"];

type Dash = Dictionary["dashboard"];

function filterLabel(key: FilterKey, d: Dash): string {
  return {
    all: d.filterAll,
    gpt: d.filterGpt,
    claude: d.filterClaude,
    prompt: d.filterPrompt,
    workflow: d.filterWorkflow,
    custom: d.filterCustom,
  }[key];
}

function matches(item: LibraryItem, f: FilterKey): boolean {
  if (f === "all") return true;
  if (f === "gpt") return item.kind === "gpt" || item.kind === "both";
  if (f === "claude") return item.kind === "claude" || item.kind === "both";
  return item.kind === f;
}

function Badges({ kind, d }: { kind: LibraryItemKind; d: Dash }) {
  return (
    <div className="agent-card-badges">
      {(kind === "gpt" || kind === "both") && (
        <span className="agent-badge agent-badge-gpt"><Bot size={11} strokeWidth={2.4} /> GPT</span>
      )}
      {(kind === "claude" || kind === "both") && (
        <span className="agent-badge agent-badge-claude"><Sparkles size={11} strokeWidth={2.4} /> Claude</span>
      )}
      {kind === "custom" && (
        <span className="agent-badge agent-badge-custom"><Star size={11} strokeWidth={2.4} /> {d.badgeCustom}</span>
      )}
      {kind === "prompt" && (
        <span className="agent-badge agent-badge-prompt"><FileText size={11} strokeWidth={2.4} /> {d.badgePrompt}</span>
      )}
      {kind === "workflow" && (
        <span className="agent-badge agent-badge-workflow"><Workflow size={11} strokeWidth={2.4} /> {d.badgeWorkflow}</span>
      )}
    </div>
  );
}

function StatusBadge({ status, d }: { status: NonNullable<LibraryItem["status"]>; d: Dash }) {
  const map = {
    en_cours: { label: d.statusEnCours, cls: "status-badge-pending", Icon: Clock },
    livre: { label: d.statusLivre, cls: "status-badge-delivered", Icon: CheckCircle2 },
    revision: { label: d.statusRevision, cls: "status-badge-revision", Icon: AlertTriangle },
  }[status];
  const Icon = map.Icon;
  return (
    <span className={`status-badge ${map.cls}`}>
      <Icon size={12} strokeWidth={2.5} /> {map.label}
    </span>
  );
}

function ItemButton({ item, d }: { item: LibraryItem; d: Dash }) {
  if (item.locked || !item.href) {
    const label =
      item.status === "livre"
        ? d.accessByEmail
        : item.status === "en_cours" || item.status === "revision"
        ? d.preparing
        : d.comingSoon;
    return <span className="btn btn-light btn-nav lib-btn-disabled">{label}</span>;
  }
  const label = item.kind === "custom" ? d.openMyAgent : d.open;
  if (item.external) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-nav">
        {label} <ArrowRight size={15} strokeWidth={2.2} />
      </a>
    );
  }
  return (
    <Link href={item.href} className="btn btn-primary btn-nav">
      {label} <ArrowRight size={15} strokeWidth={2.2} />
    </Link>
  );
}

export default function Library({ items }: { items: LibraryItem[] }) {
  const { t, locale } = useLocale();
  const d = t.dashboard;
  const dateLocale = locale === "en" ? "en-US" : "fr-FR";
  const [filter, setFilter] = useState<FilterKey>("all");
  const visible = items.filter((i) => matches(i, filter));

  return (
    <div className="dashboard-card library">
      <div className="agent-card-head">
        <h2><LibraryIcon size={20} strokeWidth={2} style={{ verticalAlign: "-3px", marginRight: 8 }} />{d.libTitle}</h2>
        <Link href="/agents-gpt" className="btn btn-light btn-nav">{d.libDiscover}</Link>
      </div>

      {items.length === 0 ? (
        <div className="library-empty">
          <p>{d.libEmpty}</p>
          <Link href="/agents-gpt" className="btn btn-primary">{d.libEmptyCta}</Link>
        </div>
      ) : (
        <>
          <div className="library-tabs" role="tablist">
            {FILTERS.map((f) => {
              const count = f.key === "all" ? items.length : items.filter((i) => matches(i, f.key)).length;
              return (
                <button
                  key={f.key}
                  type="button"
                  role="tab"
                  aria-selected={filter === f.key}
                  className={`library-tab ${filter === f.key ? "library-tab-active" : ""}`}
                  onClick={() => setFilter(f.key)}
                >
                  {filterLabel(f.key, d)}
                  <span className="library-tab-count">{count}</span>
                </button>
              );
            })}
          </div>

          {visible.length === 0 ? (
            <p className="library-empty-filter">{d.libEmptyFilter}</p>
          ) : (
            <div className="library-grid">
              {visible.map((item) => (
                <article className="library-item" key={item.key}>
                  <div className="library-item-top">
                    <div className="purchased-agent-logo">{item.name.charAt(0)}</div>
                    <Badges kind={item.kind} d={d} />
                  </div>
                  <span className="agent-card-cat">{item.category}</span>
                  <h3 className="library-item-name">{item.name}</h3>
                  <div className="library-item-meta">
                    {item.status && <StatusBadge status={item.status} d={d} />}
                    {item.date && (
                      <span className="purchased-agent-date">
                        {new Date(item.date).toLocaleDateString(dateLocale, {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    )}
                  </div>
                  <div className="library-item-foot">
                    <ItemButton item={item} d={d} />
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
