import { useEmployeeGamification } from "@/context/EmployeeGamificationContext";
import { leaderboardRows } from "@/data/ecosphere-modules";

export function EmployeeLeaderboardScreen() {
  const { state } = useEmployeeGamification();

  const rows = leaderboardRows.map(row =>
    row.name === "You" || row.rank === state.rank
      ? { ...row, name: "You", xp: state.xp, highlight: true }
      : row,
  );

  return (
    <div className="space-y-4 p-4">
      <div>
        <h1 className="text-xl font-bold text-[var(--text-primary)]">Leaderboard</h1>
        <p className="text-sm text-[var(--text-muted)]">Org-wide rankings · pull to refresh</p>
      </div>

      <div className="eco-card overflow-hidden">
        <div className="eco-card-header px-4 py-2 text-xs font-semibold uppercase text-[var(--text-secondary)]">
          Organization
        </div>
        <div className="divide-y divide-[var(--border)]">
          {rows.map(row => (
            <div
              key={row.rank}
              className={`flex items-center gap-3 px-4 py-3 ${row.highlight ? "bg-[var(--accent-teal-bg)]" : ""}`}
            >
              <span
                className={`grid h-8 w-8 place-items-center rounded-full text-sm font-bold ${
                  row.rank === 1
                    ? "bg-[var(--accent-amber-bg)] text-[var(--accent-amber)]"
                    : "bg-[var(--bg-page)] text-[var(--text-secondary)]"
                }`}
              >
                {row.rank}
              </span>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-[var(--text-primary)]">{row.name}</div>
                <div className="text-xs text-[var(--text-muted)]">{row.department}</div>
              </div>
              <div className="font-bold text-[var(--accent-teal)]">{row.xp.toLocaleString()} XP</div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-xs text-[var(--text-muted)]">
        Your rank updates when submissions are approved
      </p>
    </div>
  );
}
