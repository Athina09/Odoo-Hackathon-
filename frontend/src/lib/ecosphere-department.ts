import type { EcoAdminConfig } from "@/lib/ecosphere-config-store";
import type { DepartmentRow } from "@/data/ecosphere";
import { departments as departmentPerformance } from "@/data/ecosphere";

const deptNameAliases: Record<string, string[]> = {
  DEP001: ["Manufacturing", "mfg"],
  DEP002: ["Human Resources", "HR", "hr"],
  DEP003: ["Finance", "fin"],
  DEP004: ["Operations", "ops"],
  DEP005: ["Fleet", "Logistics"],
  DEP006: ["Sales", "Marketing"],
  DEP007: ["IT", "it"],
};

export function getDepartmentPerformance(
  departmentId: string | undefined,
  departmentName: string | undefined,
  config: EcoAdminConfig,
): DepartmentRow | null {
  const dept = config.departments.find(d => d.id === departmentId);
  const name = departmentName ?? dept?.name ?? "";
  const aliases = departmentId ? deptNameAliases[departmentId] ?? [name] : [name];

  return (
    departmentPerformance.find(row =>
      aliases.some(alias => row.department.toLowerCase().includes(alias.toLowerCase())),
    ) ?? null
  );
}

export function getDepartmentEmployees(config: EcoAdminConfig, departmentId: string) {
  return config.employees.filter(e => e.departmentId === departmentId);
}
