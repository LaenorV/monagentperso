import type { Metadata } from "next";
import AgentMarketplace from "@/components/AgentMarketplace";

export const metadata: Metadata = {
  title: "Agents Claude prêts à l'emploi — 4,90 € | MonAgentPerso",
  description:
    "Débloquez des agents Claude experts, optimisés pour les Projets Claude (artifacts, contexte long), pour 4,90 € chacun.",
};

export default function AgentsClaudePage() {
  return <AgentMarketplace initialFilter="claude" />;
}
