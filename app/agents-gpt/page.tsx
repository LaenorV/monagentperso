import type { Metadata } from "next";
import AgentMarketplace from "@/components/AgentMarketplace";

export const metadata: Metadata = {
  title: "Agents IA prêts à l'emploi — 4,90 € | MonAgentPerso",
  description:
    "Débloquez des agents ChatGPT et Claude experts, prêts à l'emploi, pour 4,90 € chacun : Humanizer, CV, Dissertation, Résumeur, Fiches & Quiz, et plus.",
};

export default function AgentsGptPage() {
  return <AgentMarketplace initialFilter="gpt" />;
}
