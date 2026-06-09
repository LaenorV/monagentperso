"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { X, Gift, Sparkles, Copy, Check, PartyPopper } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { WHEEL_EVENT, PENDING_WHEEL_KEY, WHEEL_SEEN_KEY } from "./openWheel";

type ResultType = "none" | "perso_30" | "marketplace_free" | "perso_free";
type SpinResult = { result_type: ResultType; result_label: string; promo_code: string | null };

const SEGMENTS: { type: ResultType; short: string; color: string; ink?: boolean }[] = [
  { type: "none", short: "Dommage", color: "#E7DCC8" },
  { type: "perso_30", short: "-30%", color: "#B99666" },
  { type: "none", short: "Dommage", color: "#D9C3A1" },
  { type: "marketplace_free", short: "Offert", color: "#4F7340", ink: true },
  { type: "none", short: "Dommage", color: "#E7DCC8" },
  { type: "perso_30", short: "-30%", color: "#B99666" },
  { type: "none", short: "Dommage", color: "#D9C3A1" },
  { type: "marketplace_free", short: "Offert", color: "#4F7340", ink: true },
  { type: "none", short: "Dommage", color: "#E7DCC8" },
  { type: "perso_free", short: "Agent offert", color: "#1A1612", ink: true },
];

const CONIC = `conic-gradient(from -18deg, ${SEGMENTS.map(
  (s, i) => `${s.color} ${i * 36}deg ${(i + 1) * 36}deg`,
).join(", ")})`;

