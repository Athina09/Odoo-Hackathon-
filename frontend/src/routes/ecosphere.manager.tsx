import { createFileRoute, redirect } from "@tanstack/react-router";
import { EsgManagerConsole } from "@/components/ecosphere/manager/EsgManagerConsole";
import { getEcoSession } from "@/lib/ecosphere-auth";

export const Route = createFileRoute("/ecosphere/manager")({
  beforeLoad: () => {
    const session = getEcoSession();
    if (!session || session.role !== "ESG_MANAGER") {
      throw redirect({ to: "/ecosphere/login", search: { redirect: "/ecosphere/manager" } });
    }
  },
  head: () => ({
    meta: [{ title: "ESG Manager — EcoSphere" }],
  }),
  component: EsgManagerPage,
});

function EsgManagerPage() {
  return <EsgManagerConsole />;
}
