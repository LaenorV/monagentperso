import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "./LogoutButton";
import AutoOpenQuestionnaire from "./AutoOpenQuestionnaire";
import WelcomeBanner from "./WelcomeBanner";
import MyAgentCard, { type AgentDelivery } from "./MyAgentCard";
import MyRequestCard from "./MyRequestCard";
import Library, { type LibraryItem, type LibraryItemKind } from "./Library";
import { getAgent } from "@/lib/ready-made-agents";
import ResumePurchaseBanner from "@/components/ResumePurchaseBanner";

export const dynamic = "force-dynamic";

type PaidResponse = {
  id: string;
  created_at: string;
  questionnaire: Record<string, unknown>;
};

type DeliveryWithLink = AgentDelivery & {
  paid_questionnaire_response_id: string | null;
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirectedFrom=/dashboard");

  // ============================================================
  // DEBUG temporaire — à retirer une fois validé.
  // Logs visibles dans le TERMINAL où tourne `npm run dev`, PAS dans la console navigateur.
  // ============================================================
  console.log("[dashboard] user.id =", user.id);

  // 1. Toutes les réponses payées de cet utilisateur.
  //    `.eq("user_id", user.id)` = filtre explicite en plus de la RLS (défense en profondeur).
  const { data: paidResponses, error: paidErr } = await supabase
    .from("paid_questionnaire_responses")
    .select("id, created_at, questionnaire")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  console.log(
    "[dashboard] paid_questionnaire_responses trouvées:",
    paidResponses?.length ?? 0,
  );
  if (paidErr) {
    console.error("[dashboard] ERREUR Supabase paid_responses:", paidErr);
  }

  // 2. Toutes les livraisons de cet utilisateur.
  const { data: deliveries, error: delErr } = await supabase
    .from("agent_deliveries")
    .select(
      "id, status, agent_name, agent_url, agent_instructions, admin_note, delivered_at, created_at, paid_questionnaire_response_id",
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  console.log("[dashboard] agent_deliveries trouvées:", deliveries?.length ?? 0);
  if (delErr) {
    console.error("[dashboard] ERREUR Supabase deliveries:", delErr);
  }
  // ============================================================

  // Agents prêts à l'emploi achetés (RLS : l'utilisateur ne voit que les siens).
  const { data: agentPurchases } = await supabase
    .from("ready_made_agent_purchases")
    .select("agent_slug, agent_name, agent_type, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const paidResponse: PaidResponse | null =
    paidResponses && paidResponses.length > 0 ? (paidResponses[0] as PaidResponse) : null;

  // Cherche la livraison liée à la dernière réponse payée ; sinon la plus récente.
  let delivery: AgentDelivery | null = null;
  if (deliveries && deliveries.length > 0) {
    const typed = deliveries as DeliveryWithLink[];
    if (paidResponse) {
      delivery =
        typed.find((d) => d.paid_questionnaire_response_id === paidResponse.id) ??
        typed[0];
    } else {
      delivery = typed[0];
    }
  }

  // ── Construction de "Ma bibliothèque" (agrégation de tous les achats) ──────
  const libraryItems: LibraryItem[] = [];

  // Agent personnalisé (49,90 €) — présent dès qu'une commande payée existe.
  if (paidResponse) {
    const customStatus =
      !delivery || delivery.status === "in_progress"
        ? "en_cours"
        : delivery.status === "revision_needed"
        ? "revision"
        : "livre";
    const customHref =
      customStatus === "livre" && delivery?.agent_url ? delivery.agent_url : null;
    libraryItems.push({
      key: "custom-agent",
      name: delivery?.agent_name || "Mon agent personnalisé",
      kind: "custom",
      category: "Agent personnalisé · 49,90 €",
      date: paidResponse.created_at,
      status: customStatus,
      href: customHref,
      external: !!customHref,
      locked: customStatus !== "livre",
    });
  }

  // Agents prêts à l'emploi (4,90 €).
  for (const p of agentPurchases ?? []) {
    libraryItems.push({
      key: `rm-${p.agent_slug}`,
      name: p.agent_name,
      kind: (p.agent_type as LibraryItemKind) || "both",
      category: getAgent(p.agent_slug)?.category ?? "Agent prêt à l'emploi",
      date: p.created_at,
      status: null,
      href: `/dashboard/agents/${p.agent_slug}`,
      external: false,
      locked: false,
    });
  }

  const createdAt = user.created_at
    ? new Date(user.created_at).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

  return (
    <div className="container dashboard">
      <AutoOpenQuestionnaire />
      <WelcomeBanner />
      <ResumePurchaseBanner />
      <div className="dashboard-head">
        <div>
          <span className="section-eyebrow">Espace client</span>
          <h1>Bienvenue, {user.email?.split("@")[0]}.</h1>
        </div>
        <LogoutButton />
      </div>

      <MyAgentCard hasPaidOrder={!!paidResponse} delivery={delivery} />

      <Library items={libraryItems} />

      {paidResponse && (
        <MyRequestCard
          paidAt={paidResponse.created_at}
          questionnaire={paidResponse.questionnaire as Record<string, never>}
        />
      )}

      <div className="dashboard-card">
        <h2>Vos informations</h2>
        <dl className="dashboard-meta">
          <dt>Email</dt>
          <dd>{user.email}</dd>
          <dt>Compte créé le</dt>
          <dd>{createdAt}</dd>
          <dt>Statut</dt>
          <dd>{user.email_confirmed_at ? "Vérifié" : "En attente de vérification"}</dd>
        </dl>
      </div>
    </div>
  );
}