export default function WheelModal() {
  const { user } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<"intro" | "spinning" | "result">("intro");
  const [result, setResult] = useState<SpinResult | null>(null);
  const [rotation, setRotation] = useState(0);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const spinTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openModal = useCallback(async () => {
    setOpen(true);
    setCopied(false);
    // Utilisateur connecté : a-t-il déjà tourné ?
    if (user) {
      try {
        const res = await fetch("/api/wheel/spin", { method: "GET" });
        const data = await res.json();
        if (data.spun && data.result) {
          setResult(data.result);
          setPhase("result");
          return;
        }
      } catch {
        /* on tombe sur l'intro */
      }
    }
    setPhase("intro");
    setResult(null);
  }, [user]);

  // Ouverture via événement global (nav / landing).
  useEffect(() => {
    const handler = () => openModal();
    window.addEventListener(WHEEL_EVENT, handler);
    return () => window.removeEventListener(WHEEL_EVENT, handler);
  }, [openModal]);

  // Réouverture automatique après connexion (intention conservée).
  useEffect(() => {
    if (!user) return;
    try {
      if (localStorage.getItem(PENDING_WHEEL_KEY) === "1") {
        localStorage.removeItem(PENDING_WHEEL_KEY);
        openModal();
      }
    } catch {
      /* ignore */
    }
  }, [user, openModal]);

  // Verrou scroll + nettoyage timer.
  useEffect(() => {
    if (open) document.body.classList.add("modal-open");
    else document.body.classList.remove("modal-open");
    return () => document.body.classList.remove("modal-open");
  }, [open]);

  function close() {
    setOpen(false);
    if (spinTimer.current) clearTimeout(spinTimer.current);
    try {
      localStorage.setItem(WHEEL_SEEN_KEY, "1");
    } catch {
      /* ignore */
    }
  }

  async function spin() {
    if (!user) {
      try {
        localStorage.setItem(PENDING_WHEEL_KEY, "1");
      } catch {
        /* ignore */
      }
      close();
      router.push("/signup?redirect=/");
      return;
    }
    if (busy) return;
    setBusy(true);
    try {
      const res = await fetch("/api/wheel/spin", { method: "POST" });
      const data = await res.json();
      if (res.status === 401) {
        router.push("/signup?redirect=/");
        return;
      }
      const r: SpinResult = {
        result_type: data.result_type,
        result_label: data.result_label,
        promo_code: data.promo_code ?? null,
      };

      // Déjà tourné → on révèle directement.
      if (data.alreadySpun) {
        setResult(r);
        setPhase("result");
        setBusy(false);
        return;
      }

      // Animation vers le segment correspondant au résultat serveur.
      const candidates = SEGMENTS.map((s, i) => i).filter((i) => SEGMENTS[i].type === r.result_type);
      const target = candidates[Math.floor(Math.random() * candidates.length)] ?? 0;
      const jitter = Math.floor(Math.random() * 26) - 13;
      const desired = -target * 36 + jitter;
      const delta = ((desired - rotation) % 360 + 360) % 360;
      const newRotation = rotation + delta + 360 * 5;
      setRotation(newRotation);
      setPhase("spinning");
      spinTimer.current = setTimeout(() => {
        setResult(r);
        setPhase("result");
        setBusy(false);
      }, 4400);
    } catch {
      setBusy(false);
    }
  }

  function copyCode() {
    if (!result?.promo_code) return;
    navigator.clipboard?.writeText(result.promo_code).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
      () => {},
    );
  }

  if (!open) return null;

  const won = result && result.result_type !== "none";

  return (
    <div className="wheel-modal" role="dialog" aria-modal="true" aria-label="Roue promotionnelle">
      <div className="wheel-backdrop" onClick={close} />
      <div className="wheel-card">
        <button type="button" className="wheel-close" onClick={close} aria-label="Fermer">
          <X size={20} />
        </button>

        {/* La roue (toujours visible) */}
        <div className="wheel-stage">
          <div className="wheel-pointer" />
          <div
            className="wheel"
            style={{
              background: CONIC,
              transform: `rotate(${rotation}deg)`,
              transition: phase === "spinning" ? "transform 4.3s cubic-bezier(.16,.7,.27,1)" : "none",
            }}
          >
            {SEGMENTS.map((s, i) => (
              <span key={i} className="wheel-label" style={{ transform: `rotate(${i * 36}deg)` }}>
                <span className="wheel-label-txt" style={{ color: s.ink ? "#fff" : "#3a2f20" }}>
                  {s.short}
                </span>
              </span>
            ))}
          </div>
          <div className="wheel-hub">
            <Gift size={22} strokeWidth={2} />
          </div>
        </div>

        {/* INTRO */}
        {phase === "intro" && (
          <div className="wheel-panel">
            <h2 className="wheel-title">Tentez votre chance 🎁</h2>
            <p className="wheel-sub">
              Tournez la roue et débloquez peut-être une réduction… ou un agent offert.
            </p>
            <div className="wheel-actions">
              <button type="button" className="btn btn-primary btn-xl" onClick={spin} disabled={busy}>
                <Sparkles size={18} strokeWidth={2.2} /> Tourner la roue
              </button>
              <button type="button" className="btn btn-light" onClick={close}>
                Plus tard
              </button>
            </div>
            <p className="wheel-note">Un seul tirage par compte.</p>
          </div>
        )}

        {/* SPINNING */}
        {phase === "spinning" && (
          <div className="wheel-panel">
            <p className="wheel-sub">La roue tourne…</p>
          </div>
        )}

        {/* RESULT */}
        {phase === "result" && result && (
          <div className="wheel-panel">
            {won ? (
              <>
                <div className="wheel-win-ico"><PartyPopper size={30} strokeWidth={1.9} /></div>
                <h2 className="wheel-title">
                  {result.result_type === "perso_free"
                    ? "Incroyable !"
                    : result.result_type === "perso_30"
                    ? "Bravo !"
                    : "Bravo !"}
                </h2>
                <p className="wheel-result-label">
                  {result.result_type === "perso_30" && "Vous avez gagné -30 % sur votre agent personnalisé."}
                  {result.result_type === "marketplace_free" && "Vous avez gagné 1 achat marketplace offert."}
                  {result.result_type === "perso_free" && "Votre agent personnalisé est offert."}
                </p>
                {result.promo_code && (
                  <button type="button" className="wheel-code" onClick={copyCode} title="Copier le code">
                    <span>{result.promo_code}</span>
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                )}
                <p className="wheel-note">
                  {result.result_type === "marketplace_free"
                    ? "À saisir dans la marketplace, au moment de débloquer un agent."
                    : "À saisir après le questionnaire, avant le paiement. Retrouvez-le aussi dans « Mes avantages »."}
                </p>
                <div className="wheel-actions">
                  {result.result_type === "marketplace_free" ? (
                    <a href="/agents-gpt" className="btn btn-primary btn-xl" onClick={close}>
                      Aller à la marketplace →
                    </a>
                  ) : (
                    <a href="/" className="btn btn-primary btn-xl" onClick={close}>
                      Réclamer mon agent →
                    </a>
                  )}
                  <button type="button" className="btn btn-light" onClick={close}>
                    Fermer
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="wheel-title">Dommage, pas de gain cette fois.</h2>
                <p className="wheel-sub">
                  Vous pouvez quand même découvrir nos agents prêts à l'emploi dans la marketplace.
                </p>
                <div className="wheel-actions">
                  <a href="/agents-gpt" className="btn btn-primary btn-xl" onClick={close}>
                    Voir la marketplace →
                  </a>
                  <button type="button" className="btn btn-light" onClick={close}>
                    Fermer
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
