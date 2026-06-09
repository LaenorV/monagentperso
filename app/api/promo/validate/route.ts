import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { validatePromo, type PurchaseType } from "@/lib/promo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: { code?: unknown; purchase_type?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ valid: false, message: "Requête invalide." }, { status: 400 });
  }

  const code = typeof body.code === "string" ? body.code : "";
  const purchaseType: PurchaseType =
    body.purchase_type === "marketplace" ? "marketplace" : "personalized_agent";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ valid: false, message: "Connectez-vous." }, { status: 401 });

  const admin = createAdminClient();
  const res = await validatePromo(admin, { code, userId: user.id, purchaseType });

  if (!res.ok) {
    return NextResponse.json({ valid: false, message: res.message });
  }

  return NextResponse.json({
    valid: true,
    code: res.promo.code,
    discount_type: res.promo.discount_type,
    discount_value: res.promo.discount_value,
    applies_to: res.promo.applies_to,
    base_amount: res.baseAmount,
    final_amount: res.finalAmount,
    is_free: res.isFree,
  });
}
