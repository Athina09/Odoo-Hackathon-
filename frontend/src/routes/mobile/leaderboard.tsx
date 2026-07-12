import { createFileRoute } from "@tanstack/react-router";
import { EmployeeLeaderboardScreen } from "@/components/ecosphere/mobile/EmployeeLeaderboardScreen";

export const Route = createFileRoute("/mobile/leaderboard")({
  head: () => ({ meta: [{ title: "Leaderboard — EcoSphere" }] }),
  component: EmployeeLeaderboardScreen,
});
