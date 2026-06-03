import type { Metadata } from "next";
import AgentGrid from "@/components/AgentGrid";

export const metadata: Metadata = {
  title: "Agents GPT prêts à l'emploi — 4,90 € | MonAgentPerso",
  description:
    "Débloquez des agents ChatGPT experts, prêts à l'emploi, pour 4,90 € chacun : Humanizer, CV, Dissertation, Résumeur, Fiches & Quiz, et plus.",
};

export default function AgentsGptPage() {
  return <AgentGrid platform="gpt" />;
}
