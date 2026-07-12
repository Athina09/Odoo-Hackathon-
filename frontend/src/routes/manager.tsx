import { createFileRoute, redirect } from "@tanstack/react-router";
import { EsgManagerConsole } from "@/components/ecosphere/manager/EsgManagerConsole";
import { EcoPage } from "@/components/ecosphere/EcoPage";
import { getEcoSession } from "@/lib/ecosphere-auth";

export const Route = createFileRoute("/manager")({
  beforeLoad: () => {
    const session = getEcoSession();
    if (!session || session.role !== "ESG_MANAGER") {
      throw redirect({ to: "/login", search: { redirect: "/manager" } });
    }
  },
  head: () => ({
    meta: [{ title: "ESG Manager — EcoSphere" }],
  }),
  component: EsgManagerPage,
});

function EsgManagerPage() {
  return (
    <EcoPage>
      <EsgManagerConsole />
    </EcoPage>
  );
}
