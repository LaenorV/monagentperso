import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PaymentButton from "./PaymentButton";

export const dynamic = "force-dynamic";

export default async function PaymentPage() {
  // 1. Auth obligatoire pour atteindre cette page
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=payment");

  // 2. On essaye de récupérer le dernier pending_questionnaire en attente de paiement
  const { data: pending } = await supabase
    .from("pending_questionnaires")
    .select("id, status, created_at")
    .eq("user_id", user.id)
    .eq("status", "pending_payment")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return (
    <div className="container payment-page">
      <div className="payment-box">
        <span className="section-eyebrow">Paiement sécurisé</span>
        <h1>Finalisez votre commande</h1>
        <p style={{ fontSize: 18, color: "var(--muted)", lineHeight: 1.6, marginTop: 12 }}>
          Votre agent sera livré sous 24h maximum, envoyé par email et accessible directement dans votre espace utilisateur.
        </p>
        <div className="old-price" style={{ textAlign: "center" }}>79,90€</div>
        <p className="price" style={{ color: "var(--ink)", fontSize: 70 }}>49,90€</p>

        {pending ? (
          <PaymentButton pendingId={pending.id} />
        ) : (
          <>
            <div
              className="auth-error"
              style={{ marginTop: 14, textAlign: "left" }}
              role="alert"
            >
              ⚠ Aucun questionnaire en attente. Remplissez-le d'abord pour pouvoir payer.
            </div>
            <Link
              className="btn btn-primary"
              style={{ width: "100%", marginTop: 12 }}
              href="/dashboard?openQuestionnaire=1"
            >
              Remplir le questionnaire →
            </Link>
          </>
        )}

        <Link
          className="btn btn-light"
          style={{ width: "100%", marginTop: 12 }}
          href="/"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
