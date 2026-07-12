import { createFileRoute } from "@tanstack/react-router";
import { EnvironmentCaseTable } from "@/components/ecosphere/EnvironmentCaseTable";

export const Route = createFileRoute("/ecosphere/environment")({
  head: () => ({
    meta: [
      { title: "All Cases — EcoSphere Environment" },
      { name: "description", content: "Browse all environmental compliance cases." },
    ],
  }),
  component: EnvironmentPage,
});

function EnvironmentPage() {
  return (
    <div className="space-y-4 p-5">
      <h1 className="text-2xl font-semibold text-foreground">All Cases</h1>
      <EnvironmentCaseTable />
    </div>
  );
}
