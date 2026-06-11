"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { useModal } from "./ModalContext";
import { getAffiliateRef } from "@/lib/affiliate";
import { useLocale } from "@/lib/i18n/context";

type QType = "text" | "textarea" | "radio" | "checkbox" | "file" | "contact";
// Structure stable des questions. `k` est la clé envoyée au checkout/Stripe/DB
// et NE doit pas changer selon la langue. Le texte affiché vient du dictionnaire
// (t.questionnaire.questions[index]), parallèle par index à ce tableau.
type QMeta = { k: string; type: QType; optional?: boolean; allowOther?: boolean };

const QUESTION_META: QMeta[] = [
  { k: "Métier", type: "text" },
  { k: "Spécialité", type: "textarea" },
  { k: "Expérience", type: "radio" },
  { k: "Statut", type: "radio" },
  { k: "Zone", type: "checkbox" },
  { k: "Entreprise", type: "text" },
  { k: "Présence en ligne", type: "textarea", optional: true },
  { k: "Tâches répétitives", type: "textarea" },
  { k: "Priorité", type: "textarea" },
  { k: "Temps perdu", type: "radio" },
  { k: "Livrables", type: "checkbox", allowOther: true },
  { k: "Journée type", type: "textarea" },
  { k: "Outils", type: "textarea" },
  { k: "Fréquence", type: "checkbox" },
  { k: "Client type", type: "textarea" },
  { k: "Problèmes clients", type: "textarea" },
  { k: "Demandes types", type: "textarea" },
  { k: "Ton", type: "checkbox" },
  { k: "Vocabulaire", type: "textarea", optional: true },
  { k: "Rôle agent", type: "checkbox", allowOther: true },
  { k: "Plateforme", type: "checkbox" },
  { k: "Nom agent", type: "text", optional: true },
  { k: "Personnalisation", type: "checkbox" },
  { k: "Interdits", type: "textarea", optional: true },
  { k: "Résultat", type: "textarea" },
  { k: "Documents", type: "file", optional: true },
  { k: "Coordonnées", type: "contact" },
];

type ContactAnswer = {
  name: string;
  email: string;
  email2: string;
  phone: string;
  consent: boolean;
};

type CheckboxAnswer = { selected: string[]; other?: string };
type Answer = string | string[] | CheckboxAnswer | ContactAnswer | undefined;

// Rend un texte contenant des marqueurs {…} en insérant les segments en gras
// fournis (dans l'ordre). Permet de localiser des phrases avec <strong>.
function withBold(tpl: string, bolds: React.ReactNode[]): React.ReactNode[] {
  const segs = tpl.split(/\{[^}]+\}/);
  const out: React.ReactNode[] = [];
  segs.forEach((s, i) => {
    out.push(<span key={`s${i}`}>{s}</span>);
    if (i < bolds.length) out.push(<strong key={`b${i}`}>{bolds[i]}</strong>);
  });
  return out;
}



