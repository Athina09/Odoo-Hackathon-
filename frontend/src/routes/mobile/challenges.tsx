import { createFileRoute } from "@tanstack/react-router";
import { EmployeeChallengesScreen } from "@/components/ecosphere/mobile/EmployeeChallengesScreen";

export const Route = createFileRoute("/mobile/challenges")({
  head: () => ({ meta: [{ title: "Challenges — EcoSphere" }] }),
  component: EmployeeChallengesScreen,
});
