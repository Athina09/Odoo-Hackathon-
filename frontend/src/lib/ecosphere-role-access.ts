import type { EcoRole } from "@/data/ecosphere-mock";

/** Web dashboard roles — employees use /mobile only */
export const WEB_ROLES: EcoRole[] = ["SUPER_ADMIN", "ESG_MANAGER", "DEPARTMENT_MANAGER"];

export function isWebRole(role: EcoRole): boolean {
  return WEB_ROLES.includes(role);
}

export function isEmployeeRole(role: EcoRole): boolean {
  return role === "EMPLOYEE";
}

const SUPER_ADMIN_ROUTES = [
  "/",
  "/environment",
  "/social",
  "/governance",
  "/gamification",
  "/digital-twin",
  "/reports",
  "/settings",
  "/admin",
  "/manager",
  "/department",
];

const ESG_MANAGER_ROUTES = [
  "/",
  "/environment",
  "/social",
  "/governance",
  "/gamification",
  "/digital-twin",
  "/reports",
  "/manager",
];

const DEPARTMENT_MANAGER_ROUTES = ["/department", "/environment", "/social", "/governance", "/reports"];

const EMPLOYEE_ROUTES = ["/mobile"];

function normalizePath(path: string): string {
  if (path === "/") return "/";
  const base = path.split("?")[0].replace(/\/$/, "") || "/";
  if (base.startsWith("/mobile")) return "/mobile";
  return base;
}

export function canAccessRoute(role: EcoRole, path: string): boolean {
  const p = normalizePath(path);

  if (role === "EMPLOYEE") {
    return p === "/mobile" || p.startsWith("/mobile/");
  }

  if (role === "SUPER_ADMIN") {
    return SUPER_ADMIN_ROUTES.some(r => p === r || (r !== "/" && p.startsWith(r)));
  }

  if (role === "ESG_MANAGER") {
    return ESG_MANAGER_ROUTES.some(r => p === r || (r !== "/" && p.startsWith(r)));
  }

  if (role === "DEPARTMENT_MANAGER") {
    return DEPARTMENT_MANAGER_ROUTES.some(r => p === r || (r !== "/" && p.startsWith(r)));
  }

  return false;
}

export function getRoleBadgeLabel(
  role: EcoRole,
  departmentName?: string,
): string | null {
  switch (role) {
    case "SUPER_ADMIN":
      return "Super Admin";
    case "ESG_MANAGER":
      return "ESG Manager";
    case "DEPARTMENT_MANAGER":
      return departmentName ? `Department Manager — ${departmentName}` : "Department Manager";
    default:
      return null;
  }
}

export function getDashboardTitle(role: EcoRole): string {
  if (role === "ESG_MANAGER") return "ESG Performance Overview";
  return "ESG Command Dashboard";
}
