import type { EcoAdminConfig } from "@/lib/ecosphere-config-store";
import type { EcoEmployee } from "@/data/ecosphere-mock";

export function assignEsgManager(config: EcoAdminConfig, employeeId: string): EcoAdminConfig {
  const emp = config.employees.find(e => e.id === employeeId);
  if (!emp) return config;

  const employees = config.employees.map(e =>
    e.id === employeeId ? { ...e, role: "ESG_MANAGER" as const } : e,
  );

  const exists = config.roleAssignments.esgManagers.some(m => m.employeeId === employeeId);
  const esgManagers = exists
    ? config.roleAssignments.esgManagers.map(m =>
        m.employeeId === employeeId ? { ...m, name: emp.name } : m,
      )
    : [...config.roleAssignments.esgManagers, { employeeId, name: emp.name }];

  return {
    ...config,
    employees,
    roleAssignments: { ...config.roleAssignments, esgManagers },
  };
}

export function removeEsgManager(config: EcoAdminConfig, employeeId: string): EcoAdminConfig {
  const employees = config.employees.map(e =>
    e.id === employeeId && e.role === "ESG_MANAGER" ? { ...e, role: "EMPLOYEE" as const } : e,
  );
  return {
    ...config,
    employees,
    roleAssignments: {
      ...config.roleAssignments,
      esgManagers: config.roleAssignments.esgManagers.filter(m => m.employeeId !== employeeId),
    },
  };
}

export function assignDepartmentManager(
  config: EcoAdminConfig,
  departmentId: string,
  employeeId: string,
): EcoAdminConfig {
  const emp = config.employees.find(e => e.id === employeeId);
  if (!emp) return config;

  const employees = config.employees.map(e =>
    e.id === employeeId ? { ...e, role: "DEPARTMENT_MANAGER" as const, departmentId } : e,
  );

  const departments = config.departments.map(d =>
    d.id === departmentId ? { ...d, head: emp.name } : d,
  );

  const others = config.roleAssignments.departmentManagers.filter(m => m.departmentId !== departmentId);
  const departmentManagers = [
    ...others,
    { departmentId, employeeId, name: emp.name },
  ];

  return {
    ...config,
    employees,
    departments,
    roleAssignments: { ...config.roleAssignments, departmentManagers },
  };
}

export function removeDepartmentManager(config: EcoAdminConfig, departmentId: string): EcoAdminConfig {
  const assignment = config.roleAssignments.departmentManagers.find(m => m.departmentId === departmentId);
  const employees = assignment
    ? config.employees.map(e =>
        e.id === assignment.employeeId && e.role === "DEPARTMENT_MANAGER"
          ? { ...e, role: "EMPLOYEE" as const }
          : e,
      )
    : config.employees;

  const departments = config.departments.map(d =>
    d.id === departmentId ? { ...d, head: "" } : d,
  );

  return {
    ...config,
    employees,
    departments,
    roleAssignments: {
      ...config.roleAssignments,
      departmentManagers: config.roleAssignments.departmentManagers.filter(
        m => m.departmentId !== departmentId,
      ),
    },
  };
}

export function eligibleForEsgManager(employees: EcoEmployee[]) {
  return employees.filter(e => e.role === "EMPLOYEE" || e.role === "ESG_MANAGER");
}

export function eligibleForDeptManager(employees: EcoEmployee[]) {
  return employees.filter(e => e.role === "EMPLOYEE" || e.role === "DEPARTMENT_MANAGER");
}
