import { KpiCard, DataTable, HeatmapPanel, AiInsightsCard, StatusPill } from "@/components/ecosphere/ds";
import {
  socialKpis,
  csrHeatmapZones,
  socialInsights,
  csrActivityRows,
  contributorSpotlight,
  diversityByDepartment,
  type CsrActivityRow,
} from "@/data/ecosphere-modules";

import { DepartmentScopeBanner } from "@/components/ecosphere/DepartmentScopeBanner";

export function SocialDashboard() {
  return (
    <div className="space-y-4 p-6">
      <DepartmentScopeBanner />
      <div>
        <p className="text-[13px] text-[var(--eco-text-secondary)]">People → participation → inclusion</p>
        <h1 className="mt-1 text-2xl font-bold text-[var(--eco-text-primary)]">Social Dashboard</h1>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {socialKpis.map(kpi => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </div>

      <div>
        <div className="mb-2 text-xs font-semibold uppercase tracking-[0.05em] text-[var(--eco-text-secondary)]">
          Contributor Spotlight
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {contributorSpotlight.map(person => (
            <div key={person.id} className="eco-card min-w-[200px] shrink-0 p-4">
              <div className="mb-2 grid h-10 w-10 place-items-center rounded-full bg-[var(--eco-accent-teal-bg)] text-sm font-bold text-[var(--eco-accent-teal)]">
                {person.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div className="font-semibold text-[var(--eco-text-primary)]">{person.name}</div>
              <div className="text-[13px] text-[var(--eco-text-muted)]">{person.department}</div>
              <div className="mt-2 text-sm text-[var(--eco-text-secondary)]">{person.activity}</div>
              <div className="mt-1 text-sm font-bold text-[var(--eco-accent-teal)]">+{person.points} pts this month</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <HeatmapPanel
            label="CSR Participation Heatmap · Tamil Nadu"
            zones={csrHeatmapZones}
            height={400}
          />
        </div>
        <div className="eco-card p-4 lg:col-span-2">
          <div className="mb-2 text-xs font-semibold uppercase tracking-[0.05em] text-[var(--eco-text-secondary)]">
            Diversity Index by Department
          </div>
          <div className="space-y-3">
            {diversityByDepartment.map(row => (
              <div key={row.department}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className={row.department === "IT" ? "font-semibold text-[var(--eco-accent-red)]" : "text-[var(--eco-text-primary)]"}>
                    {row.department}
                    {row.department === "IT" ? " · needs attention" : ""}
                  </span>
                  <span className="font-semibold text-[var(--eco-accent-teal)]">{row.index.toFixed(2)}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[var(--eco-bg-page)]">
                  <div
                    className={`h-full rounded-full ${row.index < 0.5 ? "bg-[var(--eco-accent-red)]" : "bg-[var(--eco-accent-teal)]"}`}
                    style={{ width: `${row.index * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AiInsightsCard insights={socialInsights} />

      <DataTable<CsrActivityRow>
        title="CSR Activities"
        subtitle={`${csrActivityRows.length} activities`}
        rows={csrActivityRows}
        columns={[
          { key: "activity", header: "Activity", render: r => <span className="font-semibold">{r.activity}</span> },
          { key: "dept", header: "Department", render: r => r.department },
          { key: "participants", header: "Participants", render: r => r.participants },
          { key: "proof", header: "Proof Status", render: r => <StatusPill label={r.proofStatus} tone={r.proofStatus} /> },
          { key: "approval", header: "Approval", render: r => <StatusPill label={r.approval} tone={r.approval} /> },
          { key: "points", header: "Points", render: r => r.points },
          { key: "status", header: "Status", render: r => <StatusPill label={r.status} tone={r.status} /> },
        ]}
        onOpen={() => {}}
      />
    </div>
  );
}
