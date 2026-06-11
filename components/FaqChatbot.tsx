"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Bot, X, Search, ChevronDown } from "lucide-react";
import { getFaqCategories, getFaqItems } from "@/lib/faq-data";
import { useLocale } from "@/lib/i18n/context";

export default function FaqChatbot() {
  const { t, locale } = useLocale();
  const categories = getFaqCategories(locale);
  const items = getFaqItems(locale);
  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Items filtrés par catégorie + recherche
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (activeCategory !== "all" && item.category !== activeCategory) return false;
      if (q) {
        const hay = `${item.q} ${item.a}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [activeCategory, query, items]);

  // Focus search à l'ouverture
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => searchRef.current?.focus(), 250);
      return () => clearTimeout(t);
    }
  }, [open]);

  // ESC ferme le panel
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Reset état au close
  useEffect(() => {
    if (!open) {
      setExpandedId(null);
    }
  }, [open]);

  return (
    <>
      {/* === Bouton flottant + bulle === */}
      <div className={`faq-fab${open ? " faq-fab-hidden" : ""}`}>
        <div className="faq-fab-bubble" aria-hidden="true">
          {t.faq.bubble}
        </div>
        <button
          type="button"
          className="faq-fab-button"
          onClick={() => setOpen(true)}
          aria-label={t.faq.openLabel}
        >
          <Bot size={28} strokeWidth={1.8} />
        </button>
      </div>

      {/* === Panel FAQ === */}
      <div
        ref={panelRef}
        className={`faq-panel${open ? " open" : ""}`}
        role="dialog"
        aria-modal="false"
        aria-label={t.faq.panelLabel}
        aria-hidden={!open}
      >
        <header className="faq-panel-head">
          <div className="faq-panel-head-title">
            <span className="faq-panel-head-ico">
              <Bot size={20} strokeWidth={2} />
            </span>
            <div>
              <strong>{t.faq.title}</strong>
              <small>MonAgentPerso</small>
            </div>
          </div>
          <button
            type="button"
            className="faq-panel-close"
            onClick={() => setOpen(false)}
            aria-label={t.faq.closeLabel}
          >
            <X size={20} strokeWidth={2.2} />
          </button>
        </header>

        <div className="faq-panel-search">
          <Search size={16} strokeWidth={2.2} className="faq-panel-search-ico" />
          <input
            ref={searchRef}
            type="search"
            placeholder={t.faq.searchPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label={t.faq.searchLabel}
          />
        </div>

        <nav className="faq-panel-categories" aria-label={t.faq.filterLabel}>
          <button
            type="button"
            className={`faq-cat${activeCategory === "all" ? " active" : ""}`}
            onClick={() => setActiveCategory("all")}
          >
            {t.faq.all}
          </button>
          {categories.map((c) => (
            <button
              type="button"
              key={c.id}
              className={`faq-cat${activeCategory === c.id ? " active" : ""}`}
              onClick={() => setActiveCategory(c.id)}
            >
              {c.label}
            </button>
          ))}
        </nav>

        <div className="faq-panel-body">
          {filtered.length === 0 ? (
            <p className="faq-empty">
              {t.faq.empty}<br />
              {t.faq.emptyHint}
            </p>
          ) : (
            <ul className="faq-list">
              {filtered.map((item) => {
                const isExpanded = expandedId === item.id;
                return (
                  <li key={item.id} className={`faq-item${isExpanded ? " open" : ""}`}>
                    <button
                      type="button"
                      className="faq-item-q"
                      onClick={() => setExpandedId(isExpanded ? null : item.id)}
                      aria-expanded={isExpanded}
                    >
                      <span>{item.q}</span>
                      <span className="faq-item-chevron" aria-hidden="true">
                        <ChevronDown size={16} strokeWidth={2.4} />
                      </span>
                    </button>
                    {isExpanded && <div className="faq-item-a">{item.a}</div>}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <footer className="faq-panel-foot">
          {t.faq.foot}
        </footer>
      </div>
    </>
  );
}
