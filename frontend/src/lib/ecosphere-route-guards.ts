import { redirect } from "@tanstack/react-router";
import type { EcoRole } from "@/data/ecosphere-mock";
import { getEcoSession, getHomeRouteForRole, type EcoSessionUser } from "@/lib/ecosphere-auth";
import { canAccessRoute, isEmployeeRole } from "@/lib/ecosphere-role-access";

export function requireSession(returnTo: string): EcoSessionUser {
  const session = getEcoSession();
  if (!session) {
    throw redirect({ to: "/login", search: { redirect: returnTo } });
  }
  return session;
}

export function requireRole(roles: EcoRole | EcoRole[], returnTo: string): EcoSessionUser {
  const session = requireSession(returnTo);
  const allowed = Array.isArray(roles) ? roles : [roles];
  if (!allowed.includes(session.role)) {
    throw redirect({ to: getHomeRouteForRole(session.role) });
  }
  return session;
}

/** Block employees from web dashboard routes */
export function requireWebSession(returnTo: string): EcoSessionUser {
  const session = requireSession(returnTo);
  if (isEmployeeRole(session.role)) {
    throw redirect({ to: "/mobile" });
  }
  return session;
}

/** Enforce per-role route allowlist */
export function requireRouteAccess(returnTo: string): EcoSessionUser {
  const session = requireWebSession(returnTo);
  if (!canAccessRoute(session.role, returnTo)) {
    throw redirect({ to: getHomeRouteForRole(session.role) });
  }
  return session;
}

export function requireEmployee(returnTo: string): EcoSessionUser {
  const session = requireSession(returnTo);
  if (session.role !== "EMPLOYEE") {
    throw redirect({ to: getHomeRouteForRole(session.role) });
  }
  return session;
}

export function requireSuperAdmin(returnTo: string): EcoSessionUser {
  return requireRole("SUPER_ADMIN", returnTo);
}
