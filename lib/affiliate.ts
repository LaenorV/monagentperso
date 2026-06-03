// ============================================================================
// Affiliation maison — utilitaires de tracking du lien ?ref=
// Aucun accès DOM au niveau module → ce fichier est sûr à importer partout
// (client ET serveur). `sanitizeRef` est une fonction pure réutilisée côté API.
// ============================================================================

export const AFFILIATE_COOKIE = "map_affiliate_ref";
export const AFFILIATE_TTL_DAYS = 30;

/**
 * Normalise un ref affilié : minuscules, caractères [a-z0-9_-], max 64.
 * Renvoie "" si rien d'exploitable. Utilisable côté client comme serveur.
 */
export function sanitizeRef(raw: string | null | undefined): string {
  if (!raw) return "";
  const cleaned = String(raw).trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
  return cleaned.slice(0, 64);
}

function setCookie(name: string, value: string, days: number) {
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; SameSite=Lax`;
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Stocke le ref affilié pour 30 jours (cookie + miroir localStorage).
 * À appeler UNIQUEMENT côté client.
 */
export function setAffiliateRef(ref: string) {
  const clean = sanitizeRef(ref);
  if (!clean) return;
  try {
    setCookie(AFFILIATE_COOKIE, clean, AFFILIATE_TTL_DAYS);
  } catch {
    /* cookies bloqués : on continue avec localStorage */
  }
  try {
    window.localStorage.setItem(AFFILIATE_COOKIE, clean);
  } catch {
    /* localStorage indisponible : on garde le cookie */
  }
}

/**
 * Lit le ref affilié courant (cookie prioritaire, fallback localStorage).
 * Renvoie "" si absent. Sûr à appeler côté client ; renvoie "" côté serveur.
 */
export function getAffiliateRef(): string {
  if (typeof window === "undefined") return "";
  let ref = "";
  try {
    ref = getCookie(AFFILIATE_COOKIE) ?? "";
  } catch {
    /* ignore */
  }
  if (!ref) {
    try {
      ref = window.localStorage.getItem(AFFILIATE_COOKIE) ?? "";
    } catch {
      /* ignore */
    }
  }
  return sanitizeRef(ref);
}
