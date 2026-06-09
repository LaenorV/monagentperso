import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Source de vérité : Supabase. Indique si l'utilisateur connecté a déjà tourné.
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ authenticated: false, hasSpun: false, spin: null });

  const { data: spin } = await supabase
    .from("wheel_spins")
    .select("result_type, result_label, promo_code")
    .eq("user_id", user.id)
    .maybeSingle();

  return NextResponse.json({
    authenticated: true,
    hasSpun: !!spin,
    spin: spin ?? null,
  });
}
