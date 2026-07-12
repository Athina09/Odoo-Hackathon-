import { createFileRoute } from "@tanstack/react-router";
import { EcoPage } from "@/components/ecosphere/EcoPage";
import { GovernanceDashboard } from "@/components/ecosphere/screens/GovernanceDashboard";
import { requireRouteAccess } from "@/lib/ecosphere-route-guards";

export const Route = createFileRoute("/governance")({
  beforeLoad: () => {
    requireRouteAccess("/governance");
  },
  head: () => ({
    meta: [{ title: "Governance — EcoSphere" }],
  }),
  component: GovernancePage,
});

function GovernancePage() {
  return (
    <EcoPage>
      <GovernanceDashboard />
    </EcoPage>
  );
}
