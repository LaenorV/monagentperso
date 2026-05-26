"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { useModal } from "./ModalContext";

type Question =
  | { k: string; q: string; type: "text"; ph?: string; optional?: boolean; hint?: string }
  | { k: string; q: string; type: "textarea"; ph?: string; optional?: boolean; hint?: string }
  | { k: string; q: string; type: "radio"; options: string[]; optional?: boolean; hint?: string }
  | { k: string; q: string; type: "checkbox"; options: string[]; optional?: boolean; hint?: string; allowOther?: boolean }
  | { k: string; q: string; type: "file"; optional?: boolean; hint?: string }
  | { k: string; q: string; type: "contact"; optional?: boolean; hint?: string };

type ContactAnswer = {
  name: string;
  email: string;
  email2: string;
  phone: string;
  consent: boolean;
};

type CheckboxAnswer = { selected: string[]; other?: string };
type Answer = string | string[] | CheckboxAnswer | ContactAnswer | undefined;

const questions: Question[] = [
  // Section 1 — Identité pro
  { k: "Métier", q: "Quel est l'intitulé exact de votre métier ?", type: "text", ph: "Ex : ostéopathe équin, courtier en assurance pro IARD, consultant SEO e-commerce B2B", hint: "Plus c'est précis, mieux nous pourrons cibler les ressources métier pertinentes." },
  { k: "Spécialité", q: "Quelle est votre spécialité ou niche au sein de ce métier ?", type: "textarea", hint: "Détaillez l'angle particulier que vous occupez (clientèle, méthode, secteur…)." },
  { k: "Expérience", q: "Depuis combien d'années exercez-vous ce métier ?", type: "radio", options: ["< 1 an", "1-3 ans", "3-7 ans", "7-15 ans", "> 15 ans"] },
  { k: "Statut", q: "Quel est votre statut ?", type: "radio", options: ["Indépendant / Freelance", "TPE (1-10 collaborateurs)", "PME (11-250)", "ETI / Grand groupe", "Cabinet / Agence", "Association / ONG"] },
  { k: "Zone", q: "Sur quelle(s) zone(s) géographique(s) exercez-vous ?", type: "checkbox", options: ["Local (ville/département)", "Régional", "National", "Européen", "International"] },
  { k: "Entreprise", q: "Quel est le nom de votre entreprise, boutique ou activité ?", type: "text", ph: "Ex : Cabinet Dupont & Associés, Atelier Léa, La Belle Saison…" },
  { k: "Présence en ligne", q: "Quels sont vos sites web, boutiques en ligne ou comptes professionnels ?", type: "textarea", optional: true, ph: "Ex : monsite.fr — instagram.com/moncompte — linkedin.com/in/...", hint: "Ces liens nous aident à comprendre votre image de marque et votre ton actuel." },

  // Section 2 — Cœur opérationnel
  { k: "Tâches répétitives", q: "Listez vos 5 tâches répétitives qui vous prennent le plus de temps chaque semaine.", type: "textarea", ph: "Une tâche par ligne" },
  { k: "Priorité", q: "Parmi ces tâches, laquelle aimeriez-vous voir automatisée en priorité absolue ?", type: "textarea", hint: "Soyez précis : quel résultat attendez-vous, en combien de temps, à quelle fréquence ?" },
  { k: "Temps perdu", q: "Combien de temps perdez-vous chaque semaine sur ces tâches ?", type: "radio", options: ["Moins de 2h", "2 à 5h", "5 à 10h", "10 à 20h", "Plus de 20h"] },
  { k: "Livrables", q: "Quels livrables produisez-vous régulièrement ?", type: "checkbox", allowOther: true, options: [
    "Devis et propositions commerciales",
    "Rapports d'activité / bilans",
    "Emails clients / réponses",
    "Comptes-rendus de réunion",
    "Posts réseaux sociaux",
    "Articles de blog / newsletters",
    "Présentations / pitchs",
    "Factures et relances",
    "Analyses / audits",
    "Contrats et documents juridiques",
    "Fiches produit / catalogues",
    "Réponses à appels d'offres",
    "Documents de formation",
    "Scripts de prospection",
    "Synthèses de veille",
    "Comptes-rendus médicaux / techniques",
  ] },
  { k: "Journée type", q: "Décrivez le déroulé type d'une journée ou d'une mission.", type: "textarea", ph: "Du premier contact client jusqu'à la livraison finale", hint: "Cela nous permet de comprendre votre chaîne de valeur et où l'agent peut s'insérer." },
  { k: "Outils", q: "Quels outils, logiciels ou plateformes utilisez-vous au quotidien ?", type: "textarea", ph: "Ex : Notion, Excel, HubSpot, Canva, Doctolib, Sage, WordPress…" },
  { k: "Fréquence", q: "À quelle fréquence produisez-vous ces livrables ?", type: "checkbox", options: ["Plusieurs fois par jour", "Quotidien", "Plusieurs fois par semaine", "Hebdomadaire", "Mensuel", "Selon les missions"] },

  // Section 3 — Clients & contexte
  { k: "Client type", q: "Qui est votre client type ?", type: "textarea", ph: "Secteur, taille, profil décisionnaire, problématique récurrente, budget moyen…" },
  { k: "Problèmes clients", q: "Quels sont les 3 problèmes que vos clients vous posent le plus souvent ?", type: "textarea" },
  { k: "Demandes types", q: "Donnez 2 ou 3 exemples concrets de demandes que vous recevez de vos clients.", type: "textarea", ph: "Ex : « J'ai besoin d'une réponse à mon assureur », « Pouvez-vous me préparer un devis pour... »", hint: "Plus c'est concret, mieux l'agent saura imiter votre façon de répondre." },
  { k: "Ton", q: "Quel(s) ton(s) de communication utilisez-vous avec vos clients ?", type: "checkbox", options: ["Très formel / corporate", "Professionnel chaleureux", "Direct et concis", "Pédagogique / explicatif", "Décontracté / proche", "Technique / expert", "Empathique / rassurant", "Vendeur / persuasif"] },
  { k: "Vocabulaire", q: "Avez-vous un vocabulaire ou jargon spécifique à votre métier que l'agent doit maîtriser ?", type: "textarea", optional: true, ph: "Termes techniques, acronymes, normes, expressions « maison »…" },

  // Section 4 — Personnalisation agent
  { k: "Rôle agent", q: "Quel(s) rôle(s) principal(aux) doit jouer votre agent ?", type: "checkbox", allowOther: true, options: [
    "Assistant rédaction (emails, posts, contenus)",
    "Conseiller expert (réponses techniques)",
    "Générateur de livrables (devis, rapports)",
    "Coach / formateur interne",
    "Avant-vente / qualification leads",
    "Recherche & veille sectorielle",
    "Assistant administratif",
    "Préparation de rendez-vous / brief",
    "Synthèse de documents",
    "Traduction / adaptation linguistique",
    "Analyse de données / chiffres",
    "Support client de premier niveau",
  ] },
  { k: "Plateforme", q: "Sur quelle(s) plateforme(s) souhaitez-vous utiliser votre agent ?", type: "checkbox", options: ["Agent GPT sur ChatGPT", "Claude.md sur Claude", "Gemini Gem sur Gemini", "Je ne sais pas — conseillez-moi"] },
  { k: "Nom agent", q: "Quel nom souhaitez-vous donner à votre agent ?", type: "text", optional: true, ph: "Ex : Léo, AssistantPro, Mon Copilote Métier" },
  { k: "Personnalisation", q: "Quels aspects voulez-vous personnaliser dans la réponse de votre agent ?", type: "checkbox", options: [
    "Ton et style d'écriture",
    "Vocabulaire métier",
    "Format des livrables (template, structure)",
    "Signature et formules de politesse",
    "Processus de travail / checklist",
    "Critères qualité / validation",
    "Sources et références à citer",
    "Limites et garde-fous",
  ] },
  { k: "Interdits", q: "Y a-t-il des sujets ou comportements à interdire absolument à l'agent ?", type: "textarea", optional: true, ph: "Ex : ne jamais donner de conseil juridique ferme, ne pas s'engager sur un prix, éviter les promesses chiffrées…" },
  { k: "Résultat", q: "Quel résultat concret attendez-vous de cet agent dans les 30 premiers jours ?", type: "textarea", ph: "Gain de temps estimé, tâches déléguées, qualité attendue…" },

  // Section 5 — Final
  { k: "Documents", q: "Documents complémentaires à transmettre", type: "file", optional: true },
  { k: "Coordonnées", q: "Vos coordonnées", type: "contact" },
];

