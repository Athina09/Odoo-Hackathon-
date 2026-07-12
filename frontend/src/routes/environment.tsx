import { createFileRoute } from "@tanstack/react-router";
import { EcoPage } from "@/components/ecosphere/EcoPage";
import { EnvironmentalDashboard } from "@/components/ecosphere/screens/EnvironmentalDashboard";
import { requireRouteAccess } from "@/lib/ecosphere-route-guards";

export const Route = createFileRoute("/environment")({
  beforeLoad: () => {
    requireRouteAccess("/environment");
  },
  head: () => ({
    meta: [{ title: "Environment — EcoSphere" }],
  }),
  component: EnvironmentPage,
});

function EnvironmentPage() {
  return (
    <EcoPage>
      <EnvironmentalDashboard />
    </EcoPage>
  );
}
