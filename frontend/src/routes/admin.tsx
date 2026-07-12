import { createFileRoute } from "@tanstack/react-router";
import { SuperAdminConsole } from "@/components/ecosphere/admin/SuperAdminConsole";
import { EcoPage } from "@/components/ecosphere/EcoPage";
import { requireRole } from "@/lib/ecosphere-route-guards";

export const Route = createFileRoute("/admin")({
  beforeLoad: () => {
    requireRole("SUPER_ADMIN", "/admin");
  },
  head: () => ({
    meta: [{ title: "Super Admin — EcoSphere" }],
  }),
  component: SuperAdminPage,
});

function SuperAdminPage() {
  return (
    <EcoPage>
      <SuperAdminConsole />
    </EcoPage>
  );
}
