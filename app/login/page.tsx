"use client";

import { useActionState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { loginAction, type LoginState } from "./actions";

const initialState: LoginState = {};

function LoginForm() {
  const params = useSearchParams();
  const next = params.get("next") ?? "";
  const redirectedFrom = params.get("redirectedFrom") ?? "";
  const signupHref = next ? `/signup?next=${encodeURIComponent(next)}` : "/signup";
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  const isQuestionnaireFlow = next === "questionnaire";

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>{isQuestionnaireFlow ? "Connectez-vous pour lancer votre questionnaire" : "Se connecter"}</h1>
        <p className="auth-sub">
          {isQuestionnaireFlow
            ? "Identifiez-vous pour réclamer votre agent IA personnalisé — le questionnaire s'ouvre dès la connexion."
            : "Accédez à votre espace pour retrouver votre agent et le suivi de votre commande."}
        </p>

        <form action={formAction} className="auth-form">
          <input type="hidden" name="next" value={next} />
          <input type="hidden" name="redirectedFrom" value={redirectedFrom} />
          <div>
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required autoComplete="email" placeholder="vous@exemple.fr" />
          </div>
          <div>
            <label htmlFor="password">Mot de passe</label>
            <input id="password" name="password" type="password" required autoComplete="current-password" />
          </div>

          {state.error && <div className="auth-error">{state.error}</div>}

          <button type="submit" className="btn btn-primary" disabled={pending}>
            {pending ? "Connexion…" : "Se connecter →"}
          </button>
        </form>

        <div className="auth-footer">
          Pas encore de compte ? <Link href={signupHref}>Créer un compte</Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="auth-page"><div className="auth-card">Chargement…</div></div>}>
      <LoginForm />
    </Suspense>
  );
}
