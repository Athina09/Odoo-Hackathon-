import { KpiCard, AiInsightsCard, StatusPill, HeatmapPanel } from "@/components/ecosphere/ds";
import { DepartmentScopeBanner, useDepartmentFilter } from "@/components/ecosphere/DepartmentScopeBanner";
import {
  governanceKpis,
  governanceInsights,
  governanceKanbanCards,
  governanceHeatmapZones,
  policyAckProgress,
  auditScoresByDepartment,
  type GovernanceKanbanCard,
  type KanbanColumn,
} from "@/data/ecosphere-modules";

const kanbanColumns: { key: KanbanColumn; label: string }[] = [
  { key: "open", label: "Open" },
  { key: "review", label: "Under Review" },
  { key: "resolved", label: "Resolved" },
];

function KanbanCard({ card }: { card: GovernanceKanbanCard }) {
  return (
    <div className="eco-card p-3">
      <div className="font-medium text-[var(--eco-text-primary)]">{card.title}</div>
      <div className="mt-1 text-[13px] text-[var(--eco-text-muted)]">{card.department}</div>
      <div className="mt-2 flex items-center justify-between gap-2">
        <StatusPill label={card.severity} tone={card.severity} />
        <div className="flex items-center gap-1.5">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-[var(--eco-accent-blue-bg)] text-[10px] font-bold text-[var(--eco-accent-blue)]">
            {card.ownerInitials}
          </span>
          <span className="text-xs text-[var(--eco-text-secondary)]">{card.owner}</span>
        </div>
      </div>
      <div className={`mt-2 text-xs ${card.daysOverdue > 0 ? "font-semibold text-[var(--eco-accent-red)]" : "text-[var(--eco-text-muted)]"}`}>
        Due {card.dueDate}{card.daysOverdue > 0 ? ` · ${card.daysOverdue}d overdue` : ""}
      </div>
    </div>
  );
}

export function GovernanceDashboard() {
  const deptFilter = useDepartmentFilter();
  const cards = deptFilter
    ? governanceKanbanCards.filter(c => c.department === deptFilter)
    : governanceKanbanCards;
  const policyRows = deptFilter
    ? policyAckProgress.filter(r => r.department === deptFilter)
    : policyAckProgress;
  const auditRows = deptFilter
    ? auditScoresByDepartment.filter(r => r.department === deptFilter)
    : auditScoresByDepartment;

  return (
    <div className="space-y-4 p-6">
      <DepartmentScopeBanner />
      <div>
        <p className="text-[13px] text-[var(--eco-text-secondary)]">Open issues → ownership → overdue tracking</p>
        <h1 className="mt-1 text-2xl font-bold text-[var(--eco-text-primary)]">Governance Dashboard</h1>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {governanceKpis.map(kpi => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </div>

      <HeatmapPanel
        label="Compliance Risk Heatmap · Tamil Nadu"
        zones={governanceHeatmapZones}
        height={400}
      />

      <div>
        <div className="mb-3 text-xs font-semibold uppercase tracking-[0.05em] text-[var(--eco-text-secondary)]">
          Compliance Issues
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {kanbanColumns.map(col => (
            <div key={col.key} className="eco-card p-3">
              <div className="mb-3 text-sm font-semibold text-[var(--eco-text-primary)]">{col.label}</div>
              <div className="space-y-3">
                {cards
                  .filter(c => c.column === col.key)
                  .map(card => (
                    <KanbanCard key={card.id} card={card} />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="eco-card p-4">
        <div className="mb-4 text-xs font-semibold uppercase tracking-[0.05em] text-[var(--eco-text-secondary)]">
          Policy Acknowledgement Progress
        </div>
        <div className="space-y-3">
          {policyRows.map(row => (
            <div key={row.department}>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-[var(--eco-text-primary)]">{row.department}</span>
                <span className="font-semibold text-[var(--eco-accent-teal)]">{row.percent}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[var(--eco-bg-page)]">
                <div
                  className="h-full rounded-full bg-[var(--eco-accent-teal)]"
                  style={{ width: `${row.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="eco-card p-4">
        <div className="mb-4 text-xs font-semibold uppercase tracking-[0.05em] text-[var(--eco-text-secondary)]">
          Audit Scores by Department
        </div>
        <div className="space-y-3">
          {auditRows.map(row => (
            <div key={row.department}>
              <div className="mb-1 flex justify-between text-sm">
                <span className={row.score < 70 ? "font-semibold text-[var(--eco-accent-red)]" : "text-[var(--eco-text-primary)]"}>
                  {row.department}
                </span>
                <span className={`font-semibold ${row.score >= 90 ? "text-[var(--eco-accent-green)]" : row.score < 70 ? "text-[var(--eco-accent-red)]" : "text-[var(--eco-accent-amber)]"}`}>
                  {row.score}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[var(--eco-bg-page)]">
                <div
                  className={`h-full rounded-full ${row.score >= 90 ? "bg-[var(--eco-accent-green)]" : row.score < 70 ? "bg-[var(--eco-accent-red)]" : "bg-[var(--eco-accent-amber)]"}`}
                  style={{ width: `${row.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <AiInsightsCard insights={governanceInsights} />
    </div>
  );
}
