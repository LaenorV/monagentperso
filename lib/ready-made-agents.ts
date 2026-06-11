// ============================================================================
// Catalogue des AGENTS PRÊTS À L'EMPLOI (offre 4,90 €).
// Source de vérité côté serveur : le prix et la liste autorisée des slugs.
// Ce fichier ne contient AUCUN prompt complet → safe à importer côté client
// (les cartes publiques n'affichent que le `publicPreview`).
// Le contenu complet (instructions + PDF) vit dans /content/agents/<slug>/
// et n'est servi qu'après achat (voir lib/agent-content.ts, server-only).
// ============================================================================

export const AGENT_PRICE_CENTS = 490; // 4,90 €
export const AGENT_PRICE_LABEL = "4,90 €";

export type AgentType = "gpt" | "claude" | "both" | "prompt" | "workflow";

export type ReadyMadeAgent = {
  slug: string;
  name: string;
  shortDescription: string;
  category: string;
  type: AgentType;
  priceLabel: string;
  /** Argumentaire commercial — JAMAIS le prompt complet. */
  publicPreview: string[];
};

export const READY_MADE_AGENTS: ReadyMadeAgent[] = [
  {
    slug: "humanizer",
    name: "Humanizer IA",
    shortDescription:
      "Réécrit un texte généré par IA pour qu'il sonne naturel et ne déclenche plus les détecteurs — sans changer le sens.",
    category: "Rédaction",
    type: "both",
    priceLabel: AGENT_PRICE_LABEL,
    publicPreview: [
      "Connaît le fonctionnement des détecteurs (perplexité, burstiness) et tous les grands outils",
      "Supprime les tics d'IA et varie le rythme, en gardant ton registre",
      "Plusieurs niveaux d'intensité + reformulations à la demande",
    ],
  },
  {
    slug: "dissertation",
    name: "Disserto — Dissertations",
    shortDescription:
      "Rédige des dissertations structurées et naturelles, du collège aux études supérieures, partie par partie.",
    category: "Études",
    type: "both",
    priceLabel: AGENT_PRICE_LABEL,
    publicPreview: [
      "Méthode complète : problématique, plan, paragraphes argumentés, transitions",
      "Adapté par discipline (philo, droit, histoire-géo, SES, prépa…)",
      "Rédaction partie par partie + reformulations pour un rendu pro",
    ],
  },
  {
    slug: "cv-optimizer",
    name: "CV Optimizer",
    shortDescription:
      "Crée un CV qui passe les ATS, taillé pour l'offre visée et percutant en 8 secondes — sans inventer.",
    category: "Emploi",
    type: "both",
    priceLabel: AGENT_PRICE_LABEL,
    publicPreview: [
      "Optimisation ATS + mots-clés exacts de l'offre",
      "Expériences chiffrées au format PAR, accroche percutante",
      "Adaptation France / international (photo, âge, RGPD)",
    ],
  },
  {
    slug: "resumeur",
    name: "Résumeur",
    shortDescription:
      "Transforme PDF, cours, articles et vidéos en synthèse claire + points clés, fidèle à la source.",
    category: "Productivité",
    type: "both",
    priceLabel: AGENT_PRICE_LABEL,
    publicPreview: [
      "Plusieurs niveaux : TL;DR, points clés, synthèse détaillée",
      "Formats fiche Cornell, carte mentale, tableau",
      "Fidélité stricte : aucune information inventée",
    ],
  },
  {
    slug: "fiches-quiz",
    name: "Fiches & Quiz",
    shortDescription:
      "Génère des flashcards et des quiz à partir de tes cours pour mémoriser durablement.",
    category: "Études",
    type: "both",
    priceLabel: AGENT_PRICE_LABEL,
    publicPreview: [
      "Fondé sur la science : active recall + répétition espacée",
      "Flashcards, QCM, cartes à trous, quiz avec corrigé",
      "Export Anki / Quizlet + planning de révision",
    ],
  },
  {
    slug: "meta-prompt",
    name: "Meta-Prompt",
    shortDescription:
      "Fabrique des prompts parfaits, structurés et réutilisables, optimisés pour ton modèle d'IA.",
    category: "IA & Power users",
    type: "both",
    priceLabel: AGENT_PRICE_LABEL,
    publicPreview: [
      "Frameworks éprouvés (RTF, COSTAR) + techniques avancées",
      "Variables réutilisables + exemple de résultat fourni",
      "Optimisation par modèle (Claude, GPT, Gemini, Mistral)",
    ],
  },
  {
    slug: "entretien",
    name: "Prépa Entretien",
    shortDescription:
      "Un simulateur d'entretien d'embauche qui te questionne, t'évalue et te fait progresser.",
    category: "Emploi",
    type: "both",
    priceLabel: AGENT_PRICE_LABEL,
    publicPreview: [
      "Simulation réaliste, question par question, avec feedback noté",
      "Méthode STAR, questions pièges, négociation salariale",
      "Niveaux bienveillant → stress, personnalisé via l'offre",
    ],
  },
  {
    slug: "slides",
    name: "Slides / Présentation",
    shortDescription:
      "Construit la structure et le contenu d'une présentation claire et percutante, slide par slide.",
    category: "Productivité",
    type: "both",
    priceLabel: AGENT_PRICE_LABEL,
    publicPreview: [
      "Trames pro : SCQA, pyramide de Minto, pitch Kawasaki",
      "Titres qui portent le message, règle 6×6, data-viz",
      "Notes de l'orateur + suggestions de visuels",
    ],
  },
];

