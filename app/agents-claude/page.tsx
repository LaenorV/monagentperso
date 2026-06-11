import type { Metadata } from "next";
import AgentMarketplace from "@/components/AgentMarketplace";
import { getLocale, dictFor } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = dictFor(await getLocale());
  return { title: t.agents.metaClaudeTitle, description: t.agents.metaClaudeDesc };
}

export default function AgentsClaudePage() {
  return <AgentMarketplace initialFilter="claude" />;
}
