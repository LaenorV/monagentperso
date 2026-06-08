import "server-only";
import { isValidAgentSlug } from "./ready-made-agents";

// ============================================================================
// Liens des agents GPT hébergés (ChatGPT). SERVER-ONLY : ces liens ne sont
// révélés qu'après achat (rendus côté serveur dans la page protégée).
// Ne JAMAIS importer ce fichier depuis un composant client.
// ============================================================================
const GPT_URLS: Record<string, string> = {
  "fiches-quiz": "https://chatgpt.com/g/g-6a2735cf824081918112c7f7d7f55d86-fichesquiz-gpt",
  entretien: "https://chatgpt.com/g/g-6a273628bb648191bcf6a9e3b6f10183-entretien-gpt",
  dissertation: "https://chatgpt.com/g/g-6a273675dc108191a843917b75757af5-dissertation-gpt",
  "cv-optimizer": "https://chatgpt.com/g/g-6a2736c8c8a481918d3f2852423aa29b-cv-gpt",
  humanizer: "https://chatgpt.com/g/g-6a27358bd3948191b83c1773b6f639d4-humanizer-gpt",
  "meta-prompt": "https://chatgpt.com/g/g-6a27354dc1bc8191ba5b07b1936218dc-metaprompt-gpt",
  resumeur: "https://chatgpt.com/g/g-6a27350f8e64819188c633bc3bba51a5-resumeur-gpt",
  slides: "https://chatgpt.com/g/g-6a2734ab88fc8191962d19737c56b0a2-slides-gpt",
};

export function getAgentGptUrl(slug: string): string | null {
  if (!isValidAgentSlug(slug)) return null;
  return GPT_URLS[slug] ?? null;
}
