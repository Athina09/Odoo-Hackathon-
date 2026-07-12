import type { ReactNode } from "react";
import { KpiCard } from "./KpiCard";
import { AiInsightsCard } from "./AiInsightsCard";
import type { FeedInsight, KpiCardProps } from "./types";

export function ModuleDashboard({
  breadcrumb,
  title,
  kpis,
  mainPanel,
  insights,
  table,
  insightsTitle,
}: {
  breadcrumb: string;
  title: string;
  kpis: KpiCardProps[];
  mainPanel: ReactNode;
  insights: FeedInsight[];
  table: ReactNode;
  insightsTitle?: string;
}) {
  return (
    <div className="space-y-4 p-6">
      <div>
        <p className="text-[13px] text-[var(--eco-text-secondary)]">{breadcrumb}</p>
        <h1 className="mt-1 text-2xl font-bold text-[var(--eco-text-primary)]">{title}</h1>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {kpis.map(kpi => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">{mainPanel}</div>
        <AiInsightsCard insights={insights} title={insightsTitle} />
      </div>

      {table}
    </div>
  );
}
