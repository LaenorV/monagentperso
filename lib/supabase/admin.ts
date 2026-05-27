import { createClient } from "@supabase/supabase-js";

/**
 * Client Supabase avec service_role.
 * - À utiliser UNIQUEMENT dans des route handlers / server actions / scripts serveur.
 * - Bypasse RLS — ne JAMAIS exposer côté client.
 * - Pas de session utilisateur, pas de cookies.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_URL est manquante");
  if (!serviceKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY est manquante");

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
