import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Leaf,
  Shield,
  Users,
  Trophy,
  FileBarChart,
  Settings,
  Crown,
  LogIn,
  LogOut,
  Building2,
  Factory,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEcoAuth } from "@/context/EcoAuthContext";
import type { EcoRole } from "@/data/ecosphere-mock";

type NavItem = {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  match: (p: string) => boolean;
};

const commandCenter: NavItem = {
  to: "/",
  label: "Command Center",
  icon: LayoutDashboard,
  match: p => p === "/",
};

const deptDashboard: NavItem = {
  to: "/department",
  label: "Dashboard",
  icon: LayoutDashboard,
  match: p => p === "/department",
};

const environment: NavItem = {
  to: "/environment",
  label: "Environment",
  icon: Leaf,
  match: p => p.startsWith("/environment"),
};

const digitalTwin: NavItem = {
  to: "/digital-twin",
  label: "Digital Twin",
  icon: Factory,
  match: p => p.startsWith("/digital-twin"),
};

const social: NavItem = {
  to: "/social",
  label: "Social",
  icon: Users,
  match: p => p.startsWith("/social"),
};

const governance: NavItem = {
  to: "/governance",
  label: "Governance",
  icon: Shield,
  match: p => p.startsWith("/governance"),
};

const gamification: NavItem = {
  to: "/gamification",
  label: "Gamification",
  icon: Trophy,
  match: p => p.startsWith("/gamification"),
};

const reports: NavItem = {
  to: "/reports",
  label: "Reports",
  icon: FileBarChart,
  match: p => p.startsWith("/reports"),
};

const settings: NavItem = {
  to: "/settings",
  label: "Settings & Administration",
  icon: Settings,
  match: p => p.startsWith("/settings"),
};

function navForRole(role: EcoRole | undefined): NavItem[] {
  switch (role) {
    case "SUPER_ADMIN":
      return [
        commandCenter,
        environment,
        digitalTwin,
        social,
        governance,
        gamification,
        reports,
        settings,
      ];
    case "ESG_MANAGER":
      return [commandCenter, environment, digitalTwin, social, governance, gamification, reports];
    case "DEPARTMENT_MANAGER":
      return [deptDashboard, environment, social, governance, reports];
    default:
      return [commandCenter];
  }
}

const roleLabels: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  ESG_MANAGER: "ESG Manager",
  DEPARTMENT_MANAGER: "Dept Manager",
};

export function EcoSidebar() {
  const path = useRouterState({ select: s => s.location.pathname });
  const navigate = useNavigate();
  const { user, isSuperAdmin, logout } = useEcoAuth();
  const items = navForRole(user?.role);

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  const homeTo =
    user?.role === "DEPARTMENT_MANAGER"
      ? "/department"
      : user?.role === "ESG_MANAGER" || user?.role === "SUPER_ADMIN"
        ? "/"
        : "/";

  return (
    <aside className="z-20 flex w-14 shrink-0 flex-col items-center justify-between border-r border-sidebar-border bg-sidebar py-4">
      <div className="flex flex-col items-center gap-2">
        <Link
          to={homeTo}
          className="group relative mb-3 grid h-10 w-10 place-items-center rounded-full bg-[var(--eco-accent-teal-bg)]"
        >
          <Leaf className="h-5 w-5 text-[var(--eco-accent-teal)]" />
        </Link>

        {items.map(({ to, label, icon: Icon, match }) => {
          const active = match(path);
          return (
            <Link key={label} to={to} className="group relative">
              <motion.div
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className={[
                  "grid h-10 w-10 place-items-center rounded-full transition-colors",
                  active
                    ? "bg-[var(--eco-accent-teal-bg)] text-[var(--eco-accent-teal)]"
                    : "text-[var(--eco-text-secondary)] hover:bg-[var(--eco-bg-page)] hover:text-[var(--eco-text-primary)]",
                ].join(" ")}
              >
                <Icon className="h-[18px] w-[18px]" />
              </motion.div>
              <span className="pointer-events-none absolute left-12 top-1/2 z-50 -translate-y-1/2 whitespace-nowrap rounded-md border border-[var(--eco-border)] bg-white px-2 py-1 text-sm opacity-0 shadow-lg transition group-hover:opacity-100">
                {label}
              </span>
            </Link>
          );
        })}

        {isSuperAdmin && (
          <Link to="/admin" className="group relative">
            <motion.div
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className={[
                "grid h-10 w-10 place-items-center rounded-full transition-colors",
                path.startsWith("/admin")
                  ? "bg-[var(--eco-accent-amber-bg)] text-[var(--eco-accent-amber)]"
                  : "text-[var(--eco-text-secondary)] hover:bg-[var(--eco-accent-amber-bg)] hover:text-[var(--eco-accent-amber)]",
              ].join(" ")}
            >
              <Crown className="h-[18px] w-[18px]" />
            </motion.div>
            <span className="pointer-events-none absolute left-12 top-1/2 z-50 -translate-y-1/2 whitespace-nowrap rounded-md border border-[var(--eco-border)] bg-white px-2 py-1 text-sm opacity-0 shadow-lg transition group-hover:opacity-100">
              Super Admin
            </span>
          </Link>
        )}
      </div>

      <div className="flex flex-col items-center gap-2">
        {user ? (
          <button
            type="button"
            onClick={handleLogout}
            className="grid h-10 w-10 place-items-center rounded-full border border-[var(--eco-border)] bg-[var(--eco-bg-page)] text-[var(--eco-text-secondary)] transition hover:border-[var(--eco-accent-red)] hover:bg-[var(--eco-accent-red-bg)] hover:text-[var(--eco-accent-red)]"
            title={`${user.name} · ${roleLabels[user.role] ?? user.role} · Sign out`}
          >
            <LogOut className="h-4 w-4" />
          </button>
        ) : (
          <Link
            to="/login"
            className="grid h-10 w-10 place-items-center rounded-full border border-[var(--eco-border)] bg-[var(--eco-bg-page)] text-[var(--eco-text-secondary)] transition hover:text-[var(--eco-accent-teal)]"
            title="Sign in"
          >
            <LogIn className="h-4 w-4" />
          </Link>
        )}
      </div>
    </aside>
  );
}
