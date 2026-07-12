import { redirect } from "@tanstack/react-router";
import type { EcoRole } from "@/data/ecosphere-mock";
import { getEcoSession, getHomeRouteForRole, type EcoSessionUser } from "@/lib/ecosphere-auth";

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
