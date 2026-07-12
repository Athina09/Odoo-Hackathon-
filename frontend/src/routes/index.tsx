import { createFileRoute, redirect } from "@tanstack/react-router";
import { EcoKpiRow } from "@/components/ecosphere/EcoKpiRow";
import { EsgHeatmap } from "@/components/ecosphere/EsgHeatmap";
import { AiLiveFeed } from "@/components/ecosphere/AiLiveFeed";
import { DepartmentTable } from "@/components/ecosphere/DepartmentTable";
import { EcoChartsGrid, EsgHealthCard } from "@/components/ecosphere/EcoChartsGrid";
import { EcoPage } from "@/components/ecosphere/EcoPage";
import { getEcoSession } from "@/lib/ecosphere-auth";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    const session = getEcoSession();
    if (session?.role === "DEPARTMENT_MANAGER") {
      throw redirect({ to: "/department" });
    }
  },
  head: () => ({
    meta: [
      { title: "EcoSphere — ESG Command Center" },
      { name: "description", content: "ESG executive dashboard — KPIs, heatmap, AI insights, department performance." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <EcoPage>
      <div className="space-y-5 p-5">
        <div>
          <h1 className="text-2xl font-bold tracking-wide text-foreground">ESG Command Dashboard</h1>
          <p className="text-sm text-muted-foreground">KPIs → Map → Live feed → Department performance</p>
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
    </EcoPage>
  );
}
