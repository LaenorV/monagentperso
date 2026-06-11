"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getDict } from "@/lib/i18n/server";

export type SignupState = {
  error?: string;
  pending?: boolean;
  accountCreated?: boolean;
};

function nextToPath(next: string): string {
  if (next === "questionnaire") return "/dashboard?openQuestionnaire=1&welcome=1";
  return "/dashboard?welcome=1";
}

export async function signupAction(
  _prev: SignupState,
  formData: FormData,
): Promise<SignupState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const passwordConfirm = String(formData.get("passwordConfirm") ?? "");
  const next = String(formData.get("next") ?? "");
  // Reprise d'un parcours (ex. achat agent) : on revient sur la page d'origine.
  const redirectTo = String(formData.get("redirect") ?? "");
  // Identifiant Instagram (optionnel) : on retire le @ et on ne garde que les
  // caractères valides d'un handle (lettres, chiffres, point, underscore).
  const instagram = String(formData.get("instagram") ?? "")
    .trim()
    .replace(/^@+/, "")
    .replace(/[^A-Za-z0-9._]/g, "")
    .slice(0, 30);

  const t = await getDict();
  if (!email || !password) {
    return { error: t.auth.actionEmailPwRequired };
  }
  if (password.length < 8) {
    return { error: t.auth.actionPwTooShort };
  }
  if (password !== passwordConfirm) {
    return { error: t.auth.actionPwMismatch };
  }

  const supabase = await createClient();
  const headersList = await headers();
  const origin =
    headersList.get("origin") ?? `http://${headersList.get("host") ?? "localhost:3000"}`;
  // Une destination interne (commençant par "/") prime sur le mapping par défaut.
  const destination = redirectTo.startsWith("/") ? redirectTo : nextToPath(next);

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // emailRedirectTo conservé pour les cas où Confirm email serait réactivé.
      // Aucun impact quand la confirmation est désactivée.
      emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(destination)}`,
      // Stocke l'Instagram en métadonnée auth (toujours, même sans table profiles).
      data: instagram ? { instagram } : undefined,
    },
  });

  if (error) {
    return { error: error.message };
  }

  // Enregistre/recense le profil (colonne instagram). Non bloquant.
  if (data.user) {
    try {
      const admin = createAdminClient();
      await admin
        .from("profiles")
        .upsert({ id: data.user.id, email, instagram: instagram || null }, { onConflict: "id" });
    } catch (e) {
      console.error("[signup] upsert profile (non bloquant):", e);
    }
  }

  // Cas standard (Confirm email désactivé) : session immédiate → /dashboard.
  if (data.session) {
    redirect(destination);
  }

  // Cas rare : compte créé sans session retournée → invitation à se connecter.
  return { accountCreated: true };
}
