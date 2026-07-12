import { departments } from "@/data/ecosphere";
import { ChevronRight } from "lucide-react";

const riskLabel: Record<string, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

const riskColor: Record<string, string> = {
  high: "bg-danger/15 text-danger border-danger/30",
  medium: "bg-warn/15 text-warn border-warn/30",
  low: "bg-success/15 text-success border-success/30",
};

const statusTone: Record<string, string> = {
  excellent: "bg-success/15 text-success border-success/30",
  good: "bg-primary/15 text-primary border-primary/30",
  watch: "bg-warn/15 text-warn border-warn/30",
  critical: "bg-danger/25 text-danger border-danger/50",
};

export function DepartmentTable() {
  return (
    <div className="glass overflow-hidden rounded-xl">
      <div className="flex items-center justify-between border-b border-border/40 px-4 py-3">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">Department Performance</div>
        <div className="text-xs text-muted-foreground">{departments.length} departments · ESG ranked</div>
      </div>
      <table className="w-full text-base">
        <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
          <tr className="[&>th]:px-4 [&>th]:py-2.5 [&>th]:font-medium">
            <th>Department</th>
            <th>ESG</th>
            <th>Carbon</th>
            <th>CSR</th>
            <th>Governance</th>
            <th>AI Conf.</th>
            <th>Risk</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody className="divide-y divide-border/40">
          {departments.map(row => (
            <tr key={row.id} className="group transition hover:bg-primary/5">
              <td className="px-4 py-3 font-medium">{row.department}</td>
              <td className="px-4 py-3 font-mono text-primary">{row.esg}</td>
              <td className="px-4 py-3 capitalize text-muted-foreground">{row.carbon}</td>
              <td className="px-4 py-3 font-mono text-muted-foreground">{row.csr}%</td>
              <td className="px-4 py-3 font-mono text-muted-foreground">{row.governance}%</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-20 overflow-hidden rounded bg-secondary">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-neon-2"
                      style={{ width: `${row.confidence}%` }}
                    />
                  </div>
                  <span className="font-mono text-sm">{row.confidence}%</span>
                </div>
              </td>
              <td className="px-4 py-3">
                <span className={`rounded-md border px-2 py-0.5 text-xs uppercase tracking-wider ${riskColor[row.risk]}`}>
                  {riskLabel[row.risk]}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className={`rounded-md border px-2 py-0.5 text-xs uppercase tracking-wider ${statusTone[row.status]}`}>
                  {row.status}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded-md border border-border bg-secondary px-2 py-1 text-sm text-muted-foreground transition group-hover:border-primary/40 group-hover:text-primary"
                >
                  Open <ChevronRight className="h-3 w-3" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
