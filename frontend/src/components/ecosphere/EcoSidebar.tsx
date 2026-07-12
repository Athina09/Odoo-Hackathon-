import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Leaf,
  Shield,
  Sparkles,
  FileBarChart,
  Crown,
  LogIn,
  LogOut,
  Building2,
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

function navForRole(role: EcoRole | undefined): NavItem[] {
  if (role === "DEPARTMENT_MANAGER") {
    return [
      {
        to: "/ecosphere/department",
        label: "Dept Dashboard",
        icon: Building2,
        match: p => p.startsWith("/ecosphere/department"),
      },
    ];
  }

  if (role === "ESG_MANAGER") {
    return [
      {
        to: "/ecosphere/manager",
        label: "ESG Hub",
        icon: Shield,
        match: p => p.startsWith("/ecosphere/manager"),
      },
      {
        to: "/ecosphere",
        label: "Org Overview",
        icon: LayoutDashboard,
        match: p => p === "/ecosphere" || p === "/ecosphere/",
      },
      {
        to: "/ecosphere/environment",
        label: "Environment",
        icon: Leaf,
        match: p => p.startsWith("/ecosphere/environment"),
      },
      {
        to: "/ecosphere/manager",
        label: "AI Insights",
        icon: Sparkles,
        match: () => false,
      },
      {
        to: "/ecosphere/manager",
        label: "Reports",
        icon: FileBarChart,
        match: () => false,
      },
    ];
  }

  return [
    {
      to: "/ecosphere",
      label: "Command Center",
      icon: LayoutDashboard,
      match: p => p === "/ecosphere" || p === "/ecosphere/",
    },
    {
      to: "/ecosphere/environment",
      label: "Environment",
      icon: Leaf,
      match: p => p.startsWith("/ecosphere/environment"),
    },
  ];
}

const roleLabels: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  ESG_MANAGER: "ESG Manager",
  DEPARTMENT_MANAGER: "Dept Manager",
};

export function EcoSidebar() {
  const path = useRouterState({ select: s => s.location.pathname });
  const { user, isSuperAdmin, logout } = useEcoAuth();
  const items = navForRole(user?.role);

  return (
    <aside className="z-20 flex w-[68px] shrink-0 flex-col items-center justify-between border-r border-sidebar-border bg-sidebar py-4 shadow-sm">
      <div className="flex flex-col items-center gap-2">
        <Link
          to={user?.role === "DEPARTMENT_MANAGER" ? "/ecosphere/department" : user?.role === "ESG_MANAGER" ? "/ecosphere/manager" : "/ecosphere"}
          className="group relative mb-3 grid h-10 w-10 place-items-center rounded-lg border border-primary/25 bg-primary/10"
        >
          <Leaf className="h-5 w-5 text-primary" />
        </Link>

        {items.map(({ to, label, icon: Icon, match }) => {
          const active = match(path);
          return (
            <Link key={label} to={to} className="group relative">
              <motion.div
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className={[
                  "grid h-10 w-10 place-items-center rounded-lg border transition-colors",
                  active
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-transparent text-muted-foreground hover:border-border hover:bg-secondary hover:text-foreground",
                ].join(" ")}
              >
                <Icon className="h-[18px] w-[18px]" />
              </motion.div>
              <span className="pointer-events-none absolute left-12 top-1/2 z-50 -translate-y-1/2 whitespace-nowrap rounded-md border border-border bg-popover px-2 py-1 text-sm opacity-0 shadow-lg transition group-hover:opacity-100">
                {label}
              </span>
            </Link>
          );
        })}

        {isSuperAdmin && (
          <Link to="/ecosphere/admin" className="group relative">
            <motion.div
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className={[
                "grid h-10 w-10 place-items-center rounded-lg border transition-colors",
                path.startsWith("/ecosphere/admin")
                  ? "border-warn/40 bg-warn/10 text-warn"
                  : "border-transparent text-muted-foreground hover:border-border hover:bg-warn/10 hover:text-warn",
              ].join(" ")}
            >
              <Crown className="h-[18px] w-[18px]" />
            </motion.div>
            <span className="pointer-events-none absolute left-12 top-1/2 z-50 -translate-y-1/2 whitespace-nowrap rounded-md border border-border bg-popover px-2 py-1 text-sm opacity-0 shadow-lg transition group-hover:opacity-100">
              Super Admin
            </span>
          </Link>
        )}
      </div>

      <div className="flex flex-col items-center gap-2">
        <Link to="/" className="mb-1 text-[10px] uppercase tracking-widest text-muted-foreground transition hover:text-primary">
          AEGIS
        </Link>
        {user ? (
          <button
            type="button"
            onClick={logout}
            className="grid h-10 w-10 place-items-center rounded-full border border-border bg-secondary text-sidebar-foreground"
            title={`${user.name} · ${roleLabels[user.role] ?? user.role} · Sign out`}
          >
            <LogOut className="h-4 w-4" />
          </button>
        ) : (
          <Link
            to="/ecosphere/login"
            className="grid h-10 w-10 place-items-center rounded-full border border-border bg-secondary text-muted-foreground transition hover:text-primary"
            title="Sign in"
          >
            <LogIn className="h-4 w-4" />
          </Link>
        )}
      </div>
    </aside>
  );
}
