"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Connexion / inscription via Google OAuth.
 * `prompt: "select_account"` force l'affichage du sélecteur de comptes Google
 * de l'appareil au lieu de réutiliser silencieusement la dernière session.
 */
export async function signInWithGoogle(formData: FormData) {
  const next = String(formData.get("next") ?? "");
  const destination =
    next === "questionnaire" ? "/dashboard?openQuestionnaire=1" : "/dashboard";

  const supabase = await createClient();
  const headersList = await headers();
  // URL de base FIABLE : on privilégie NEXT_PUBLIC_SITE_URL (https + bon domaine,
  // identique à celui whitelisté dans Supabase/Google). Sinon repli sur les headers.
  const headerOrigin =
    headersList.get("origin") ??
    (headersList.get("host") ? `https://${headersList.get("host")}` : "http://localhost:3000");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || headerOrigin;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${siteUrl}/auth/callback?next=${encodeURIComponent(destination)}`,
      queryParams: { prompt: "select_account" },
    },
  });

  if (error || !data?.url) {
    console.error("[signInWithGoogle] OAuth init error:", error?.message);
    redirect("/login?error=google");
  }

  // Redirige vers la page de consentement Google.
  redirect(data.url);
}
