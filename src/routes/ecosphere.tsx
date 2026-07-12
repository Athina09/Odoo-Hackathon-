import { createFileRoute } from "@tanstack/react-router";
import { EcoShell } from "@/components/ecosphere/EcoShell";
import { EcoKpiRow } from "@/components/ecosphere/EcoKpiRow";
import { EsgHeatmap } from "@/components/ecosphere/EsgHeatmap";
import { AiLiveFeed } from "@/components/ecosphere/AiLiveFeed";
import { DepartmentTable } from "@/components/ecosphere/DepartmentTable";
import { EcoChartsGrid, EsgHealthCard } from "@/components/ecosphere/EcoChartsGrid";

export const Route = createFileRoute("/ecosphere")({
  head: () => ({
    meta: [
      { title: "EcoSphere — Executive Command Center" },
      { name: "description", content: "ESG executive dashboard — KPIs, heatmap, AI insights, department performance." },
    ],
  }),
  component: EcoSpherePage,
});

function EcoSpherePage() {
  return (
    <EcoShell>
      <div className="space-y-5 p-5">
        <div>
          <h1 className="text-lg font-bold tracking-wide text-white">Executive Command Center</h1>
          <p className="text-xs text-slate-500">KPIs → Map → Live feed → Department performance</p>
        </div>

        <EcoKpiRow />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <EsgHeatmap />
          </div>
          <AiLiveFeed />
        </div>

        <DepartmentTable />

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
          <div className="xl:col-span-3">
            <EcoChartsGrid />
          </div>
          <EsgHealthCard />
        </div>
      </div>
    </EcoShell>
  );
}
