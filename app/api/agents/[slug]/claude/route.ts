import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAgent } from "@/lib/ready-made-agents";
import { getAgentInstructions } from "@/lib/agent-content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Télécharge le fichier claude.md d'un agent — UNIQUEMENT si l'utilisateur
// connecté a acheté la version Claude (ou "both"). Vérification côté serveur.
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

  const { data: purchases } = await supabase
    .from("ready_made_agent_purchases")
    .select("agent_type")
    .eq("user_id", user.id)
    .eq("agent_slug", slug);

  const ownsClaude = (purchases ?? []).some(
    (p) => p.agent_type === "claude" || p.agent_type === "both",
  );
  if (!ownsClaude) return NextResponse.json({ error: "not_purchased" }, { status: 403 });

  const { claude } = await getAgentInstructions(slug);
  if (!claude) return NextResponse.json({ error: "file_not_found" }, { status: 404 });

  return new NextResponse(claude, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="${slug}-claude.md"`,
      "Cache-Control": "private, no-store",
    },
  });
}