// --- Traductions anglaises (champs localisables uniquement) ----------------
import type { Locale } from "./i18n/config";

export const AGENT_PRICE_LABEL_EN = "€4.90";

type AgentL10n = { name: string; shortDescription: string; category: string; publicPreview: string[] };

const AGENT_EN: Record<string, AgentL10n> = {
  humanizer: {
    name: "AI Humanizer",
    shortDescription:
      "Rewrites AI-generated text so it sounds natural and no longer triggers detectors — without changing the meaning.",
    category: "Writing",
    publicPreview: [
      "Knows how detectors work (perplexity, burstiness) and all the major tools",
      "Removes AI tics and varies the rhythm, keeping your register",
      "Several intensity levels + reformulations on demand",
    ],
  },
  dissertation: {
    name: "Disserto — Essays",
    shortDescription:
      "Writes structured, natural essays, from middle school to higher education, part by part.",
    category: "Studies",
    publicPreview: [
      "Full method: thesis, outline, argued paragraphs, transitions",
      "Adapted by discipline (philosophy, law, history, economics, prep schools…)",
      "Part-by-part writing + reformulations for a polished result",
    ],
  },
  "cv-optimizer": {
    name: "CV Optimizer",
    shortDescription:
      "Builds a CV that passes ATS, tailored to the target job and striking in 8 seconds — without inventing anything.",
    category: "Jobs",
    publicPreview: [
      "ATS optimization + the job's exact keywords",
      "Quantified experience in PAR format, punchy headline",
      "France / international adaptation (photo, age, GDPR)",
    ],
  },
  resumeur: {
    name: "Summarizer",
    shortDescription:
      "Turns PDFs, courses, articles and videos into a clear summary + key points, faithful to the source.",
    category: "Productivity",
    publicPreview: [
      "Several levels: TL;DR, key points, detailed summary",
      "Cornell note, mind map, table formats",
      "Strict fidelity: no invented information",
    ],
  },
  "fiches-quiz": {
    name: "Flashcards & Quizzes",
    shortDescription:
      "Generates flashcards and quizzes from your courses for lasting memorization.",
    category: "Studies",
    publicPreview: [
      "Science-based: active recall + spaced repetition",
      "Flashcards, MCQs, fill-in-the-blanks, quizzes with answer keys",
      "Anki / Quizlet export + revision schedule",
    ],
  },
  "meta-prompt": {
    name: "Meta-Prompt",
    shortDescription:
      "Crafts perfect, structured and reusable prompts, optimized for your AI model.",
    category: "AI & Power users",
    publicPreview: [
      "Proven frameworks (RTF, COSTAR) + advanced techniques",
      "Reusable variables + a sample result provided",
      "Per-model optimization (Claude, GPT, Gemini, Mistral)",
    ],
  },
  entretien: {
    name: "Interview Prep",
    shortDescription:
      "A job-interview simulator that questions you, evaluates you and helps you improve.",
    category: "Jobs",
    publicPreview: [
      "Realistic simulation, question by question, with scored feedback",
      "STAR method, trick questions, salary negotiation",
      "Levels from supportive → stressful, personalized via the job ad",
    ],
  },
  slides: {
    name: "Slides / Presentation",
    shortDescription:
      "Builds the structure and content of a clear, impactful presentation, slide by slide.",
    category: "Productivity",
    publicPreview: [
      "Pro frameworks: SCQA, Minto pyramid, Kawasaki pitch",
      "Message-carrying titles, 6×6 rule, data-viz",
      "Speaker notes + visual suggestions",
    ],
  },
};

export function agentPriceLabel(locale: Locale): string {
  return locale === "en" ? AGENT_PRICE_LABEL_EN : AGENT_PRICE_LABEL;
}

// Renvoie un agent avec ses champs localisés selon la locale.
export function localizeAgent(a: ReadyMadeAgent, locale: Locale): ReadyMadeAgent {
  if (locale !== "en") return a;
  const tr = AGENT_EN[a.slug];
  if (!tr) return a;
  return { ...a, ...tr, priceLabel: AGENT_PRICE_LABEL_EN };
}

export function getLocalizedAgents(locale: Locale): ReadyMadeAgent[] {
  return READY_MADE_AGENTS.map((a) => localizeAgent(a, locale));
}

export function getAgent(slug: string): ReadyMadeAgent | undefined {
  return READY_MADE_AGENTS.find((a) => a.slug === slug);
}

export function getAgentLocalized(slug: string, locale: Locale): ReadyMadeAgent | undefined {
  const a = getAgent(slug);
  return a ? localizeAgent(a, locale) : undefined;
}

export function isValidAgentSlug(slug: string): boolean {
  return READY_MADE_AGENTS.some((a) => a.slug === slug);
}

export function agentsByType(type: "gpt" | "claude"): ReadyMadeAgent[] {
  return READY_MADE_AGENTS.filter((a) => a.type === type || a.type === "both");
}

// --- Intention d'achat (reprise après connexion) ---------------------------
// Clé localStorage. Helpers guardés → safe à importer côté serveur (no-op).
export const PENDING_PURCHASE_KEY = "map_pending_purchase";

export function setPendingPurchase(slug: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PENDING_PURCHASE_KEY, slug);
  } catch {
    /* ignore */
  }
}

export function getPendingPurchase(): string {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(PENDING_PURCHASE_KEY) ?? "";
  } catch {
    return "";
  }
}

export function clearPendingPurchase() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(PENDING_PURCHASE_KEY);
  } catch {
    /* ignore */
  }
}
