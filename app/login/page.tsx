"use client";

import { useActionState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import { useLocale } from "@/lib/i18n/context";
import { loginAction, type LoginState } from "./actions";

const initialState: LoginState = {};

function LoginForm() {
  const { t } = useLocale();
  const params = useSearchParams();
  const next = params.get("next") ?? "";
  const redirectedFrom = params.get("redirectedFrom") ?? "";
  const urlError = params.get("error");
  const signupHref = next ? `/signup?next=${encodeURIComponent(next)}` : "/signup";
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  const isQuestionnaireFlow = next === "questionnaire";

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>{isQuestionnaireFlow ? t.auth.loginTitleQuestionnaire : t.auth.loginTitle}</h1>
        <p className="auth-sub">
          {isQuestionnaireFlow ? t.auth.loginSubQuestionnaire : t.auth.loginSub}
        </p>

        {urlError && (
          <div className="auth-error" style={{ marginBottom: 16 }}>
            {urlError === "google" ? t.auth.errGoogle : t.auth.errSession}
          </div>
        )}

        <GoogleSignInButton next={next} mode="signin" />
        <div className="auth-divider"><span>{t.auth.orByEmail}</span></div>

        <form action={formAction} className="auth-form">
          <input type="hidden" name="next" value={next} />
          <input type="hidden" name="redirectedFrom" value={redirectedFrom} />
          <div>
            <label htmlFor="email">{t.auth.email}</label>
            <input id="email" name="email" type="email" required autoComplete="email" placeholder={t.auth.emailPh} />
          </div>
          <div>
            <label htmlFor="password">{t.auth.password}</label>
            <input id="password" name="password" type="password" required autoComplete="current-password" />
          </div>

          {state.error && <div className="auth-error">{state.error}</div>}

          <button type="submit" className="btn btn-primary" disabled={pending}>
            {pending ? t.auth.loginPending : t.auth.loginBtn}
          </button>
        </form>

        <div className="auth-footer">
          {t.auth.noAccount} <Link href={signupHref}>{t.auth.createAccount}</Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="auth-page"><div className="auth-card">…</div></div>}>
      <LoginForm />
    </Suspense>
  );
}