export default function Modal() {
  const { isOpen, close } = useModal();
  const router = useRouter();
  const [phase, setPhase] = useState<"intro" | "questions">("intro");
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [otherShown, setOtherShown] = useState<boolean>(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPhase("intro");
      setQIndex(0);
      setAnswers({});
      setErrorMsg("");
    }
  }, [isOpen]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0 });
    setErrorMsg("");
    const item = questions[qIndex];
    if (item?.type === "checkbox" && item.allowOther) {
      const a = answers[qIndex] as CheckboxAnswer | undefined;
      setOtherShown(!!(a?.selected?.includes("Autre") || a?.other));
    } else {
      setOtherShown(false);
    }
  }, [qIndex, phase, answers]);

  if (!isOpen) return null;

  // === INTRO PHASE ===
  if (phase === "intro") {
    return (
      <div className="modal active" aria-modal="true">
        <div className="intro-card">
          <div className="intro-icon"><Sparkles size={36} strokeWidth={1.8} /></div>
          <h2>Bienvenue sur votre questionnaire personnalisé</h2>
          <p>
            Cela ne vous prendra que <strong>3 minutes</strong>, afin d'obtenir l'agent IA le plus
            adapté à votre besoin.
          </p>
          <p>
            Toutes les informations transmises sont enregistrées <strong>uniquement pour la
            création de votre agent</strong> et ne seront <strong>jamais divulguées</strong>.
          </p>
          <p>
            Il est important pour nous d'obtenir le plus d'informations sur vos besoins, vos tâches
            et vos souhaits, afin de vous créer un assistant <strong>entièrement personnalisé</strong>.
            N'hésitez pas à être précis sur vos demandes.
          </p>
          <div className="intro-features">
            <div className="intro-feature"><b>26</b>questions guidées</div>
            <div className="intro-feature"><b>~3 min</b>de votre temps</div>
            <div className="intro-feature"><b>24h</b>de livraison</div>
          </div>
          <div className="intro-actions">
            <button className="btn btn-primary btn-xl" onClick={() => setPhase("questions")}>
              Lancer le questionnaire →
            </button>
            <button className="btn btn-light" onClick={close}>
              Fermer
            </button>
          </div>
        </div>
      </div>
    );
  }

  // === QUESTIONS PHASE ===
  const item = questions[qIndex];
  const isLast = qIndex === questions.length - 1;
  const progress = ((qIndex + 1) / questions.length) * 100;

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

  function next() {
    const ans = getAnswer();
    if (!isValid(ans)) {
      setErrorMsg(
        item.type === "contact"
          ? "Veuillez renseigner votre nom, votre email et confirmer le même email."
          : "Veuillez répondre à cette question pour continuer.",
      );
      return;
    }
    setAnswers((prev) => ({ ...prev, [qIndex]: ans }));
    if (isLast) {
      close();
      router.push("/payment");
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
    if (value === "Autre") setOtherShown(checked);
  }

  function renderField() {
    if (item.type === "text") {
      return (
        <input
          id="currentInput"
          type="text"
          placeholder={item.ph || ""}
          defaultValue={(answers[qIndex] as string) || ""}
          key={`t-${qIndex}`}
        />
      );
    }
    if (item.type === "textarea") {
      return (
        <textarea
          id="currentInput"
          placeholder={item.ph || ""}
          defaultValue={(answers[qIndex] as string) || ""}
          key={`ta-${qIndex}`}
        />
      );
    }
    if (item.type === "radio") {
      const current = (answers[qIndex] as string) || "";
      return (
        <div className="choices" key={`r-${qIndex}`}>
          {item.options.map((o) => (
            <label className="choice" key={o}>
              <input name="currentInput" type="radio" value={o} defaultChecked={current === o} /> {o}
            </label>
          ))}
        </div>
      );
    }
    if (item.type === "checkbox") {
      const current = (answers[qIndex] as CheckboxAnswer | undefined) || { selected: [], other: "" };
      const options = item.allowOther ? [...item.options, "Autre"] : item.options;
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
                placeholder="Précisez votre réponse ici…"
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
          <b>Déposez tout document qui aidera à personnaliser votre agent</b>
          <p>Plaquettes, exemples de livrables, charte éditoriale, études de cas, procédures…</p>
          <p style={{ marginTop: 12, fontSize: 12 }}>PDF, DOCX, TXT, MD, PNG, JPG — max 20 Mo</p>
          <input id="currentInput" type="file" multiple style={{ marginTop: 14 }} />
        </label>
      );
    }
    if (item.type === "contact") {
      const c = (answers[qIndex] as ContactAnswer) || ({} as ContactAnswer);
      return (
        <div key={`c-${qIndex}`}>
          <div className="coord-grid">
            <input id="name" placeholder="Prénom & Nom" defaultValue={c.name || ""} />
            <input id="email" type="email" placeholder="Email" defaultValue={c.email || ""} />
            <input id="email2" type="email" placeholder="Confirmation email" defaultValue={c.email2 || ""} />
            <input id="phone" placeholder="Téléphone (optionnel)" defaultValue={c.phone || ""} />
          </div>
          <label className="choice" style={{ marginTop: 12 }}>
            <input id="consent" type="checkbox" defaultChecked={c.consent || false} /> J'accepte d'être recontacté pour affiner les besoins de mon agent
          </label>
          <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 14, lineHeight: 1.55 }}>
            ✉ C'est sur cet email que vous recevrez votre agent IA personnalisé sous <strong style={{ color: "var(--ink)" }}>24h maximum</strong>. Vérifiez bien qu'il est correct.
          </p>
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
          <button className="q-close" onClick={close} aria-label="Fermer">×</button>
        </div>
        <div className="q-progress">
          <div className="q-progress-bar" style={{ width: `${progress}%` }} />
        </div>
        <div className="q-body" ref={bodyRef}>
          <span className="q-kicker">
            {item.k} <span className="q-kicker-num">· {qIndex + 1}/{questions.length}</span>
          </span>
          <h2 className="q-title">{item.q}</h2>
          {item.hint && <p className="q-hint">{item.hint}</p>}
          <div className="field">{renderField()}</div>
          <div className={`error${errorMsg ? " active" : ""}`}>
            {errorMsg || "Veuillez répondre à cette question pour continuer."}
          </div>
        </div>
        <div className="q-actions">
          <button className="btn btn-light" onClick={prev}>
            ← Retour
          </button>
          <button className={isLast ? "btn btn-green" : "btn btn-primary"} onClick={next}>
            {isLast ? "Valider le questionnaire ↗" : "Continuer →"}
          </button>
        </div>
      </div>
    </div>
  );
}
