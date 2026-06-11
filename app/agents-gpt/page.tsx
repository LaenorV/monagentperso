import type { Metadata } from "next";
import AgentMarketplace from "@/components/AgentMarketplace";
import { getLocale, dictFor } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = dictFor(await getLocale());
  return { title: t.agents.metaGptTitle, description: t.agents.metaGptDesc };
}

export default function AgentsGptPage() {
  return <AgentMarketplace initialFilter="gpt" />;
}
