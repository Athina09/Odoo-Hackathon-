import { createFileRoute } from "@tanstack/react-router";
import { EsgManagerConsole } from "@/components/ecosphere/manager/EsgManagerConsole";
import { EcoPage } from "@/components/ecosphere/EcoPage";
import { requireRole } from "@/lib/ecosphere-route-guards";

export const Route = createFileRoute("/manager")({
  beforeLoad: () => {
    requireRole("ESG_MANAGER", "/manager");
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
