import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useEcoAuth } from "@/context/EcoAuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  assignDepartmentManager,
  assignEsgManager,
  eligibleForDeptManager,
  eligibleForEsgManager,
  removeDepartmentManager,
  removeEsgManager,
} from "@/lib/ecosphere-assignments";
import type { EcoDepartment, EcoEmployee } from "@/data/ecosphere-mock";
import { Plus, X, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

const selectClass =
  "h-10 w-full rounded-lg border border-border bg-white px-3 text-base text-foreground outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/15";

export function RoleAssignmentsPanel() {
  const { config, updateConfig } = useEcoAuth();
  const [esgId, setEsgId] = useState("");
  const [deptId, setDeptId] = useState(config.departments[0]?.id ?? "");
  const [managerId, setManagerId] = useState("");

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="flex flex-wrap items-center justify-end gap-2 text-base">
        <Button asChild variant="ghost" size="sm" className="h-8 gap-1.5 text-muted-foreground">
          <Link to="/">
            Dashboard <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>

      {/* Assign roles */}
      <Section title="Assign roles" description="Pick people for ESG and department leadership.">
        <div className="grid gap-6 md:grid-cols-2">
          <AssignBlock label="ESG manager">
            <div className="flex gap-2">
              <label className="sr-only" htmlFor="esg-select">
                ESG manager
              </label>
              <select
                id="esg-select"
                className={selectClass}
                value={esgId}
                onChange={e => setEsgId(e.target.value)}
              >
                <option value="">Choose employee</option>
                {eligibleForEsgManager(config.employees).map(e => (
                  <option key={e.id} value={e.id}>
                    {e.name}
                  </option>
                ))}
              </select>
              <Button
                type="button"
                className="shrink-0"
                disabled={!esgId}
                onClick={() => {
                  updateConfig(c => assignEsgManager(c, esgId));
                  setEsgId("");
                }}
              >
                Assign
              </Button>
            </div>
            <ChipList
              items={config.roleAssignments.esgManagers.map(m => ({ id: m.employeeId, label: m.name }))}
              empty="None assigned"
              onRemove={id => updateConfig(c => removeEsgManager(c, id))}
            />
          </AssignBlock>

          <AssignBlock label="Department manager">
            <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
              <label className="sr-only" htmlFor="dept-select">
                Department
              </label>
              <select
                id="dept-select"
                className={selectClass}
                value={deptId}
                onChange={e => setDeptId(e.target.value)}
              >
                {config.departments.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
              <select
                aria-label="Manager"
                className={selectClass}
                value={managerId}
                onChange={e => setManagerId(e.target.value)}
              >
                <option value="">Choose manager</option>
                {eligibleForDeptManager(config.employees).map(e => (
                  <option key={e.id} value={e.id}>
                    {e.name}
                  </option>
                ))}
              </select>
              <Button
                type="button"
                className="shrink-0"
                disabled={!deptId || !managerId}
                onClick={() => {
                  updateConfig(c => assignDepartmentManager(c, deptId, managerId));
                  setManagerId("");
                }}
              >
                Assign
              </Button>
            </div>
            <ChipList
              items={config.roleAssignments.departmentManagers.map(m => {
                const dept = config.departments.find(d => d.id === m.departmentId);
                return { id: m.departmentId, label: `${dept?.name ?? "Dept"} → ${m.name}` };
              })}
              empty="None assigned"
              onRemove={id => updateConfig(c => removeDepartmentManager(c, id))}
            />
          </AssignBlock>
        </div>
      </Section>

      {/* Departments */}
      <Section
        title="Departments"
        description="Create and edit departments."
        action={
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 gap-1"
            onClick={() => {
              const next: EcoDepartment = {
                id: `DEP${String(config.departments.length + 1).padStart(3, "0")}`,
                name: "New department",
                head: "",
                employeeCount: 0,
              };
              updateConfig({ departments: [...config.departments, next] });
            }}
          >
            <Plus className="h-3.5 w-3.5" /> Add
          </Button>
        }
      >
        <div className="overflow-hidden rounded-lg border border-border/50">
          <table className="w-full text-base">
            <thead>
              <tr className="border-b border-border/50 bg-muted/30 text-left text-sm font-medium text-muted-foreground">
                <th className="px-4 py-3">Name</th>
                <th className="hidden px-4 py-3 sm:table-cell">Head</th>
                <th className="px-4 py-3 w-24">Staff</th>
                <th className="px-4 py-3 w-12" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {config.departments.map((dep, i) => (
                <tr key={dep.id} className="hover:bg-muted/20">
                  <td className="px-4 py-2">
                    <Input
                      aria-label="Department name"
                      className="h-9 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
                      value={dep.name}
                      onChange={e => {
                        const departments = [...config.departments];
                        departments[i] = { ...dep, name: e.target.value };
                        updateConfig({ departments });
                      }}
                    />
                  </td>
                  <td className="hidden px-4 py-2 sm:table-cell">
                    <Input
                      aria-label="Department head"
                      className="h-9 border-0 bg-transparent px-0 text-muted-foreground shadow-none focus-visible:ring-0"
                      value={dep.head}
                      onChange={e => {
                        const departments = [...config.departments];
                        departments[i] = { ...dep, head: e.target.value };
                        updateConfig({ departments });
                      }}
                    />
                  </td>
                  <td className="px-4 py-2">
                    <Input
                      aria-label="Staff count"
                      type="number"
                      className="h-9 w-20 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
                      value={dep.employeeCount}
                      onChange={e => {
                        const departments = [...config.departments];
                        departments[i] = { ...dep, employeeCount: Number(e.target.value) };
                        updateConfig({ departments });
                      }}
                    />
                  </td>
                  <td className="px-4 py-2">
                    <button
                      type="button"
                      aria-label={`Remove ${dep.name}`}
                      className="rounded p-1 text-muted-foreground hover:bg-danger/10 hover:text-danger"
                      onClick={() =>
                        updateConfig({ departments: config.departments.filter((_, j) => j !== i) })
                      }
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Employees */}
      <Section
        title="Team"
        description="Manage employees and their roles."
        action={
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 gap-1"
            onClick={() => {
              const next: EcoEmployee = {
                id: `EMP${String(config.employees.length + 1).padStart(3, "0")}`,
                name: "New employee",
                email: "new@ecosphere.in",
                departmentId: config.departments[0]?.id ?? "DEP001",
                role: "EMPLOYEE",
              };
              updateConfig({ employees: [...config.employees, next] });
            }}
          >
            <Plus className="h-3.5 w-3.5" /> Add
          </Button>
        }
      >
        <div className="overflow-x-auto rounded-lg border border-border/50">
          <table className="w-full min-w-[560px] text-base">
            <thead>
              <tr className="border-b border-border/50 bg-muted/30 text-left text-sm font-medium text-muted-foreground">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Role</th>
                <th className="w-12 px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {config.employees.map((emp, i) => (
                <tr key={emp.id} className="hover:bg-muted/20">
                  <td className="px-4 py-2">
                    <Input
                      aria-label="Name"
                      className="h-9 min-w-[120px] border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
                      value={emp.name}
                      onChange={e => patchEmployee(i, { name: e.target.value }, config, updateConfig)}
                    />
                  </td>
                  <td className="px-4 py-2">
                    <Input
                      aria-label="Email"
                      className="h-9 min-w-[160px] border-0 bg-transparent px-0 text-muted-foreground shadow-none focus-visible:ring-0"
                      value={emp.email}
                      onChange={e => patchEmployee(i, { email: e.target.value }, config, updateConfig)}
                    />
                  </td>
                  <td className="px-4 py-2">
                    <select
                      aria-label="Department"
                      className={cn(selectClass, "h-9 min-w-[130px] border-0 bg-transparent py-0")}
                      value={emp.departmentId}
                      onChange={e => patchEmployee(i, { departmentId: e.target.value }, config, updateConfig)}
                    >
                      {config.departments.map(d => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <select
                      aria-label="Role"
                      className={cn(selectClass, "h-9 min-w-[140px] border-0 bg-transparent py-0")}
                      value={emp.role}
                      onChange={e =>
                        patchEmployee(i, { role: e.target.value as EcoEmployee["role"] }, config, updateConfig)
                      }
                    >
                      {config.roles.map(r => (
                        <option key={r} value={r}>
                          {r.replace(/_/g, " ")}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <button
                      type="button"
                      aria-label={`Remove ${emp.name}`}
                      className="rounded p-1 text-muted-foreground hover:bg-danger/10 hover:text-danger"
                      onClick={() =>
                        updateConfig({ employees: config.employees.filter((_, j) => j !== i) })
                      }
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}

function Section({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          {description && <p className="mt-0.5 text-base text-muted-foreground">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function AssignBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border/50 bg-card/40 p-4">
      <h3 className="mb-3 text-base font-medium text-foreground">{label}</h3>
      {children}
    </div>
  );
}

function ChipList({
  items,
  empty,
  onRemove,
}: {
  items: { id: string; label: string }[];
  empty: string;
  onRemove: (id: string) => void;
}) {
  if (items.length === 0) {
    return <p className="mt-3 text-base text-muted-foreground">{empty}</p>;
  }
  return (
    <ul className="mt-3 flex flex-wrap gap-2">
      {items.map(item => (
        <li
          key={item.id}
          className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-muted/40 py-1 pl-3 pr-1 text-base"
        >
          {item.label}
          <button
            type="button"
            aria-label={`Remove ${item.label}`}
            className="rounded-full p-1 hover:bg-danger/15 hover:text-danger"
            onClick={() => onRemove(item.id)}
          >
            <X className="h-3 w-3" />
          </button>
        </li>
      ))}
    </ul>
  );
}

function patchEmployee(
  i: number,
  patch: Partial<EcoEmployee>,
  config: { employees: EcoEmployee[] },
  updateConfig: ReturnType<typeof useEcoAuth>["updateConfig"],
) {
  const employees = [...config.employees];
  employees[i] = { ...employees[i], ...patch };
  updateConfig({ employees });
}
