import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Trophy, Heart, Medal, Gift, Bell, LogOut } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useEcoAuth } from "@/context/EcoAuthContext";
import { cn } from "@/lib/utils";

const TABS = [
  { to: "/mobile", label: "Home", icon: Home, match: (p: string) => p === "/mobile" || p === "/mobile/" },
  { to: "/mobile/challenges", label: "Challenges", icon: Trophy, match: (p: string) => p.startsWith("/mobile/challenges") },
  { to: "/mobile/csr", label: "CSR", icon: Heart, match: (p: string) => p.startsWith("/mobile/csr") },
  { to: "/mobile/leaderboard", label: "Ranks", icon: Medal, match: (p: string) => p.startsWith("/mobile/leaderboard") },
  { to: "/mobile/rewards", label: "Rewards", icon: Gift, match: (p: string) => p.startsWith("/mobile/rewards") },
  { to: "/mobile/notifications", label: "Alerts", icon: Bell, match: (p: string) => p.startsWith("/mobile/notifications") },
];

export function MobileShell({ children }: { children: React.ReactNode }) {
  const path = useRouterState({ select: s => s.location.pathname });
  const { user, logout } = useEcoAuth();
  const navigate = useNavigate();

  return (
    <div className="eco-light flex min-h-screen flex-col bg-[var(--bg-page)]">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-[var(--border)] bg-[var(--bg-card)] px-4 py-3">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--accent-teal)]">
            EcoSphere
          </div>
          <div className="text-sm font-semibold text-[var(--text-primary)]">{user?.name ?? "Employee"}</div>
        </div>
        <button
          type="button"
          onClick={() => {
            logout();
            navigate({ to: "/login" });
          }}
          className="grid h-9 w-9 place-items-center rounded-full border border-[var(--border)] text-[var(--text-secondary)]"
          aria-label="Sign out"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </header>

      <main className="flex-1 overflow-auto pb-20">{children}</main>

      <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-[var(--border)] bg-[var(--bg-card)] px-1 pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto flex max-w-lg justify-around">
          {TABS.map(({ to, label, icon: Icon, match }) => {
            const active = match(path);
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "flex min-w-0 flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition",
                  active ? "text-[var(--accent-teal)]" : "text-[var(--text-muted)]",
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="truncate">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
