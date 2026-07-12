import type { EcoRole } from "@/data/ecosphere-mock";
import type { EcoAdminConfig } from "@/lib/ecosphere-config-store";

export type PortalRole = "SUPER_ADMIN" | "ESG_MANAGER" | "DEPARTMENT_MANAGER";

export interface EcoSessionUser {
  id: string;
  name: string;
  email: string;
  role: EcoRole;
  departmentId?: string;
  departmentName?: string;
}

export interface PortalLoginAccount {
  id: string;
  name: string;
  email: string;
  role: PortalRole;
  departmentId?: string;
  departmentName?: string;
  passwordHint: string;
}

const SESSION_KEY = "ecosphere-session";

export const PORTAL_ROLE_PASSWORDS: Record<PortalRole, string> = {
  SUPER_ADMIN: "admin123",
  ESG_MANAGER: "manager",
  DEPARTMENT_MANAGER: "dept123",
};

export const demoLoginUsers = [
  {
    id: "USR001",
    email: "superadmin@ecosphere.in",
    password: PORTAL_ROLE_PASSWORDS.SUPER_ADMIN,
    name: "Priya Natarajan",
    role: "SUPER_ADMIN" as const,
  },
];

export function getEcoSession(): EcoSessionUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as EcoSessionUser;
  } catch {
    return null;
  }
}

export function setEcoSession(user: EcoSessionUser | null) {
  if (typeof window === "undefined") return;
  if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  else localStorage.removeItem(SESSION_KEY);
}

export function getHomeRouteForRole(role: EcoRole): string {
  switch (role) {
    case "SUPER_ADMIN":
      return "/ecosphere";
    case "ESG_MANAGER":
      return "/ecosphere/manager";
    case "DEPARTMENT_MANAGER":
      return "/ecosphere/department";
    default:
      return "/ecosphere";
  }
}

export function getPortalAccounts(config: EcoAdminConfig, role: PortalRole): PortalLoginAccount[] {
  if (role === "SUPER_ADMIN") {
    return demoLoginUsers.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: "SUPER_ADMIN",
      passwordHint: PORTAL_ROLE_PASSWORDS.SUPER_ADMIN,
    }));
  }

  if (role === "ESG_MANAGER") {
    return config.roleAssignments.esgManagers
      .map(m => {
        const emp = config.employees.find(e => e.id === m.employeeId);
        if (!emp) return null;
        return {
          id: emp.id,
          name: emp.name,
          email: emp.email,
          role: "ESG_MANAGER" as const,
          passwordHint: PORTAL_ROLE_PASSWORDS.ESG_MANAGER,
        };
      })
      .filter((a): a is PortalLoginAccount => a !== null);
  }

  return config.roleAssignments.departmentManagers
    .map(m => {
      const emp = config.employees.find(e => e.id === m.employeeId);
      const dept = config.departments.find(d => d.id === m.departmentId);
      if (!emp) return null;
      return {
        id: emp.id,
        name: emp.name,
        email: emp.email,
        role: "DEPARTMENT_MANAGER" as const,
        departmentId: m.departmentId,
        departmentName: dept?.name,
        passwordHint: PORTAL_ROLE_PASSWORDS.DEPARTMENT_MANAGER,
      };
    })
    .filter((a): a is PortalLoginAccount => a !== null);
}

export function authenticateEcoUser(
  email: string,
  password: string,
  expectedRole: PortalRole,
  config: EcoAdminConfig,
): EcoSessionUser | null {
  const normalized = email.trim().toLowerCase();
  const expectedPassword = PORTAL_ROLE_PASSWORDS[expectedRole];
  if (password !== expectedPassword) return null;

  if (expectedRole === "SUPER_ADMIN") {
    const match = demoLoginUsers.find(
      u => u.email.toLowerCase() === normalized && u.role === "SUPER_ADMIN",
    );
    if (!match) return null;
    return { id: match.id, name: match.name, email: match.email, role: "SUPER_ADMIN" };
  }

  if (expectedRole === "ESG_MANAGER") {
    const emp = config.employees.find(e => e.email.toLowerCase() === normalized);
    if (!emp) return null;
    const assigned = config.roleAssignments.esgManagers.some(m => m.employeeId === emp.id);
    if (!assigned) return null;
    return { id: emp.id, name: emp.name, email: emp.email, role: "ESG_MANAGER" };
  }

  const emp = config.employees.find(e => e.email.toLowerCase() === normalized);
  if (!emp) return null;
  const assignment = config.roleAssignments.departmentManagers.find(m => m.employeeId === emp.id);
  if (!assignment) return null;
  const dept = config.departments.find(d => d.id === assignment.departmentId);
  return {
    id: emp.id,
    name: emp.name,
    email: emp.email,
    role: "DEPARTMENT_MANAGER",
    departmentId: assignment.departmentId,
    departmentName: dept?.name,
  };
}