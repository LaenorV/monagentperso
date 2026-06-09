import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generatePromoCode } from "@/lib/promo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SpinDef = {
  result_type: "none" | "perso_30" | "marketplace_free" | "perso_free";
  result_label: string;
  win: boolean;
  promo?: { discount_type: string; discount_value: number; applies_to: string };
};

// Résultat décidé CÔTÉ SERVEUR selon les probabilités demandées.
function rollResult(): SpinDef {
  const r = Math.random();
  if (r < 0.5) return { result_type: "none", result_label: "Dommage, pas de gain cette fois.", win: false };
  if (r < 0.7)
    return {
      result_type: "perso_30",
      result_label: "-30 % sur votre agent personnalisé",
      win: true,
      promo: { discount_type: "percentage", discount_value: 30, applies_to: "personalized_agent" },
    };
  if (r < 0.9)
    return {
      result_type: "marketplace_free",
      result_label: "1 achat marketplace offert",
      win: true,
      promo: { discount_type: "percentage", discount_value: 100, applies_to: "marketplace" },
    };
  return {
    result_type: "perso_free",
    result_label: "Agent personnalisé offert",
    win: true,
    promo: { discount_type: "percentage", discount_value: 100, applies_to: "personalized_agent" },
  };
}

// GET → statut du tirage (a-t-il déjà tourné ? quel résultat ?)
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ authenticated: false, spun: false });

  const { data: spin } = await supabase
    .from("wheel_spins")
    .select("result_type, result_label, promo_code")
    .eq("user_id", user.id)
    .maybeSingle();

  return NextResponse.json({
    authenticated: true,
    spun: !!spin,
    result: spin ?? null,
  });
}

// POST → effectue le tirage (un seul par compte)
export async function POST(_req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const admin = createAdminClient();

  // Déjà tourné ? → on renvoie le résultat existant.
  const { data: existing } = await admin
    .from("wheel_spins")
    .select("result_type, result_label, promo_code")
    .eq("user_id", user.id)
    .maybeSingle();
  if (existing) {
    return NextResponse.json({ alreadySpun: true, ...existing });
  }

  const def = rollResult();

  // 1) On "verrouille" le tirage (unique user_id) AVANT de créer le code.
  const { data: spinRow, error: spinErr } = await admin
    .from("wheel_spins")
    .insert({
      user_id: user.id,
      email: user.email,
      result_type: def.result_type,
      result_label: def.result_label,
      promo_code: null,
    })
    .select("id")
    .single();

  if (spinErr) {
    // Course : déjà inséré entre-temps → on renvoie l'existant.
    const { data: again } = await admin
      .from("wheel_spins")
      .select("result_type, result_label, promo_code")
      .eq("user_id", user.id)
      .maybeSingle();
    if (again) return NextResponse.json({ alreadySpun: true, ...again });
    console.error("[/api/wheel/spin] insert spin failed:", spinErr);
    return NextResponse.json({ error: "spin_failed" }, { status: 500 });
  }

  // 2) Gain → on crée le code promo unique lié à l'utilisateur.
  let promoCode: string | null = null;
  if (def.win && def.promo) {
    for (let attempt = 0; attempt < 6; attempt++) {
      const code = generatePromoCode();
      const { error: promoErr } = await admin.from("promo_codes").insert({
        code,
        user_id: user.id,
        email: user.email,
        discount_type: def.promo.discount_type,
        discount_value: def.promo.discount_value,
        applies_to: def.promo.applies_to,
        max_uses: 1,
        used_count: 0,
        status: "active",
      });
      if (!promoErr) {
        promoCode = code;
        break;
      }
      // 23505 = collision de code → on régénère.
      if (promoErr.code !== "23505") {
        console.error("[/api/wheel/spin] insert promo failed:", promoErr);
        break;
      }
    }
    if (promoCode) {
      await admin.from("wheel_spins").update({ promo_code: promoCode }).eq("id", spinRow.id);
    }
  }

  return NextResponse.json({
    alreadySpun: false,
    result_type: def.result_type,
    result_label: def.result_label,
    promo_code: promoCode,
  });
}
