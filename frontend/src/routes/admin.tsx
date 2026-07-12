import { createFileRoute, redirect } from "@tanstack/react-router";
import { SuperAdminConsole } from "@/components/ecosphere/admin/SuperAdminConsole";
import { EcoPage } from "@/components/ecosphere/EcoPage";
import { getEcoSession } from "@/lib/ecosphere-auth";

export const Route = createFileRoute("/admin")({
  beforeLoad: () => {
    const session = getEcoSession();
    if (!session || session.role !== "SUPER_ADMIN") {
      throw redirect({ to: "/login", search: { redirect: "/admin" } });
    }
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
