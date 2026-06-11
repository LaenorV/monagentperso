"use client";

import { useActionState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import { useLocale } from "@/lib/i18n/context";
import { signupAction, type SignupState } from "./actions";

const initialState: SignupState = {};

function SignupForm() {
  const { t } = useLocale();
  const params = useSearchParams();
  const next = params.get("next") ?? "";
  const redirect = params.get("redirect") ?? "";
  const loginHref = next
    ? `/login?next=${encodeURIComponent(next)}`
    : redirect
    ? `/login?redirectedFrom=${encodeURIComponent(redirect)}`
    : "/login";
  const [state, formAction, pending] = useActionState(signupAction, initialState);

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>{t.auth.signupTitle}</h1>
        <p className="auth-sub">
          {next === "questionnaire"
            ? t.auth.signupSubQuestionnaire
            : redirect
            ? t.auth.signupSubResource
            : t.auth.signupSub}
        </p>

        {state.accountCreated ? (
          <>
            <div className="auth-success">{t.auth.accountCreated}</div>
            <Link
              href={loginHref}
              className="btn btn-primary"
              style={{ width: "100%", marginTop: 14, justifyContent: "center" }}
            >
              {t.auth.goLogin}
            </Link>
          </>
        ) : (
          <>
            <GoogleSignInButton next={next} mode="signup" />
            <div className="auth-divider"><span>{t.auth.orByEmail}</span></div>
            <form action={formAction} className="auth-form">
            <input type="hidden" name="next" value={next} />
            <input type="hidden" name="redirect" value={redirect} />
            <div>
              <label htmlFor="email">{t.auth.email}</label>
              <input id="email" name="email" type="email" required autoComplete="email" placeholder={t.auth.emailPh} />
            </div>
            <div>
              <label htmlFor="password">{t.auth.passwordMin}</label>
              <input id="password" name="password" type="password" required autoComplete="new-password" minLength={8} />
            </div>
            <div>
              <label htmlFor="passwordConfirm">{t.auth.passwordConfirm}</label>
              <input id="passwordConfirm" name="passwordConfirm" type="password" required autoComplete="new-password" minLength={8} />
            </div>
            <div>
              <label htmlFor="instagram">{t.auth.instagram} <span style={{ color: "var(--muted-2)", fontWeight: 400 }}>{t.common.optional}</span></label>
              <input id="instagram" name="instagram" type="text" autoComplete="off" placeholder={t.auth.instagramPh} />
            </div>

            {state.error && <div className="auth-error">{state.error}</div>}

            <button type="submit" className="btn btn-primary" disabled={pending}>
              {pending
                ? t.auth.signupPending
                : next === "questionnaire"
                ? t.auth.signupBtnQuestionnaire
                : t.auth.signupBtn}
            </button>
            </form>
          </>
        )}

        <div className="auth-footer">
          {t.auth.alreadyMember} <Link href={loginHref}>{t.auth.loginLink}</Link>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="auth-page"><div className="auth-card">…</div></div>}>
      <SignupForm />
    </Suspense>
  );
}
