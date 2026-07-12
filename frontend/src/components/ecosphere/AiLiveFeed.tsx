import { AiInsightsCard } from "@/components/ecosphere/ds";
import { commandCenterInsights } from "@/data/ecosphere-modules";

export function AiLiveFeed() {
  return <AiInsightsCard insights={commandCenterInsights} />;
}
