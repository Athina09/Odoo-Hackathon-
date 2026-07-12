import { useMemo } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Medal, TrendingUp } from "lucide-react";
import { useEcoAuth } from "@/context/EcoAuthContext";
import { useEmployeeGamification } from "@/context/EmployeeGamificationContext";
import {
  buildLeaderboardWithUser,
  getUserLeaderboardContext,
} from "@/lib/employee-leaderboard";

export function EmployeeLeaderboardScreen() {
  const { user } = useEcoAuth();
  const { state } = useEmployeeGamification();

  const entries = useMemo(
    () =>
      buildLeaderboardWithUser({
        name: user?.name ?? "You",
        department: user?.departmentName ?? "HR",
        xp: state.xp,
      }),
    [user?.name, user?.departmentName, state.xp],
  );

  const ctx = useMemo(
    () => getUserLeaderboardContext(entries, user?.name ?? ""),
    [entries, user?.name],
  );

  const topFive = entries.slice(0, 5);
  const userInTopFive = ctx?.user.rank != null && ctx.user.rank <= 5;

  const compareData = useMemo(() => {
    if (!ctx) return [];
    return [
      { label: "You", xp: ctx.user.xp },
      { label: "#1", xp: ctx.leaderXp },
      ...(ctx.above ? [{ label: `#${ctx.above.rank}`, xp: ctx.above.xp }] : []),
    ];
  }, [ctx]);

  return (
    <div className="space-y-4 p-4">
      <div>
        <h1 className="text-xl font-bold text-[var(--text-primary)]">Leaderboard</h1>
        <p className="text-sm text-[var(--text-muted)]">Org-wide rankings · your position highlighted</p>
      </div>

      {ctx && (
        <section className="eco-card border-2 border-[var(--accent-teal)] bg-[var(--accent-teal-bg)] p-4">
          <div className="flex items-start gap-3">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[var(--accent-teal)] text-lg font-bold text-white">
              #{ctx.user.rank}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--accent-teal)]">
                Your position
              </p>
              <p className="text-lg font-bold text-[var(--text-primary)]">{ctx.user.name}</p>
              <p className="text-sm text-[var(--text-muted)]">{ctx.user.department}</p>
              <p className="mt-1 text-2xl font-bold text-[var(--accent-teal)]">
                {ctx.user.xp.toLocaleString()} XP
              </p>
              <p className="mt-1 text-xs text-[var(--text-secondary)]">
                {ctx.pctOfLeader}% of leader ·{" "}
                {ctx.xpToNextRank > 0
                  ? `${ctx.xpToNextRank.toLocaleString()} XP to reach #${ctx.nextRank}`
                  : "Top of the board!"}
              </p>
            </div>
            <Medal className="h-6 w-6 shrink-0 text-[var(--accent-amber)]" />
          </div>
        </section>
      )}

      {ctx && (
        <section className="eco-card p-4">
          <div className="mb-2 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-[var(--accent-purple)]" />
            <h2 className="text-sm font-semibold">XP comparison</h2>
          </div>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={compareData} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey="xp" fill="#0d9488" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      <div className="eco-card overflow-hidden">
        <div className="eco-card-header px-4 py-2 text-xs font-semibold uppercase text-[var(--text-secondary)]">
          Top 5 · Organization
        </div>
        <div className="divide-y divide-[var(--border)]">
          {topFive.map(row => (
            <LeaderboardRow
              key={row.id}
              row={row}
              highlight={row.isCurrentUser ?? false}
            />
          ))}
        </div>
      </div>

      {ctx && !userInTopFive && (
        <>
          <div className="flex items-center gap-2 px-1 text-xs text-[var(--text-muted)]">
            <span className="h-px flex-1 bg-[var(--border)]" />
            <span>··· {ctx.user.rank - 6 > 0 ? `${ctx.user.rank - 6} more` : "gap"} ···</span>
            <span className="h-px flex-1 bg-[var(--border)]" />
          </div>
          <div className="eco-card overflow-hidden">
            <div className="eco-card-header px-4 py-2 text-xs font-semibold uppercase text-[var(--text-secondary)]">
              Your row
            </div>
            <LeaderboardRow row={ctx.user} highlight />
          </div>
        </>
      )}

      <p className="text-center text-xs text-[var(--text-muted)]">
        Rank updates when managers approve your challenge & CSR submissions
      </p>
    </div>
  );
}

function LeaderboardRow({
  row,
  highlight,
}: {
  row: { rank: number; name: string; department: string; xp: number; isCurrentUser?: boolean };
  highlight: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 ${highlight ? "bg-[var(--accent-teal-bg)]" : ""}`}
    >
      <span
        className={`grid h-8 w-8 place-items-center rounded-full text-sm font-bold ${
          row.rank === 1
            ? "bg-[var(--accent-amber-bg)] text-[var(--accent-amber)]"
            : highlight
              ? "bg-[var(--accent-teal)] text-white"
              : "bg-[var(--bg-page)] text-[var(--text-secondary)]"
        }`}
      >
        {row.rank}
      </span>
      <div className="min-w-0 flex-1">
        <div className="font-semibold text-[var(--text-primary)]">
          {row.name}
          {row.isCurrentUser && (
            <span className="ml-1.5 text-[10px] font-medium text-[var(--accent-teal)]">(you)</span>
          )}
        </div>
        <div className="text-xs text-[var(--text-muted)]">{row.department}</div>
      </div>
      <div className="font-bold text-[var(--accent-teal)]">{row.xp.toLocaleString()} XP</div>
    </div>
  );
}
