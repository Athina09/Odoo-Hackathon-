import { createFileRoute } from "@tanstack/react-router";
import { EcoPage } from "@/components/ecosphere/EcoPage";
import { GamificationHub } from "@/components/ecosphere/screens/GamificationHub";
import { requireRouteAccess } from "@/lib/ecosphere-route-guards";

export const Route = createFileRoute("/gamification")({
  beforeLoad: () => {
    requireRouteAccess("/gamification");
  },
  head: () => ({
    meta: [{ title: "Gamification — EcoSphere" }],
  }),
  component: GamificationPage,
});

function GamificationPage() {
  return (
    <EcoPage>
      <GamificationHub />
    </EcoPage>
  );
}
