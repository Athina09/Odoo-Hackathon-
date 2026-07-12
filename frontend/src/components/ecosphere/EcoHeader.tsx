import { Link } from "@tanstack/react-router";
import { Search, Mic, Sparkles, Filter, ChevronDown, Bell, LogIn } from "lucide-react";
import { motion } from "framer-motion";
import { heatmapZones } from "@/data/data";
import { Button } from "@/components/ui/button";
import { useEcoAuth } from "@/context/EcoAuthContext";

export function EcoHeader() {
  const districts = heatmapZones.map(z => z.district);
  const { user, isSuperAdmin, isEsgManager, isDepartmentManager } = useEcoAuth();

  const roleBadge =
    user?.role === "SUPER_ADMIN"
      ? "Super Admin"
      : user?.role === "ESG_MANAGER"
        ? "ESG Manager"
        : user?.role === "DEPARTMENT_MANAGER"
          ? user.departmentName ?? "Dept Manager"
          : null;

  return (
    <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-border bg-white/95 px-5 py-3 shadow-sm backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <span className="font-mono text-base font-semibold tracking-[0.25em] text-foreground">ECOSPHERE</span>
        <span className="rounded-md border border-primary/25 bg-primary/10 px-1.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-primary">
          v1.0 · ESG-TN
        </span>
        {user && (
          <span className="rounded-md border border-border bg-secondary px-1.5 py-0.5 text-xs text-muted-foreground">
            {user.name}
            {roleBadge ? ` · ${roleBadge}` : ""}
          </span>
        )}
      </div>

      <div className="relative ml-4 flex-1 max-w-2xl">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          placeholder="Search employee, department, policy, challenge, audit, carbon…"
          className="h-10 w-full rounded-lg border border-border bg-white pl-9 pr-28 text-base outline-none placeholder:text-muted-foreground/70 focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
        />
        <div className="absolute right-1.5 top-1/2 flex -translate-y-1/2 items-center gap-1">
          <motion.button
            type="button"
            whileTap={{ scale: 0.95 }}
            className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-secondary hover:text-primary"
            aria-label="Voice search (demo)"
          >
            <Mic className="h-4 w-4" />
          </motion.button>
          <Button
            asChild
            type="button"
            variant="secondary"
            size="sm"
            className="h-7 gap-1 bg-primary/10 px-2 text-sm text-primary hover:bg-primary/15"
          >
            <Link to="/ecosphere">
              <Sparkles className="h-3.5 w-3.5" /> Ask EcoSphere
            </Link>
          </Button>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        {!user && (
          <Button asChild variant="secondary" size="sm" className="h-8 gap-1 text-sm">
            <Link to="/ecosphere/login" search={{ redirect: "/ecosphere/admin" }}>
              <LogIn className="h-3.5 w-3.5" /> Sign in
            </Link>
          </Button>
        )}
        {isSuperAdmin && (
          <Button asChild variant="secondary" size="sm" className="h-8 gap-1 border-warn/30 bg-warn/10 text-sm text-warn">
            <Link to="/ecosphere/admin">Administration</Link>
          </Button>
        )}
        {isEsgManager && (
          <Button asChild variant="secondary" size="sm" className="h-8 gap-1 text-sm">
            <Link to="/ecosphere/manager">ESG Hub</Link>
          </Button>
        )}
        {isDepartmentManager && (
          <Button asChild variant="secondary" size="sm" className="h-8 gap-1 text-sm">
            <Link to="/ecosphere/department">My Department</Link>
          </Button>
        )}
        <div className="flex items-center gap-1.5 rounded-md border border-border bg-secondary px-2 py-1">
          <Filter className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
          <select
            aria-label="Filter by district"
            defaultValue=""
            className="max-w-[9rem] cursor-pointer bg-transparent py-0.5 text-sm outline-none"
          >
            <option value="">All districts</option>
            {districts.map(d => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <ChevronDown className="h-3 w-3 shrink-0 text-muted-foreground" aria-hidden />
        </div>
        <select className="rounded-md border border-border bg-secondary px-2 py-1.5 text-sm">
          <option>All risk levels</option>
          <option>Critical</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
        <button
          type="button"
          className="relative grid h-9 w-9 place-items-center rounded-md border border-border bg-secondary hover:text-primary"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-danger animate-pulse-ring-danger" />
        </button>
      </div>
    </header>
  );
}
