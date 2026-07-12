import { createFileRoute, redirect } from "@tanstack/react-router";
import { EcoKpiRow } from "@/components/ecosphere/EcoKpiRow";
import { EsgHeatmap } from "@/components/ecosphere/EsgHeatmap";
import { AiLiveFeed } from "@/components/ecosphere/AiLiveFeed";
import { DepartmentTable } from "@/components/ecosphere/DepartmentTable";
import { EcoChartsGrid, EsgHealthCard } from "@/components/ecosphere/EcoChartsGrid";
import { EcoPage } from "@/components/ecosphere/EcoPage";
import { useEcoAuth } from "@/context/EcoAuthContext";
import { getDashboardTitle } from "@/lib/ecosphere-role-access";
import { requireRouteAccess } from "@/lib/ecosphere-route-guards";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    const session = requireRouteAccess("/");
    if (session.role === "DEPARTMENT_MANAGER") {
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
      <HomePageContent />
    </EcoPage>
  );
}

function HomePageContent() {
  const { user } = useEcoAuth();
  const title = user ? getDashboardTitle(user.role) : "ESG Command Dashboard";
  const subtitle =
    user?.role === "ESG_MANAGER"
      ? "Org-wide ESG monitoring · approve CSR & challenges in Approval Hub"
      : "KPIs → Map → Live feed → Department performance";

  return (
    <div className="space-y-4 p-6">
        <div>
          <p className="text-[13px] text-[var(--eco-text-secondary)]">{subtitle}</p>
          <h1 className="mt-1 text-2xl font-bold text-[var(--eco-text-primary)]">{title}</h1>
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
  );
}
