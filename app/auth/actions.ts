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
  const origin =
    headersList.get("origin") ?? `http://${headersList.get("host") ?? "localhost:3000"}`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(destination)}`,
      queryParams: { prompt: "select_account" },
    },
  });

  if (error || !data?.url) {
    redirect("/login?error=google");
  }

  // Redirige vers la page de consentement Google.
  redirect(data.url);
}
