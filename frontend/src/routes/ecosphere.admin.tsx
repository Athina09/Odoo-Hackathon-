import { createFileRoute, redirect } from "@tanstack/react-router";
import { SuperAdminConsole } from "@/components/ecosphere/admin/SuperAdminConsole";
import { getEcoSession } from "@/lib/ecosphere-auth";

export const Route = createFileRoute("/ecosphere/admin")({
  beforeLoad: () => {
    const session = getEcoSession();
    if (!session || session.role !== "SUPER_ADMIN") {
      throw redirect({ to: "/ecosphere/login", search: { redirect: "/ecosphere/admin" } });
    }
  },
  head: () => ({
    meta: [{ title: "Super Admin — EcoSphere" }],
  }),
  component: SuperAdminPage,
});

function SuperAdminPage() {
  return <SuperAdminConsole />;
}
