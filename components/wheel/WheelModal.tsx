"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { X, Gift, Sparkles, Copy, Check, PartyPopper } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { useLocale } from "@/lib/i18n/context";
import { WHEEL_EVENT, PENDING_WHEEL_KEY, WHEEL_SEEN_KEY } from "./openWheel";

type ResultType =
  | "lose"
  | "personalized_discount_30"
  | "marketplace_free"
  | "personalized_free";
type SpinResult = { result_type: string; result_label: string; promo_code: string | null };

// Catégorie normalisée (tolère aussi les anciens types stockés en base).
function cat(t: string): "lose" | "p30" | "mfree" | "pfree" {
  if (t === "marketplace_free") return "mfree";
  if (t === "personalized_discount_30" || t === "perso_30") return "p30";
  if (t === "personalized_free" || t === "perso_free") return "pfree";
  return "lose"; // "lose" ou ancien "none"
}

// 10 parts : "Dommage" majoritaire (6/10) pour refléter une perte plus fréquente.
const SEGMENTS: { type: ResultType; short: string; color: string; ink?: boolean }[] = [
  { type: "lose", short: "Dommage", color: "#E7DCC8" },
  { type: "personalized_discount_30", short: "-30%", color: "#B99666" },
  { type: "lose", short: "Dommage", color: "#D9C3A1" },
  { type: "marketplace_free", short: "Offert", color: "#4F7340", ink: true },
  { type: "lose", short: "Dommage", color: "#E7DCC8" },
  { type: "personalized_discount_30", short: "-30%", color: "#B99666" },
  { type: "lose", short: "Dommage", color: "#D9C3A1" },
  { type: "lose", short: "Dommage", color: "#E7DCC8" },
  { type: "personalized_free", short: "Agent offert", color: "#1A1612", ink: true },
  { type: "lose", short: "Dommage", color: "#D9C3A1" },
];

const CONIC = `conic-gradient(from -18deg, ${SEGMENTS.map(
  (s, i) => `${s.color} ${i * 36}deg ${(i + 1) * 36}deg`,
).join(", ")})`;

