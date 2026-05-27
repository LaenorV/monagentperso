import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths sauf :
     * - _next/static (assets statiques)
     * - _next/image (optim images)
     * - favicon.ico
     * - fichiers d'image dans /public
     * - api/stripe/webhook (raw body Stripe — pas de cookies utilisateur, on saute)
     */
    "/((?!_next/static|_next/image|favicon.ico|api/stripe/webhook|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
