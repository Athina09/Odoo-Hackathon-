import { useMemo } from "react";
import { useEcoAuth } from "@/context/EcoAuthContext";
import { getDepartmentEmployees, getDepartmentPerformance } from "@/lib/ecosphere-department";
import { ApprovalQueuePanel } from "@/components/ecosphere/ApprovalQueuePanel";
import { Button } from "@/components/ui/button";
import { AlertTriangle, FileDown, Users, Gauge, Cloud } from "lucide-react";

export function DepartmentManagerConsole() {
  const { user, config } = useEcoAuth();

  const performance = useMemo(
    () => getDepartmentPerformance(user?.departmentId, user?.departmentName, config),
    [user, config],
  );

  const team = useMemo(
    () => (user?.departmentId ? getDepartmentEmployees(config, user.departmentId) : []),
    [user, config],
  );

  const dept = config.departments.find(d => d.id === user?.departmentId);

  return (
    <div className="space-y-6 p-5 pb-10">
      <header className="mx-auto max-w-5xl border-b border-border/40 pb-5">
        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Department Manager</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
          {user?.departmentName ?? dept?.name ?? "Department"} Dashboard
        </h1>
        <p className="mt-1 text-base text-muted-foreground">
          Track emissions, ESG score, employee participation, and compliance for your department.
        </p>
      </header>

      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3 lg:grid-cols-4">
        <Metric icon={Gauge} label="Dept ESG score" value={performance?.esg ?? "—"} />
        <Metric icon={Cloud} label="Carbon risk" value={performance?.carbon ?? "—"} capitalize />
        <Metric icon={Users} label="Team size" value={team.length || dept?.employeeCount || 0} />
        <Metric icon={Gauge} label="AI confidence" value={performance ? `${performance.confidence}%` : "—"} />
      </div>

      <div className="mx-auto grid max-w-5xl gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-white p-5 shadow-sm">
          <h2 className="font-semibold">Department emissions</h2>
          <p className="mt-1 text-sm text-muted-foreground">Track carbon exposure and quarterly trend for your unit.</p>
          <div className="mt-4 space-y-3">
            <Bar label="Scope 1 (direct)" pct={performance?.carbon === "high" ? 78 : performance?.carbon === "medium" ? 52 : 28} />
            <Bar label="Scope 2 (energy)" pct={62} />
            <Bar label="Scope 3 (supply chain)" pct={45} />
          </div>
        </section>

        <section className="rounded-xl border border-border bg-white p-5 shadow-sm">
          <h2 className="font-semibold">ESG breakdown</h2>
          <p className="mt-1 text-sm text-muted-foreground">Environmental, social, and governance pillars.</p>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <Stat label="CSR score" value={performance?.csr} />
            <Stat label="Governance" value={performance?.governance} />
            <Stat label="Risk level" value={performance?.risk} capitalize />
            <Stat label="Status" value={performance?.status} capitalize />
          </dl>
        </section>
      </div>

      <section className="mx-auto max-w-5xl rounded-xl border border-border bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-semibold">Employee participation</h2>
            <p className="text-sm text-muted-foreground">Approve submissions and track challenge enrollment.</p>
          </div>
          <Button type="button" size="sm" variant="outline">
            Approve pending
          </Button>
        </div>
        <div className="mt-4">
          <ApprovalQueuePanel departmentOnly />
        </div>
        <table className="mt-4 w-full text-base">
          <thead>
            <tr className="border-b border-border/50 text-left text-sm text-muted-foreground">
              <th className="pb-2 font-medium">Employee</th>
              <th className="pb-2 font-medium">Role</th>
              <th className="pb-2 font-medium">CSR status</th>
              <th className="pb-2 font-medium" />
            </tr>
          </thead>
          <tbody>
            {team.map(emp => (
              <tr key={emp.id} className="border-b border-border/30">
                <td className="py-2.5">{emp.name}</td>
                <td className="py-2.5 text-muted-foreground">{emp.role.replace("_", " ")}</td>
                <td className="py-2.5">
                  <span className="rounded-md border border-success/30 bg-success/10 px-2 py-0.5 text-xs text-success">
                    Active
                  </span>
                </td>
                <td className="py-2.5 text-right">
                  <Button type="button" size="sm" variant="ghost" className="h-8">
                    Review
                  </Button>
                </td>
              </tr>
            ))}
            {team.length === 0 && (
              <tr>
                <td colSpan={4} className="py-6 text-center text-muted-foreground">
                  No employees in this department yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <section className="mx-auto max-w-5xl rounded-xl border border-border bg-white p-5 shadow-sm">
        <h2 className="font-semibold">Department compliance</h2>
        <p className="mt-1 text-sm text-muted-foreground">Raise issues scoped to your department.</p>
        <div className="mt-4 space-y-2">
          {["Overdue safety audit", "Waste segregation gap", "Training completion below target"].map(issue => (
            <div
              key={issue}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/50 p-3"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-warn" />
                <span>{issue}</span>
              </div>
              <Button type="button" size="sm" variant="outline">
                Raise issue
              </Button>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl rounded-xl border border-border bg-white p-5 shadow-sm">
        <h2 className="font-semibold">Department reports</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {["Monthly emissions", "Team CSR summary", "Compliance status"].map(title => (
            <div key={title} className="flex items-center justify-between rounded-lg border border-border/50 p-4">
              <span className="font-medium">{title}</span>
              <Button type="button" size="sm" variant="outline" className="gap-1">
                <FileDown className="h-3.5 w-3.5" /> Export
              </Button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  capitalize,
}: {
  icon: typeof Gauge;
  label: string;
  value: string | number;
  capitalize?: boolean;
}) {
  const display = typeof value === "string" && capitalize ? value.charAt(0).toUpperCase() + value.slice(1) : value;
  return (
    <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <div className="mt-1 font-mono text-2xl font-semibold">{display}</div>
    </div>
  );
}

function Bar({ label, pct }: { label: string; pct: number }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span>{label}</span>
        <span className="text-muted-foreground">{pct}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-secondary">
        <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  capitalize,
}: {
  label: string;
  value?: string | number;
  capitalize?: boolean;
}) {
  const display =
    value === undefined
      ? "—"
      : typeof value === "string" && capitalize
        ? value.charAt(0).toUpperCase() + value.slice(1)
        : value;
  return (
    <div className="rounded-lg border border-border/40 p-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 font-semibold">{display}</dd>
    </div>
  );
}
