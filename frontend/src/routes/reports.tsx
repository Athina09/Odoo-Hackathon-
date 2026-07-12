import { createFileRoute } from "@tanstack/react-router";
import { EcoPage } from "@/components/ecosphere/EcoPage";
import { ReportsPage } from "@/components/ecosphere/screens/ReportsPage";
import { requireRouteAccess } from "@/lib/ecosphere-route-guards";

export const Route = createFileRoute("/reports")({
  beforeLoad: () => {
    requireRouteAccess("/reports");
  },
  head: () => ({
    meta: [{ title: "Reports — EcoSphere" }],
  }),
  component: ReportsRoutePage,
});

function ReportsRoutePage() {
  return (
    <EcoPage>
      <ReportsPage />
    </EcoPage>
  );
}
