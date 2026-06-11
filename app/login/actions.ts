"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getDict } from "@/lib/i18n/server";

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
  const t = await getDict();

  if (!email || !password) {
    return { error: t.auth.actionEmailPwRequired };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: t.auth.actionInvalidCredentials };
  }

  redirect(resolveDestination(formData));
}
