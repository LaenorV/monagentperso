import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAgent } from "@/lib/ready-made-agents";
import { getAgentKnowledgePdf } from "@/lib/agent-content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Télécharge le PDF de connaissance d'un agent — UNIQUEMENT si l'utilisateur
// connecté l'a acheté. Vérification côté serveur (jamais juste masqué au client).
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const agent = getAgent(slug);
  if (!agent) return NextResponse.json({ error: "unknown_agent" }, { status: 404 });

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  // Achat vérifié via RLS (l'utilisateur ne voit que ses propres achats).
  const { data: purchase } = await supabase
    .from("ready_made_agent_purchases")
    .select("id")
    .eq("user_id", user.id)
    .eq("agent_slug", slug)
    .maybeSingle();

  if (!purchase) return NextResponse.json({ error: "not_purchased" }, { status: 403 });

  const pdf = await getAgentKnowledgePdf(slug);
  if (!pdf) return NextResponse.json({ error: "file_not_found" }, { status: 404 });

  return new NextResponse(new Uint8Array(pdf), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${slug}-knowledge.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}
