"use client";

import { useActionState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import { signupAction, type SignupState } from "./actions";

const initialState: SignupState = {};

function SignupForm() {
  const params = useSearchParams();
  const next = params.get("next") ?? "";
  const loginHref = next ? `/login?next=${encodeURIComponent(next)}` : "/login";
  const [state, formAction, pending] = useActionState(signupAction, initialState);

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Créer votre compte</h1>
        <p className="auth-sub">
          {next === "questionnaire"
            ? "Quelques secondes pour créer votre compte — le questionnaire s'ouvre juste après."
            : "Quelques secondes pour accéder à votre espace et suivre la création de votre agent."}
        </p>

        {state.accountCreated ? (
          <>
            <div className="auth-success">
              ✓ Compte créé. Vous pouvez maintenant vous connecter.
            </div>
            <Link
              href={loginHref}
              className="btn btn-primary"
              style={{ width: "100%", marginTop: 14, justifyContent: "center" }}
            >
              Se connecter →
            </Link>
          </>
        ) : (
          <>
            <GoogleSignInButton next={next} label="S'inscrire avec Google" />
            <div className="auth-divider"><span>ou par email</span></div>
            <form action={formAction} className="auth-form">
            <input type="hidden" name="next" value={next} />
            <div>
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" required autoComplete="email" placeholder="vous@exemple.fr" />
            </div>
            <div>
              <label htmlFor="password">Mot de passe (8 caractères min.)</label>
              <input id="password" name="password" type="password" required autoComplete="new-password" minLength={8} />
            </div>
            <div>
              <label htmlFor="passwordConfirm">Confirmation du mot de passe</label>
              <input id="passwordConfirm" name="passwordConfirm" type="password" required autoComplete="new-password" minLength={8} />
            </div>

            {state.error && <div className="auth-error">{state.error}</div>}

            <button type="submit" className="btn btn-primary" disabled={pending}>
              {pending
                ? "Création en cours…"
                : next === "questionnaire"
                ? "Créer mon compte et lancer le questionnaire →"
                : "Créer mon compte →"}
            </button>
            </form>
          </>
        )}

        <div className="auth-footer">
          Déjà inscrit ? <Link href={loginHref}>Se connecter</Link>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="auth-page"><div className="auth-card">Chargement…</div></div>}>
      <SignupForm />
    </Suspense>
  );
}
