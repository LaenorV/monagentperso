import toolsData from "./marketplace-tools.json";

export type MarketplaceTool = {
  name: string;
  slug: string;
  desc: string;
  url: string;
  functions: string[];
  uses: string[];
  price: string;
  jobs: string[];
  platforms: string[];
  tags: string[];
  score: number | null;
};

export const TOOLS = toolsData as unknown as MarketplaceTool[];

export const PER_PAGE = 24;

// Catégories de fonctions, triées par popularité (nb d'outils).
export const CATEGORIES: { name: string; count: number }[] = (() => {
  const map = new Map<string, number>();
  for (const t of TOOLS) {
    for (const f of t.functions) map.set(f, (map.get(f) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
})();

export const PRICES: string[] = (() => {
  const set = new Set<string>();
  for (const t of TOOLS) if (t.price) set.add(t.price);
  return [...set].sort();
})();

export type MarketplaceQuery = {
  q?: string;
  cat?: string;
  price?: string;
  sort?: string;
  page?: number;
};

export type MarketplaceResult = {
  items: MarketplaceTool[];
  total: number;
  page: number;
  pages: number;
};

export function filterTools({
  q = "",
  cat = "",
  price = "",
  sort = "score",
  page = 1,
}: MarketplaceQuery): MarketplaceResult {
  const needle = q.trim().toLowerCase();

  let list = TOOLS.filter((t) => {
    if (cat && !t.functions.includes(cat)) return false;
    if (price && t.price !== price) return false;
    if (needle) {
      const hay = (
        t.name +
        " " +
        t.desc +
        " " +
        t.tags.join(" ") +
        " " +
        t.uses.join(" ") +
        " " +
        t.jobs.join(" ")
      ).toLowerCase();
      if (!hay.includes(needle)) return false;
    }
    return true;
  });

  if (sort === "name") {
    list = list.slice().sort((a, b) => a.name.localeCompare(b.name, "fr"));
  } else {
    // Par défaut : meilleur score d'abord.
    list = list.slice().sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  }

  const total = list.length;
  const pages = Math.max(1, Math.ceil(total / PER_PAGE));
  const safePage = Math.min(Math.max(1, page), pages);
  const start = (safePage - 1) * PER_PAGE;
  const items = list.slice(start, start + PER_PAGE);

  return { items, total, page: safePage, pages };
}
