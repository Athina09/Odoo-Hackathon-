import { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { ChevronDown, ChevronRight } from "lucide-react";
import { KpiCard, AiInsightsCard, HeatmapPanel } from "@/components/ecosphere/ds";
import { DepartmentScopeBanner, useDepartmentFilter } from "@/components/ecosphere/DepartmentScopeBanner";
import {
  environmentalKpis,
  environmentalInsights,
  environmentHeatmapZones,
  emissionsTrendWithTarget,
  emissionSourceBreakdown,
  carbonTransactions,
  type CarbonTransaction,
} from "@/data/ecosphere-modules";

const tooltipStyle = {
  background: "var(--bg-card)",
  border: "1px solid var(--border)",
  borderRadius: "8px",
  fontSize: "12px",
};

function CarbonLedger({ rows }: { rows: CarbonTransaction[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="eco-card overflow-hidden">
      <div className="eco-card-header px-4 py-3 text-xs font-semibold uppercase tracking-[0.05em] text-[var(--eco-text-secondary)]">
        Carbon Transaction Ledger
      </div>
      <div className="divide-y divide-[var(--eco-border)]">
        {rows.map((tx: CarbonTransaction) => {
          const open = expanded === tx.id;
          return (
            <div key={tx.id}>
              <button
                type="button"
                onClick={() => setExpanded(open ? null : tx.id)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-[var(--eco-accent-teal-bg)]/30"
              >
                {open ? <ChevronDown className="h-4 w-4 text-[var(--eco-text-muted)]" /> : <ChevronRight className="h-4 w-4 text-[var(--eco-text-muted)]" />}
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-[var(--eco-text-primary)]">{tx.source} · {tx.department}</div>
                  <div className="text-[13px] text-[var(--eco-text-muted)]">{tx.date} · {tx.amount}</div>
                </div>
                <div className="text-sm font-bold text-[var(--eco-accent-purple)]">{tx.co2Kg.toLocaleString()} kg CO₂</div>
              </button>
              {open && (
                <div className="border-t border-[var(--eco-border)] bg-[var(--eco-bg-page)] px-4 py-3 pl-11 text-sm">
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div>
                      <span className="text-[var(--eco-text-secondary)]">Emission factor: </span>
                      <span className="font-medium">{tx.factor}</span>
                      <span className="text-[var(--eco-text-muted)]"> ({tx.factorValue})</span>
                    </div>
                    <div>
                      <span className="text-[var(--eco-text-secondary)]">Source record: </span>
                      <span className="font-medium">{tx.linkedRecord}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function EnvironmentalDashboard() {
  const deptFilter = useDepartmentFilter();
  const transactions = deptFilter
    ? carbonTransactions.filter(tx => tx.department === deptFilter)
    : carbonTransactions;

  return (
    <div className="space-y-4 p-6">
      <DepartmentScopeBanner />
      <div>
        <p className="text-[13px] text-[var(--eco-text-secondary)]">Trace sources → watch trends → audit transactions</p>
        <h1 className="mt-1 text-2xl font-bold text-[var(--eco-text-primary)]">Environmental Dashboard</h1>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {environmentalKpis.map(kpi => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </div>

      <HeatmapPanel
        label="Carbon Intensity Heatmap · Tamil Nadu"
        zones={environmentHeatmapZones}
        height={400}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="eco-card p-4 lg:col-span-3">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.05em] text-[var(--eco-text-secondary)]">
            Emissions Trend
          </div>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={emissionsTrendWithTarget}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fill: "var(--text-secondary)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--text-secondary)", fontSize: 11 }} axisLine={false} tickLine={false} width={36} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                <Line type="monotone" dataKey="actual" name="Actual tCO₂" stroke="var(--accent-teal)" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="target" name="Target" stroke="var(--accent-amber)" strokeWidth={2} strokeDasharray="6 4" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="eco-card p-4 lg:col-span-2">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.05em] text-[var(--eco-text-secondary)]">
            Emission Source Breakdown
          </div>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={emissionSourceBreakdown} layout="vertical" margin={{ left: 8 }}>
                <XAxis type="number" tick={{ fill: "#6B7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="source" tick={{ fill: "#6B7280", fontSize: 11 }} width={100} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="tco2" name="tCO₂" radius={[0, 4, 4, 0]}>
                  {emissionSourceBreakdown.map(entry => (
                    <Cell key={entry.source} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <AiInsightsCard insights={environmentalInsights} />
      <CarbonLedger rows={transactions} />
    </div>
  );
}