export default function Modal() {
  const { isOpen, close } = useModal();
  const { t, locale } = useLocale();
  const tq = t.questionnaire;
  const OTHER = tq.otherOption;
  const router = useRouter();
  const [phase, setPhase] = useState<"intro" | "questions">("intro");
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [otherShown, setOtherShown] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [promoInput, setPromoInput] = useState<string>("");
  const [promo, setPromo] = useState<{ code: string; final_amount: number; is_free: boolean } | null>(null);
  const [promoMsg, setPromoMsg] = useState<string>("");
  const [promoLoading, setPromoLoading] = useState<boolean>(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPhase("intro");
      setQIndex(0);
      setAnswers({});
      setErrorMsg("");
      setSubmitting(false);
      setPromoInput("");
      setPromo(null);
      setPromoMsg("");
    }
  }, [isOpen]);

  async function applyPromo() {
    if (!promoInput.trim()) return;
    setPromoLoading(true);
    setPromoMsg("");
    try {
      const res = await fetch("/api/promo/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoInput.trim(), purchase_type: "personalized_agent" }),
      });
      const data = await res.json();
      if (data.valid) {
        setPromo({ code: data.code, final_amount: data.final_amount, is_free: data.is_free });
      } else {
        setPromo(null);
        setPromoMsg(data.message || tq.promo.errInvalid);
      }
    } catch {
      setPromoMsg(tq.promo.errCheck);
    }
    setPromoLoading(false);
  }

  function euro(cents: number): string {
    const v = cents / 100;
    return locale === "en"
      ? "€" + v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : v.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
  }

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0 });
    setErrorMsg("");
    const meta = QUESTION_META[qIndex];
    if (meta?.type === "checkbox" && meta.allowOther) {
      const a = answers[qIndex] as CheckboxAnswer | undefined;
      setOtherShown(!!(a?.selected?.includes(OTHER) || a?.other));
    } else {
      setOtherShown(false);
    }
  }, [qIndex, phase, answers, OTHER]);

  if (!isOpen) return null;

  // === INTRO PHASE ===
  if (phase === "intro") {
    return (
      <div className="modal active" aria-modal="true">
        <div className="intro-card">
          <div className="intro-icon"><Sparkles size={36} strokeWidth={1.8} /></div>
          <h2>{tq.intro.title}</h2>
          <p>{withBold(tq.intro.p1, [tq.intro.p1strong])}</p>
          <p>{withBold(tq.intro.p2, [tq.intro.p2strong, tq.intro.p2strong2])}</p>
          <p>{withBold(tq.intro.p3, [tq.intro.p3strong])}</p>
          <div className="intro-features intro-features-2">
            <div className="intro-feature"><b>{tq.intro.feat1}</b>{tq.intro.feat1sub}</div>
            <div className="intro-feature"><b>{tq.intro.feat2}</b>{tq.intro.feat2sub}</div>
          </div>
          <div className="intro-actions">
            <button className="btn btn-primary btn-xl" onClick={() => setPhase("questions")}>
              {tq.intro.start}
            </button>
            <button className="btn btn-light" onClick={close}>
              {tq.intro.close}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // === QUESTIONS PHASE ===
  const item = QUESTION_META[qIndex];
  const qt = tq.questions[qIndex];
  const isLast = qIndex === QUESTION_META.length - 1;
  const progress = ((qIndex + 1) / QUESTION_META.length) * 100;

  function getAnswer(): Answer {
    if (item.type === "text" || item.type === "textarea") {
      const el = document.getElementById("currentInput") as HTMLInputElement | HTMLTextAreaElement | null;
      return el?.value.trim() ?? "";
    }
    if (item.type === "radio") {
      const checked = document.querySelector<HTMLInputElement>('input[name="currentInput"]:checked');
      return checked ? checked.value : "";
    }
    if (item.type === "checkbox") {
      const selected = Array.from(
        document.querySelectorAll<HTMLInputElement>('input[name="currentInput"]:checked'),
      ).map((x) => x.value);
      const otherEl = document.getElementById("otherInput") as HTMLInputElement | null;
      const other = otherEl?.value.trim() || "";
      return { selected, other: other || undefined };
    }
    if (item.type === "file") {
      const el = document.getElementById("currentInput") as HTMLInputElement | null;
      const f = el?.files;
      return f && f.length ? Array.from(f).map((x) => x.name) : "";
    }
    if (item.type === "contact") {
      return {
        name: (document.getElementById("name") as HTMLInputElement)?.value.trim() ?? "",
        email: (document.getElementById("email") as HTMLInputElement)?.value.trim() ?? "",
        email2: (document.getElementById("email2") as HTMLInputElement)?.value.trim() ?? "",
        phone: (document.getElementById("phone") as HTMLInputElement)?.value.trim() ?? "",
        consent: (document.getElementById("consent") as HTMLInputElement)?.checked ?? false,
      };
    }
    return "";
  }

  function isValid(ans: Answer): boolean {
    if (item.optional) return true;
    if (item.type === "checkbox") {
      const a = ans as CheckboxAnswer;
      return (a?.selected?.length ?? 0) > 0 || !!a?.other;
    }
    if (item.type === "contact") {
      const a = ans as ContactAnswer;
      return !!(a?.name && a?.email && a?.email2 && a.email === a.email2);
    }
    return !!ans;
  }

  function showError(msg: string) {
    setErrorMsg(msg);
    setSubmitting(false);
    // Remonte en haut du modal pour que l'erreur soit immédiatement visible.
    requestAnimationFrame(() => bodyRef.current?.scrollTo({ top: 0, behavior: "smooth" }));
  }

  async function submitCheckout(finalAnswers: Record<number, Answer>) {
    console.log("[checkout] submitting…");
    setSubmitting(true);
    setErrorMsg("");

    // Construit un payload lisible : { "Métier": "...", "Spécialité": "...", ... }
    // Les clés (q.k) restent en français pour ne rien changer côté checkout/DB.
    const payload: Record<string, Answer> = {};
    QUESTION_META.forEach((q, i) => {
      if (finalAnswers[i] !== undefined) payload[q.k] = finalAnswers[i];
    });

    if (Object.keys(payload).length === 0) {
      console.error("[checkout] questionnaire vide");
      showError(tq.errors.empty);
      return;
    }

    let res: Response;
    try {
      const affiliateRef = getAffiliateRef();
      res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionnaire: payload,
          affiliate_ref: affiliateRef || undefined,
          promo_code: promo?.code || undefined,
        }),
      });
      console.log("[checkout] HTTP", res.status);
    } catch (err) {
      console.error("[checkout] network failure:", err);
      showError(tq.errors.network);
      return;
    }

    if (res.status === 401) {
      console.error("[checkout] 401 unauthenticated — redirect /signup");
      close();
      router.push("/signup?next=questionnaire");
      return;
    }

    let data: { url?: string; error?: string; message?: string } = {};
    try {
      data = await res.json();
    } catch (err) {
      console.error("[checkout] réponse non-JSON:", err);
      showError(tq.errors.invalidResponse.replace("{status}", String(res.status)));
      return;
    }
    console.log("[checkout] payload reçu:", data);

    if (!res.ok) {
      console.error(`[checkout] HTTP ${res.status} —`, data);
      showError(
        `${data.message || data.error || tq.errors.serverPrefix} (HTTP ${res.status})`,
      );
      return;
    }

    if (!data.url) {
      console.error("[checkout] Stripe n'a pas retourné d'URL:", data);
      showError(tq.errors.noUrl);
      return;
    }

    console.log("[checkout] redirection vers", data.url);
    window.location.href = data.url;
  }

  function next() {
    const ans = getAnswer();
    if (!isValid(ans)) {
      setErrorMsg(item.type === "contact" ? tq.errors.contact : tq.errors.required);
      return;
    }
    const updated = { ...answers, [qIndex]: ans };
    setAnswers(updated);
    if (isLast) {
      submitCheckout(updated);
      return;
    }
    setQIndex((i) => i + 1);
  }

  function prev() {
    if (qIndex === 0) {
      setPhase("intro");
      return;
    }
    setQIndex((i) => Math.max(0, i - 1));
  }

  function handleCheckboxChange(value: string, checked: boolean) {
    if (value === OTHER) setOtherShown(checked);
  }

  function renderField() {
    if (item.type === "text") {
      return (
        <input
          id="currentInput"
          type="text"
          placeholder={qt.ph || ""}
          defaultValue={(answers[qIndex] as string) || ""}
          key={`t-${qIndex}`}
        />
      );
    }
    if (item.type === "textarea") {
      return (
        <textarea
          id="currentInput"
          placeholder={qt.ph || ""}
          defaultValue={(answers[qIndex] as string) || ""}
          key={`ta-${qIndex}`}
        />
      );
    }
    if (item.type === "radio") {
      const current = (answers[qIndex] as string) || "";
      return (
        <div className="choices" key={`r-${qIndex}`}>
          {(qt.options ?? []).map((o) => (
            <label className="choice" key={o}>
              <input name="currentInput" type="radio" value={o} defaultChecked={current === o} /> {o}
            </label>
          ))}
        </div>
      );
    }
    if (item.type === "checkbox") {
      const current = (answers[qIndex] as CheckboxAnswer | undefined) || { selected: [], other: "" };
      const options = item.allowOther ? [...(qt.options ?? []), OTHER] : (qt.options ?? []);
      return (
        <div className="choices" key={`cb-${qIndex}`}>
          {options.map((o) => (
            <label className="choice" key={o}>
              <input
                name="currentInput"
                type="checkbox"
                value={o}
                defaultChecked={current.selected?.includes(o)}
                onChange={(e) => handleCheckboxChange(o, e.target.checked)}
              />{" "}
              {o}
            </label>
          ))}
          {item.allowOther && otherShown && (
            <div className="choice-other">
              <input
                id="otherInput"
                className="choice-other-input"
                type="text"
                placeholder={tq.otherPlaceholder}
                defaultValue={current.other || ""}
              />
            </div>
          )}
        </div>
      );
    }
    if (item.type === "file") {
      return (
        <label className="upload-zone" key={`f-${qIndex}`}>
          <div style={{ fontSize: 38, marginBottom: 4 }}>📎</div>
          <b>{tq.upload.title}</b>
          <p>{tq.upload.sub}</p>
          <p style={{ marginTop: 12, fontSize: 12 }}>{tq.upload.formats}</p>
          <input id="currentInput" type="file" multiple style={{ marginTop: 14 }} />
        </label>
      );
    }
    if (item.type === "contact") {
      const c = (answers[qIndex] as ContactAnswer) || ({} as ContactAnswer);
      return (
        <div key={`c-${qIndex}`}>
          <div className="coord-grid">
            <input id="name" placeholder={tq.contact.name} defaultValue={c.name || ""} />
            <input id="email" type="email" placeholder={tq.contact.email} defaultValue={c.email || ""} />
            <input id="email2" type="email" placeholder={tq.contact.emailConfirm} defaultValue={c.email2 || ""} />
            <input id="phone" placeholder={tq.contact.phone} defaultValue={c.phone || ""} />
          </div>
          <label className="choice" style={{ marginTop: 12 }}>
            <input id="consent" type="checkbox" defaultChecked={c.consent || false} /> {tq.contact.consent}
          </label>
          <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 14, lineHeight: 1.55 }}>
            {withBold(tq.contact.deliveryNote, [
              <span style={{ color: "var(--ink)" }} key="d">{tq.contact.deliveryStrong}</span>,
            ])}
          </p>

          {/* Code promo (gagné à la roue) */}
          <div className="q-promo">
            <div className="q-promo-row">
              <input
                type="text"
                placeholder={tq.promo.placeholder}
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                disabled={!!promo}
                aria-label={tq.promo.label}
              />
              {promo ? (
                <button type="button" className="btn btn-light" onClick={() => { setPromo(null); setPromoInput(""); setPromoMsg(""); }}>
                  {tq.promo.remove}
                </button>
              ) : (
                <button type="button" className="btn btn-light" onClick={applyPromo} disabled={promoLoading}>
                  {promoLoading ? tq.promo.loading : tq.promo.apply}
                </button>
              )}
            </div>
            {promo && (
              <p className="q-promo-ok">
                {tq.promo.appliedPrefix} <strong>{promo.code}</strong> —{" "}
                {promo.is_free ? (
                  <>{tq.promo.appliedFree} <strong>{tq.promo.appliedFreeWord}</strong> (<s>{euro(4990)}</s> {tq.promo.appliedFromTo} <strong>{euro(0)}</strong>).</>
                ) : (
                  <><s>{euro(4990)}</s> {tq.promo.appliedFromTo} <strong>{euro(promo.final_amount)}</strong>.</>
                )}
              </p>
            )}
            {promoMsg && <p className="q-promo-err">{promoMsg}</p>}
          </div>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="modal active" aria-modal="true">
      <div className="question-card">
        <div className="q-top">
          <div className="q-brand">
            <img src="/logo.svg" alt="MonAgentPerso" className="q-brand-img" />
          </div>
          <button className="q-close" onClick={close} aria-label={tq.closeLabel}>×</button>
        </div>
        <div className="q-progress">
          <div className="q-progress-bar" style={{ width: `${progress}%` }} />
        </div>
        <div className="q-body" ref={bodyRef}>
          {errorMsg && (
            <div className="error active" style={{ marginTop: 0, marginBottom: 16, fontSize: 15 }}>
              ⚠ {errorMsg}
            </div>
          )}
          <span className="q-kicker">{qt.label}</span>
          <h2 className="q-title">{qt.q}</h2>
          {qt.hint && <p className="q-hint">{qt.hint}</p>}
          <div className="field">{renderField()}</div>
          {!errorMsg && (
            <div className="error">{tq.errors.required}</div>
          )}
        </div>
        <div className="q-actions">
          <button className="btn btn-light" onClick={prev} disabled={submitting}>
            {tq.buttons.back}
          </button>
          <button
            className={isLast ? "btn btn-green" : "btn btn-primary"}
            onClick={next}
            disabled={submitting}
          >
            {submitting
              ? tq.buttons.preparing
              : isLast
              ? promo?.is_free
                ? tq.buttons.submitFree
                : promo
                ? tq.buttons.submitPay.replace("{amount}", euro(promo.final_amount))
                : tq.buttons.submit
              : tq.buttons.continue}
          </button>
        </div>
      </div>
    </div>
  );
}
