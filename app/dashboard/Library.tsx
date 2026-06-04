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
  { key: "all", label: "Tous" },
  { key: "gpt", label: "Agents GPT" },
  { key: "claude", label: "Agents Claude" },
  { key: "prompt", label: "Prompts" },
  { key: "workflow", label: "Workflows" },
  { key: "custom", label: "Agents personnalisés" },
] as const;

type FilterKey = (typeof FILTERS)[number]["key"];

function matches(item: LibraryItem, f: FilterKey): boolean {
  if (f === "all") return true;
  if (f === "gpt") return item.kind === "gpt" || item.kind === "both";
  if (f === "claude") return item.kind === "claude" || item.kind === "both";
  return item.kind === f;
}

function Badges({ kind }: { kind: LibraryItemKind }) {
  return (
    <div className="agent-card-badges">
      {(kind === "gpt" || kind === "both") && (
        <span className="agent-badge agent-badge-gpt"><Bot size={11} strokeWidth={2.4} /> GPT</span>
      )}
      {(kind === "claude" || kind === "both") && (
        <span className="agent-badge agent-badge-claude"><Sparkles size={11} strokeWidth={2.4} /> Claude</span>
      )}
      {kind === "custom" && (
        <span className="agent-badge agent-badge-custom"><Star size={11} strokeWidth={2.4} /> Personnalisé</span>
      )}
      {kind === "prompt" && (
        <span className="agent-badge agent-badge-prompt"><FileText size={11} strokeWidth={2.4} /> Prompt</span>
      )}
      {kind === "workflow" && (
        <span className="agent-badge agent-badge-workflow"><Workflow size={11} strokeWidth={2.4} /> Workflow</span>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: NonNullable<LibraryItem["status"]> }) {
  const map = {
    en_cours: { label: "En cours", cls: "status-badge-pending", Icon: Clock },
    livre: { label: "Livré", cls: "status-badge-delivered", Icon: CheckCircle2 },
    revision: { label: "Modification en cours", cls: "status-badge-revision", Icon: AlertTriangle },
  }[status];
  const Icon = map.Icon;
  return (
    <span className={`status-badge ${map.cls}`}>
      <Icon size={12} strokeWidth={2.5} /> {map.label}
    </span>
  );
}

function ItemButton({ item }: { item: LibraryItem }) {
  if (item.locked || !item.href) {
    const label =
      item.status === "livre"
        ? "Accès envoyé par email"
        : item.status === "en_cours" || item.status === "revision"
        ? "En cours de préparation"
        : "Bientôt disponible";
    return <span className="btn btn-light btn-nav lib-btn-disabled">{label}</span>;
  }
  const label = item.kind === "custom" ? "Ouvrir mon agent" : "Ouvrir";
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
  const [filter, setFilter] = useState<FilterKey>("all");
  const visible = items.filter((i) => matches(i, filter));

  return (
    <div className="dashboard-card library">
      <div className="agent-card-head">
        <h2><LibraryIcon size={20} strokeWidth={2} style={{ verticalAlign: "-3px", marginRight: 8 }} />Ma bibliothèque</h2>
        <Link href="/agents-gpt" className="btn btn-light btn-nav">Découvrir la marketplace</Link>
      </div>

      {items.length === 0 ? (
        <div className="library-empty">
          <p>Vous n'avez pas encore débloqué de ressource.</p>
          <Link href="/agents-gpt" className="btn btn-primary">Découvrir la marketplace →</Link>
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
                  {f.label}
                  <span className="library-tab-count">{count}</span>
                </button>
              );
            })}
          </div>

          {visible.length === 0 ? (
            <p className="library-empty-filter">Aucune ressource dans cette catégorie pour l'instant.</p>
          ) : (
            <div className="library-grid">
              {visible.map((item) => (
                <article className="library-item" key={item.key}>
                  <div className="library-item-top">
                    <div className="purchased-agent-logo">{item.name.charAt(0)}</div>
                    <Badges kind={item.kind} />
                  </div>
                  <span className="agent-card-cat">{item.category}</span>
                  <h3 className="library-item-name">{item.name}</h3>
                  <div className="library-item-meta">
                    {item.status && <StatusBadge status={item.status} />}
                    {item.date && (
                      <span className="purchased-agent-date">
                        {new Date(item.date).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    )}
                  </div>
                  <div className="library-item-foot">
                    <ItemButton item={item} />
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
