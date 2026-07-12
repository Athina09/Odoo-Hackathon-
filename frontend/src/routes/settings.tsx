import { createFileRoute } from "@tanstack/react-router";
import { EcoPage } from "@/components/ecosphere/EcoPage";
import { SettingsPage } from "@/components/ecosphere/screens/SettingsPage";
import { requireSuperAdmin } from "@/lib/ecosphere-route-guards";

export const Route = createFileRoute("/settings")({
  beforeLoad: () => {
    requireSuperAdmin("/settings");
  },
  head: () => ({
    meta: [{ title: "Settings — EcoSphere" }],
  }),
  component: SettingsRoutePage,
});

function SettingsRoutePage() {
  return (
    <EcoPage>
      <SettingsPage />
    </EcoPage>
  );
}
