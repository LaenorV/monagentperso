"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/**
 * Connexion Google via Google Identity Services (GIS) + Supabase
 * `signInWithIdToken`. On n'utilise plus le flow OAuth redirect
 * (supabase.auth.signInWithOAuth) : l'écran Google n'affiche donc plus
 * l'URL technique *.supabase.co, mais bien notre origine (monagentperso.pro).
 *
 * Pré-requis :
 *  - NEXT_PUBLIC_GOOGLE_CLIENT_ID = le « Web client ID » OAuth de Google Cloud.
 *  - Ce même Client ID doit être listé dans Supabase → Auth → Google
 *    (provider activé, « Authorized Client IDs »).
 *  - https://www.monagentperso.pro (+ http://localhost:3000 en dev) doivent
 *    figurer dans « Authorized JavaScript origins » côté Google Cloud.
 */

const GIS_SRC = "https://accounts.google.com/gsi/client";
const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

type CredentialResponse = { credential?: string };

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: Record<string, unknown>) => void;
          renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void;
        };
      };
    };
  }
}

export default function GoogleSignInButton({
  next = "",
  label = "Continuer avec Google",
}: {
  next?: string;
  label?: string;
}) {
  const router = useRouter();
  const btnRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const destination =
    next === "questionnaire" ? "/dashboard?openQuestionnaire=1" : "/dashboard";

  // Texte localisé du bouton Google selon le contexte (connexion / inscription).
  const gisText = /inscr/i.test(label) ? "signup_with" : "signin_with";

  // Réception du credential (ID token JWT) renvoyé par Google.
  const handleCredential = useCallback(
    async (response: CredentialResponse) => {
      if (!response?.credential) {
        setError("La connexion Google a échoué. Réessayez ou utilisez votre email.");
        return;
      }
      setBusy(true);
      setError("");
      try {
        const supabase = createClient();
        const { data, error: signInError } = await supabase.auth.signInWithIdToken({
          provider: "google",
          token: response.credential,
        });
        if (signInError || !data?.session) {
          setBusy(false);
          setError("La connexion Google a échoué. Réessayez ou utilisez votre email.");
          return;
        }
        // Session Supabase OK → on quitte immédiatement la page d'auth pour
        // l'espace utilisateur (aucun message « session expirée » ne subsiste).
        router.push(destination);
        router.refresh();
      } catch {
        setBusy(false);
        setError("La connexion Google a échoué. Réessayez ou utilisez votre email.");
      }
    },
    [destination, router],
  );

  useEffect(() => {
    if (!CLIENT_ID) {
      setError("Connexion Google momentanément indisponible.");
      return;
    }
    let cancelled = false;

    function renderGoogleButton() {
      if (cancelled || !window.google || !btnRef.current) return;
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: handleCredential,
        ux_mode: "popup",
        auto_select: false,
        // Force le sélecteur de comptes plutôt qu'une reconnexion silencieuse.
        itp_support: true,
      });
      const width = Math.min(
        400,
        Math.max(240, btnRef.current.clientWidth || 320),
      );
      btnRef.current.innerHTML = "";
      window.google.accounts.id.renderButton(btnRef.current, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: gisText,
        shape: "rectangular",
        logo_alignment: "center",
        locale: "fr",
        width,
      });
    }

    const existing = document.getElementById("gis-client-script") as HTMLScriptElement | null;
    if (window.google) {
      renderGoogleButton();
    } else if (existing) {
      existing.addEventListener("load", renderGoogleButton);
    } else {
      const script = document.createElement("script");
      script.id = "gis-client-script";
      script.src = GIS_SRC;
      script.async = true;
      script.defer = true;
      script.onload = renderGoogleButton;
      script.onerror = () =>
        !cancelled && setError("Connexion Google momentanément indisponible.");
      document.head.appendChild(script);
    }

    return () => {
      cancelled = true;
      if (existing) existing.removeEventListener("load", renderGoogleButton);
    };
  }, [handleCredential, gisText]);

  return (
    <div className="google-signin">
      <div
        ref={btnRef}
        aria-busy={busy}
        style={{
          display: "flex",
          justifyContent: "center",
          minHeight: 44,
          opacity: busy ? 0.6 : 1,
          pointerEvents: busy ? "none" : "auto",
        }}
      />
      {busy && (
        <p className="auth-sub" style={{ textAlign: "center", margin: "10px 0 0" }}>
          Connexion…
        </p>
      )}
      {error && (
        <div className="auth-error" style={{ marginTop: 10 }}>
          {error}
        </div>
      )}
    </div>
  );
}
