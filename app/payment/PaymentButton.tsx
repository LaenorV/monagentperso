"use client";

import { useState } from "react";

type Props = {
  pendingId: string;
};

export default function PaymentButton({ pendingId }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  async function handleClick() {
    // ⚠ Logs temporaires de diagnostic — à retirer une fois le flow validé.
    console.log("HANDLE CHECKOUT START");

    setError("");
    setLoading(true);

    let res: Response;
    try {
      res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pendingId }),
      });
      console.log("[paiement] HTTP", res.status);
    } catch (err) {
      console.error("[paiement] erreur réseau:", err);
      setError("Erreur réseau — vérifiez votre connexion et réessayez.");
      setLoading(false);
      return;
    }

    if (res.status === 401) {
      console.error("[paiement] utilisateur non connecté → redirection /login");
      window.location.href = "/login?next=payment";
      return;
    }

    let data: { url?: string; error?: string; message?: string } = {};
    try {
      data = await res.json();
    } catch (err) {
      console.error("[paiement] réponse non-JSON:", err);
      setError(`Réponse serveur invalide (HTTP ${res.status}).`);
      setLoading(false);
      return;
    }
    console.log("[paiement] payload reçu:", data);

    if (!res.ok) {
      console.error(`[paiement] /api/checkout a renvoyé HTTP ${res.status}:`, data);
      setError(`${data.message || data.error || "Erreur serveur."} (HTTP ${res.status})`);
      setLoading(false);
      return;
    }

    if (!data.url) {
      console.error("[paiement] data.url absent dans la réponse:", data);
      setError("Stripe n'a pas retourné d'URL de paiement.");
      setLoading(false);
      return;
    }

    console.log("[paiement] redirection vers Stripe Checkout:", data.url);
    window.location.href = data.url;
  }

  return (
    <>
      <button
        type="button"
        data-debug-id="payment-button-v3"
        className="btn btn-dark"
        style={{
          width: "100%",
          marginTop: 10,
          // Marqueur visuel temporaire pour confirmer que le nouveau bundle est servi.
          // Si le bouton n'a PAS cette bordure orange, c'est un cache à vider.
          outline: "3px solid #C97A2E",
          outlineOffset: "2px",
        }}
        onClick={() => {
          console.log("CLICK PAIEMENT DETECTE - BOUTON EXACT");
          handleClick();
        }}
        disabled={loading}
      >
        {loading ? "Redirection vers le paiement…" : "Payer 49,90€"}
      </button>
      <p
        style={{
          fontSize: 11,
          color: "var(--muted)",
          textAlign: "center",
          marginTop: 6,
          fontFamily: "monospace",
        }}
      >
        debug-id: payment-button-v3 · pending: {pendingId.slice(0, 8)}…
      </p>
      {error && (
        <div
          className="auth-error"
          style={{ marginTop: 14, fontSize: 14, textAlign: "left" }}
          role="alert"
        >
          ⚠ {error}
        </div>
      )}
    </>
  );
}
