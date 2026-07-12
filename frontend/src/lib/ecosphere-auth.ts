import type { EcoRole } from "@/data/ecosphere-mock";
import {
  DEPARTMENT_FACILITY_MAP,
  getFacilityById,
} from "@/data/digital-twin";
import type { EcoAdminConfig } from "@/lib/ecosphere-config-store";

export type PortalRole = "SUPER_ADMIN" | "ESG_MANAGER" | "DEPARTMENT_MANAGER" | "EMPLOYEE";

export interface EcoSessionUser {
  id: string;
  name: string;
  email: string;
  role: EcoRole;
  departmentId?: string;
  departmentName?: string;
  factoryId?: string;
  facilityName?: string;
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
  EMPLOYEE: "employee",
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

function facilityForDepartment(departmentId?: string): { factoryId?: string; facilityName?: string } {
  if (!departmentId) return {};
  const factoryId = DEPARTMENT_FACILITY_MAP[departmentId];
  const facility = factoryId ? getFacilityById(factoryId) : undefined;
  return facility ? { factoryId: facility.id, facilityName: facility.name } : {};
}

function withFacility(session: EcoSessionUser): EcoSessionUser {
  if (session.factoryId) return session;
  if (session.role === "SUPER_ADMIN" || session.role === "ESG_MANAGER") {
    const hq = getFacilityById("FAC001");
    return hq ? { ...session, factoryId: hq.id, facilityName: hq.name } : session;
  }
  return { ...session, ...facilityForDepartment(session.departmentId) };
}

export function getHomeRouteForRole(role: EcoRole): string {
  switch (role) {
    case "SUPER_ADMIN":
    case "ESG_MANAGER":
      return "/";
    case "DEPARTMENT_MANAGER":
      return "/department";
    case "EMPLOYEE":
      return "/mobile";
    default:
      return "/login";
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

  if (role === "EMPLOYEE") {
    const managerIds = new Set([
      ...config.roleAssignments.esgManagers.map(m => m.employeeId),
      ...config.roleAssignments.departmentManagers.map(m => m.employeeId),
    ]);
    return config.employees
      .filter(e => e.role === "EMPLOYEE" && !managerIds.has(e.id))
      .map(emp => {
        const dept = config.departments.find(d => d.id === emp.departmentId);
        return {
          id: emp.id,
          name: emp.name,
          email: emp.email,
          role: "EMPLOYEE" as const,
          departmentId: emp.departmentId,
          departmentName: dept?.name,
          passwordHint: PORTAL_ROLE_PASSWORDS.EMPLOYEE,
        };
      });
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
    return withFacility({ id: match.id, name: match.name, email: match.email, role: "SUPER_ADMIN" });
  }

  if (expectedRole === "ESG_MANAGER") {
    const emp = config.employees.find(e => e.email.toLowerCase() === normalized);
    if (!emp) return null;
    const assigned = config.roleAssignments.esgManagers.some(m => m.employeeId === emp.id);
    if (!assigned) return null;
    return withFacility({ id: emp.id, name: emp.name, email: emp.email, role: "ESG_MANAGER" });
  }

  if (expectedRole === "EMPLOYEE") {
    const emp = config.employees.find(e => e.email.toLowerCase() === normalized);
    if (!emp || emp.role !== "EMPLOYEE") return null;
    const managerIds = new Set([
      ...config.roleAssignments.esgManagers.map(m => m.employeeId),
      ...config.roleAssignments.departmentManagers.map(m => m.employeeId),
    ]);
    if (managerIds.has(emp.id)) return null;
    const dept = config.departments.find(d => d.id === emp.departmentId);
    return {
      id: emp.id,
      name: emp.name,
      email: emp.email,
      role: "EMPLOYEE",
      departmentId: emp.departmentId,
      departmentName: dept?.name,
    };
  }

  const emp = config.employees.find(e => e.email.toLowerCase() === normalized);
  if (!emp) return null;
  const assignment = config.roleAssignments.departmentManagers.find(m => m.employeeId === emp.id);
  if (!assignment) return null;
  const dept = config.departments.find(d => d.id === assignment.departmentId);
  return withFacility({
    id: emp.id,
    name: emp.name,
    email: emp.email,
    role: "DEPARTMENT_MANAGER",
    departmentId: assignment.departmentId,
    departmentName: dept?.name,
  });
}