export default function WheelModal() {
  const { user } = useAuth();
  const { t } = useLocale();
  const router = useRouter();

  // Libellé localisé d'un segment, dérivé de son type (la logique reste sur `type`).
  function segShort(type: ResultType): string {
    if (type === "personalized_discount_30") return t.wheel.seg30;
    if (type === "marketplace_free") return t.wheel.segOffered;
    if (type === "personalized_free") return t.wheel.segFreeAgent;
    return t.wheel.segLose;
  }
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<"loading" | "intro" | "spinning" | "result">("loading");
  const [result, setResult] = useState<SpinResult | null>(null);
  const [hasSpun, setHasSpun] = useState(false);
  // true quand on rouvre la roue alors que le tirage est déjà consommé
  // (affiche un avertissement rouge plutôt que de re-proposer un tour).
  const [reopened, setReopened] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const spinTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Source de vérité = Supabase (via /api/wheel/status). Le localStorage ne sert
  // jamais à autoriser un tirage.
  const openModal = useCallback(async () => {
    setOpen(true);
    setCopied(false);
    setErrorMsg("");
    setReopened(false);
    // On interroge TOUJOURS le serveur (Supabase via cookies) : c'est la seule
    // source fiable, et ça évite la course où le `user` client n'est pas encore
    // chargé à l'ouverture (sinon on re-proposait la roue à tort).
    setPhase("loading");
    try {
      const res = await fetch("/api/wheel/status", { method: "GET" });
      const data = await res.json();
      // Déjà tourné → on rouvre sur le résultat, avec avertissement rouge.
      if (data.hasSpun && data.spin) {
        setResult(data.spin);
        setHasSpun(true);
        setReopened(true);
        setPhase("result");
        return;
      }
      setHasSpun(false);
      setResult(null);
      setPhase("intro");
    } catch {
      // En cas d'échec réseau, on n'autorise pas un tirage hasardeux : on tente
      // l'intro mais le POST reste l'arbitre final (idempotent côté serveur).
      setHasSpun(false);
      setResult(null);
      setPhase("intro");
    }
  }, []);

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
    // Anti double-tirage : on bloque si déjà tourné ou requête en cours.
    if (busy || hasSpun) return;
    setBusy(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/wheel/spin", { method: "POST" });
      if (res.status === 401) {
        try {
          localStorage.setItem(PENDING_WHEEL_KEY, "1");
        } catch {
          /* ignore */
        }
        close();
        router.push("/signup?redirect=/");
        return;
      }
      const data = await res.json().catch(() => ({}));

      // Échec serveur → on NE révèle AUCUN résultat (pas de faux tirage).
      // On resynchronise le statut au cas où une ligne existe déjà.
      if (!res.ok) {
        setBusy(false);
        try {
          const s = await fetch("/api/wheel/status");
          const sd = await s.json();
          if (sd.hasSpun && sd.spin) {
            setResult(sd.spin);
            setHasSpun(true);
            setPhase("result");
            return;
          }
        } catch {
          /* ignore */
        }
        setErrorMsg(t.wheel.errUnavailable);
        return;
      }

      const r: SpinResult = {
        result_type: data.result_type,
        result_label: data.result_label,
        promo_code: data.promo_code ?? null,
      };
      // Dans tous les cas (nouveau tirage OU déjà tourné), l'utilisateur a consommé son tour.
      setHasSpun(true);

      // Déjà tourné (course / refresh) → on révèle le résultat existant, sans animation.
      if (data.alreadySpun) {
        setResult(r);
        setReopened(true);
        setPhase("result");
        setBusy(false);
        return;
      }

      // Nouveau tirage confirmé par le serveur → animation vers le bon segment.
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
      setErrorMsg(t.wheel.errNetwork);
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

  const won = result && cat(result.result_type) !== "lose";

  return (
    <div className="wheel-modal" role="dialog" aria-modal="true" aria-label={t.wheel.dialogLabel}>
      <div className="wheel-backdrop" onClick={close} />
      <div className="wheel-card">
        <button type="button" className="wheel-close" onClick={close} aria-label={t.wheel.closeLabel}>
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
                  {segShort(s.type)}
                </span>
              </span>
            ))}
          </div>
          <div className="wheel-hub">
            <Gift size={22} strokeWidth={2} />
          </div>
        </div>

        {/* LOADING — on attend la vérification serveur avant tout */}
        {phase === "loading" && (
          <div className="wheel-panel">
            <p className="wheel-sub">{t.wheel.loading}</p>
          </div>
        )}

        {/* INTRO */}
        {phase === "intro" && (
          <div className="wheel-panel">
            <h2 className="wheel-title">{t.wheel.introTitle}</h2>
            <p className="wheel-sub">{t.wheel.introSub}</p>
            {errorMsg && <p className="wheel-error">⚠ {errorMsg}</p>}
            <div className="wheel-actions">
              <button
                type="button"
                className="btn btn-primary btn-xl"
                onClick={spin}
                disabled={busy || hasSpun}
              >
                <Sparkles size={18} strokeWidth={2.2} />{" "}
                {busy ? t.wheel.spinning : hasSpun ? t.wheel.alreadyUsed : t.wheel.spinBtn}
              </button>
              <button type="button" className="btn btn-light" onClick={close}>
                {t.wheel.later}
              </button>
            </div>
            <p className="wheel-note">{t.wheel.oneSpinNote}</p>
          </div>
        )}

        {/* SPINNING */}
        {phase === "spinning" && (
          <div className="wheel-panel">
            <p className="wheel-sub">{t.wheel.wheelTurning}</p>
          </div>
        )}

        {/* RESULT */}
        {phase === "result" && result && (
          <div className="wheel-panel">
            {reopened && <p className="wheel-error">⚠ {t.wheel.reopenWarning}</p>}
            {won ? (
              <>
                <div className="wheel-win-ico"><PartyPopper size={30} strokeWidth={1.9} /></div>
                <h2 className="wheel-title">
                  {cat(result.result_type) === "pfree" ? t.wheel.winTitleBig : t.wheel.winTitle}
                </h2>
                <p className="wheel-result-label">
                  {cat(result.result_type) === "p30" && t.wheel.won30}
                  {cat(result.result_type) === "mfree" && t.wheel.wonMarketplace}
                  {cat(result.result_type) === "pfree" && t.wheel.wonFree}
                </p>
                {result.promo_code && (
                  <button type="button" className="wheel-code" onClick={copyCode} title={t.wheel.copyTitle}>
                    <span>{result.promo_code}</span>
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                )}
                <p className="wheel-note">
                  {cat(result.result_type) === "mfree" ? t.wheel.noteMarketplace : t.wheel.noteAgent}
                </p>
                <div className="wheel-actions">
                  {cat(result.result_type) === "mfree" ? (
                    <a href="/agents-gpt" className="btn btn-primary btn-xl" onClick={close}>
                      {t.wheel.gotoMarketplace}
                    </a>
                  ) : (
                    <a href="/" className="btn btn-primary btn-xl" onClick={close}>
                      {t.wheel.claimAgent}
                    </a>
                  )}
                  <button type="button" className="btn btn-light" onClick={close}>
                    {t.wheel.closeLabel}
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="wheel-title">{t.wheel.loseTitle}</h2>
                <p className="wheel-sub">{t.wheel.loseSub}</p>
                <div className="wheel-actions">
                  <a href="/" className="btn btn-primary btn-xl" onClick={close}>
                    {t.wheel.claimAgent}
                  </a>
                  <a href="/agents-gpt" className="btn btn-light" onClick={close}>
                    {t.wheel.seeMarketplace}
                  </a>
                </div>
              </>
            )}
            <p className="wheel-note">{t.wheel.usedNote}</p>
          </div>
        )}
      </div>
    </div>
  );
}
