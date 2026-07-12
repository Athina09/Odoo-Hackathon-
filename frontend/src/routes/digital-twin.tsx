import { createFileRoute } from "@tanstack/react-router";
import { EcoPage } from "@/components/ecosphere/EcoPage";
import { DigitalTwinPage } from "@/components/ecosphere/screens/DigitalTwinPage";
import { requireRouteAccess } from "@/lib/ecosphere-route-guards";

export const Route = createFileRoute("/digital-twin")({
  beforeLoad: () => {
    requireRouteAccess("/digital-twin");
  },
  head: () => ({
    meta: [{ title: "Digital Twin — EcoSphere" }],
  }),
  component: DigitalTwinRoutePage,
});

function DigitalTwinRoutePage() {
  return (
    <EcoPage>
      <DigitalTwinPage />
    </EcoPage>
  );
}
