import { createFileRoute } from "@tanstack/react-router";
import { EnvironmentCaseTable } from "@/components/ecosphere/EnvironmentCaseTable";
import { EcoPage } from "@/components/ecosphere/EcoPage";
import { requireSession } from "@/lib/ecosphere-route-guards";

export const Route = createFileRoute("/environment")({
  beforeLoad: () => {
    requireSession("/environment");
  },
  head: () => ({
    meta: [
      { title: "Environment — EcoSphere" },
      { name: "description", content: "Browse all environmental compliance cases." },
    ],
  }),
  component: EnvironmentPage,
});

function EnvironmentPage() {
  return (
    <EcoPage>
      <div className="space-y-4 p-5">
        <h1 className="text-2xl font-semibold text-foreground">All Cases</h1>
        <EnvironmentCaseTable />
      </div>
    </EcoPage>
  );
}
