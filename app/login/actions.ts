"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type LoginState = {
  error?: string;
};

function resolveDestination(formData: FormData): string {
  const next = String(formData.get("next") ?? "");
  if (next === "questionnaire") return "/dashboard?openQuestionnaire=1";

  const redirectedFrom = String(formData.get("redirectedFrom") ?? "");
  if (redirectedFrom && redirectedFrom.startsWith("/")) return redirectedFrom;

  return "/dashboard";
}

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email et mot de passe requis." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Identifiants invalides. Vérifiez votre email et mot de passe." };
  }

  redirect(resolveDestination(formData));
}
