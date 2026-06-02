"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Search } from "lucide-react";

type Props = {
  q: string;
  cat: string;
  price: string;
  sort: string;
  prices: string[];
};

/**
 * Barre de recherche + filtres prix + tri.
 * Met à jour l'URL (searchParams) ; la catégorie est gérée par les pills (liens).
 */
export default function MarketplaceControls({ q, cat, price, sort, prices }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [search, setSearch] = useState(q);

  function push(overrides: Record<string, string>) {
    const params = new URLSearchParams();
    const merged = { q: search, cat, price, sort, ...overrides };
    if (merged.q) params.set("q", merged.q);
    if (merged.cat) params.set("cat", merged.cat);
    if (merged.price) params.set("price", merged.price);
    if (merged.sort && merged.sort !== "score") params.set("sort", merged.sort);
    // page repart à 1 à chaque changement de filtre.
    const qs = params.toString();
    start(() => router.push(qs ? `/marketplace?${qs}` : "/marketplace"));
  }

  return (
    <div className="mk-controls" data-pending={pending ? "1" : undefined}>
      <form
        className="mk-search"
        onSubmit={(e) => {
          e.preventDefault();
          push({ q: search });
        }}
      >
        <Search size={18} className="mk-search-ico" />
        <input
          type="search"
          placeholder="Rechercher un outil, un usage, un métier…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Rechercher dans la marketplace"
        />
        <button type="submit" className="btn btn-primary mk-search-btn">
          Rechercher
        </button>
      </form>

      <div className="mk-selects">
        <select
          value={price}
          onChange={(e) => push({ price: e.target.value })}
          aria-label="Filtrer par tarif"
        >
          <option value="">Tous les tarifs</option>
          {prices.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => push({ sort: e.target.value })}
          aria-label="Trier"
        >
          <option value="score">Meilleur score</option>
          <option value="name">Nom (A→Z)</option>
        </select>
      </div>
    </div>
  );
}
