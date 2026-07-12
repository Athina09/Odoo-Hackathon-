import { createFileRoute } from "@tanstack/react-router";
import { EmployeeRewardsScreen } from "@/components/ecosphere/mobile/EmployeeRewardsScreen";

export const Route = createFileRoute("/mobile/rewards")({
  head: () => ({ meta: [{ title: "Rewards — EcoSphere" }] }),
  component: EmployeeRewardsScreen,
});
