import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "./LogoutButton";
import QuestionnaireCta from "@/components/QuestionnaireCta";
import AutoOpenQuestionnaire from "./AutoOpenQuestionnaire";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Garde-fou supplémentaire (le middleware redirige déjà, ceci est une ceinture+bretelles).
  if (!user) redirect("/login?redirectedFrom=/dashboard");

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
      <div className="dashboard-head">
        <div>
          <span className="section-eyebrow">Espace client</span>
          <h1>Bienvenue, {user.email?.split("@")[0]}.</h1>
        </div>
        <LogoutButton />
      </div>

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

      <div className="dashboard-card">
        <h2>Votre agent IA</h2>
        <p>
          Vous n'avez pas encore réclamé d'agent personnalisé. Lancez le questionnaire pour le recevoir
          sous 24h sur l'email associé à votre compte.
        </p>
        <div style={{ marginTop: 18 }}>
          <QuestionnaireCta className="btn btn-primary btn-xl">Lancer le questionnaire →</QuestionnaireCta>
        </div>
      </div>
    </div>
  );
}
