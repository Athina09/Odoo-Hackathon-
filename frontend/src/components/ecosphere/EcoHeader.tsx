import { Link, useNavigate } from "@tanstack/react-router";
import { Search, Mic, Filter, ChevronDown, Bell, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { heatmapZones } from "@/data/data";
import { digitalTwinFacilities } from "@/data/digital-twin";
import { Button } from "@/components/ui/button";
import { useEcoAuth } from "@/context/EcoAuthContext";
import { getRoleBadgeLabel } from "@/lib/ecosphere-role-access";

export function EcoHeader() {
  const districts = heatmapZones.map(z => z.district);
  const navigate = useNavigate();
  const { user, isSuperAdmin, isEsgManager, isDepartmentManager, logout } = useEcoAuth();

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  const roleBadge = user ? getRoleBadgeLabel(user.role, user.departmentName) : null;
  const showDistrictFilter = isSuperAdmin || isEsgManager;
  const showFacilitySwitcher = isSuperAdmin;

  return (
    <header className="sticky top-0 z-10 flex h-16 flex-wrap items-center gap-x-3 gap-y-2 border-b border-[var(--border)] bg-[var(--bg-card)] px-6">
      <div className="flex min-w-0 shrink-0 items-center gap-2">
        <span className="font-mono text-base font-semibold tracking-[0.25em] text-foreground">ECOSPHERE</span>
        <span className="rounded-md border border-primary/25 bg-primary/10 px-1.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-primary">
          v1.0 · ESG-TN
        </span>
        {user && roleBadge && (
          <span
            className={`hidden max-w-[16rem] truncate rounded-md border px-1.5 py-0.5 text-xs sm:inline ${
              isSuperAdmin
                ? "border-warn/30 bg-warn/10 text-warn"
                : "border-border bg-secondary text-muted-foreground"
            }`}
          >
            {user.name} · {roleBadge}
          </span>
        )}
      </div>

      <div className="relative ml-4 min-w-0 flex-1 max-w-xl">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          placeholder="Search departments, policies, audits…"
          className="h-10 w-full rounded-lg border border-border bg-white pl-9 pr-10 text-sm outline-none placeholder:text-muted-foreground/70 focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
        />
        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          className="absolute right-1.5 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-md text-muted-foreground hover:bg-secondary hover:text-primary"
          aria-label="Voice search (demo)"
        >
          <Mic className="h-4 w-4" />
        </motion.button>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {user && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="h-8 gap-1 text-sm hover:border-danger/30 hover:bg-danger/10 hover:text-danger"
            onClick={handleLogout}
          >
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </Button>
        )}
        {isSuperAdmin && (
          <Button asChild variant="secondary" size="sm" className="h-8 gap-1 border-warn/30 bg-warn/10 text-sm text-warn">
            <Link to="/admin">Administration</Link>
          </Button>
        )}
        {isEsgManager && (
          <Button asChild variant="secondary" size="sm" className="h-8 gap-1 text-sm">
            <Link to="/manager">Approval Hub</Link>
          </Button>
        )}
        {showFacilitySwitcher && (
          <div className="flex items-center gap-1.5 rounded-md border border-border bg-secondary px-2 py-1">
            <Filter className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
            <select
              aria-label="Filter by facility"
              defaultValue=""
              className="max-w-[10rem] cursor-pointer bg-transparent py-0.5 text-sm outline-none"
            >
              <option value="">All facilities</option>
              {digitalTwinFacilities.map(f => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
            <ChevronDown className="h-3 w-3 shrink-0 text-muted-foreground" aria-hidden />
          </div>
        )}
        {showDistrictFilter && (
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
        )}
        {isDepartmentManager && user?.departmentName && (
          <span className="rounded-md border border-primary/25 bg-primary/10 px-2 py-1 text-sm font-medium text-primary">
            {user.departmentName} only
          </span>
        )}
        {(isSuperAdmin || isEsgManager) && (
          <select className="rounded-md border border-border bg-secondary px-2 py-1.5 text-sm">
            <option>All risk levels</option>
            <option>Critical</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        )}
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
