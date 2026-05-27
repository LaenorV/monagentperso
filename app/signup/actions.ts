"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type SignupState = {
  error?: string;
  pending?: boolean;
  needsConfirmation?: boolean;
};

function nextToPath(next: string): string {
  if (next === "questionnaire") return "/dashboard?openQuestionnaire=1";
  return "/dashboard";
}

export async function signupAction(
  _prev: SignupState,
  formData: FormData,
): Promise<SignupState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const passwordConfirm = String(formData.get("passwordConfirm") ?? "");
  const next = String(formData.get("next") ?? "");

  if (!email || !password) {
    return { error: "Email et mot de passe requis." };
  }
  if (password.length < 8) {
    return { error: "Le mot de passe doit contenir au moins 8 caractères." };
  }
  if (password !== passwordConfirm) {
    return { error: "Les deux mots de passe ne correspondent pas." };
  }

  const supabase = await createClient();
  const headersList = await headers();
  const origin =
    headersList.get("origin") ?? `http://${headersList.get("host") ?? "localhost:3000"}`;
  const destination = nextToPath(next);

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(destination)}`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  // Cas heureux : confirmation email désactivée dans Supabase → session immédiate.
  if (data.session) {
    redirect(destination);
  }

  // Fallback : Supabase exige toujours une confirmation email.
  // Pour le supprimer : Supabase Dashboard → Authentication → Providers → Email → "Confirm email" OFF.
  return { needsConfirmation: true };
}
