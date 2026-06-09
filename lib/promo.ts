import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

// ============================================================================
// Logique serveur des codes promo. Le prix final est TOUJOURS recalculé ici,
// jamais par le frontend. À utiliser avec le client admin (service_role).
// ============================================================================

export const PERSONALIZED_AMOUNT = 4990; // centimes (49,90 €)
export const MARKETPLACE_AMOUNT = 490; // centimes (4,90 €)

export type PurchaseType = "personalized_agent" | "marketplace";

export type PromoRow = {
  id: string;
  code: string;
  user_id: string | null;
  discount_type: string;
  discount_value: number;
  applies_to: string;
  max_uses: number;
  used_count: number;
  status: string;
};

export type ValidationResult =
  | { ok: true; promo: PromoRow; baseAmount: number; finalAmount: number; isFree: boolean }
  | { ok: false; error: string; message: string };

/** Génère un code lisible MAP-XXXXXX (sans caractères ambigus). */
export function generatePromoCode(): string {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += alphabet[Math.floor(Math.random() * alphabet.length)];
  return `MAP-${s}`;
}

function baseAmountFor(type: PurchaseType): number {
  return type === "personalized_agent" ? PERSONALIZED_AMOUNT : MARKETPLACE_AMOUNT;
}

/**
 * Valide un code pour un utilisateur + un type d'achat. NE marque PAS le code utilisé.
 * Renvoie le prix final recalculé côté serveur.
 */
export async function validatePromo(
  admin: SupabaseClient,
  opts: { code: string; userId: string; purchaseType: PurchaseType },
): Promise<ValidationResult> {
  const code = opts.code.trim().toUpperCase();
  if (!code) return { ok: false, error: "empty", message: "Entrez un code." };

  const { data: promo } = await admin
    .from("promo_codes")
    .select(
      "id, code, user_id, discount_type, discount_value, applies_to, max_uses, used_count, status",
    )
    .eq("code", code)
    .maybeSingle();

  if (!promo) return { ok: false, error: "not_found", message: "Code inconnu." };
  if (promo.user_id !== opts.userId)
    return { ok: false, error: "wrong_owner", message: "Ce code n'est pas associé à votre compte." };
  if (promo.status !== "active")
    return { ok: false, error: "inactive", message: "Ce code a déjà été utilisé ou n'est plus valide." };
  if (promo.used_count >= promo.max_uses)
    return { ok: false, error: "used", message: "Ce code a déjà été utilisé." };
  if (promo.applies_to !== "all" && promo.applies_to !== opts.purchaseType)
    return {
      ok: false,
      error: "wrong_target",
      message:
        opts.purchaseType === "marketplace"
          ? "Ce code ne s'applique pas à la marketplace."
          : "Ce code ne s'applique pas à l'agent personnalisé.",
    };

  const baseAmount = baseAmountFor(opts.purchaseType);
  let finalAmount = baseAmount;
  if (promo.discount_type === "free" || promo.discount_value >= 100) {
    finalAmount = 0;
  } else if (promo.discount_type === "percentage") {
    finalAmount = Math.round((baseAmount * (100 - promo.discount_value)) / 100);
  } else if (promo.discount_type === "fixed") {
    finalAmount = Math.max(0, baseAmount - promo.discount_value);
  }

  return { ok: true, promo: promo as PromoRow, baseAmount, finalAmount, isFree: finalAmount === 0 };
}

/**
 * Marque un code consommé (optimistic lock : seulement si encore 'active').
 * Renvoie true si la consommation a réussi (1 ligne mise à jour).
 */
export async function markPromoUsed(admin: SupabaseClient, promo: PromoRow): Promise<boolean> {
  const newCount = promo.used_count + 1;
  const newStatus = newCount >= promo.max_uses ? "used" : "active";
  const { data, error } = await admin
    .from("promo_codes")
    .update({ used_count: newCount, status: newStatus, used_at: new Date().toISOString() })
    .eq("id", promo.id)
    .eq("status", "active")
    .lt("used_count", promo.max_uses)
    .select("id");
  if (error) return false;
  return (data?.length ?? 0) > 0;
}

/** Marque un code utilisé à partir de son code texte (utilisé par le webhook). */
export async function markPromoUsedByCode(admin: SupabaseClient, code: string): Promise<void> {
  const { data: promo } = await admin
    .from("promo_codes")
    .select("id, code, user_id, discount_type, discount_value, applies_to, max_uses, used_count, status")
    .eq("code", code.trim().toUpperCase())
    .maybeSingle();
  if (promo && promo.status === "active") await markPromoUsed(admin, promo as PromoRow);
}
