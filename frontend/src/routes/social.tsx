import { createFileRoute } from "@tanstack/react-router";
import { EcoPage } from "@/components/ecosphere/EcoPage";
import { SocialDashboard } from "@/components/ecosphere/screens/SocialDashboard";
import { requireRouteAccess } from "@/lib/ecosphere-route-guards";

export const Route = createFileRoute("/social")({
  beforeLoad: () => {
    requireRouteAccess("/social");
  },
  head: () => ({
    meta: [{ title: "Social — EcoSphere" }],
  }),
  component: SocialPage,
});

function SocialPage() {
  return (
    <EcoPage>
      <SocialDashboard />
    </EcoPage>
  );
}
