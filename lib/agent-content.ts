import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { isValidAgentSlug } from "./ready-made-agents";

// ============================================================================
// Lecture du contenu COMPLET d'un agent (instructions + PDF).
// `server-only` garantit qu'aucun de ces contenus n'atterrit dans un bundle
// client. À n'appeler qu'après avoir vérifié l'achat de l'utilisateur.
// ============================================================================

function agentDir(slug: string): string {
  // Garde anti path-traversal : on n'accepte que des slugs du catalogue.
  if (!isValidAgentSlug(slug)) throw new Error("invalid_agent_slug");
  return path.join(process.cwd(), "content", "agents", slug);
}

export async function getAgentInstructions(
  slug: string,
): Promise<{ gpt: string | null; claude: string | null }> {
  const dir = agentDir(slug);
  const read = async (file: string) => {
    try {
      return await fs.readFile(path.join(dir, file), "utf8");
    } catch {
      return null;
    }
  };
  const [gpt, claude] = await Promise.all([
    read("instructions-gpt.txt"),
    read("instructions-claude.md"),
  ]);
  return { gpt, claude };
}

export async function getAgentKnowledgePdf(slug: string): Promise<Buffer | null> {
  const dir = agentDir(slug);
  try {
    return await fs.readFile(path.join(dir, "knowledge.pdf"));
  } catch {
    return null;
  }
}
