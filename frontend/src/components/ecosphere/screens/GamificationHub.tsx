import { Lock, Medal, Trophy } from "lucide-react";
import { AiInsightsCard } from "@/components/ecosphere/ds";
import {
  gamificationInsights,
  challengeKanbanCards,
  leaderboardRows,
  badgeItems,
  rewardCatalog,
  type ChallengeLifecycle,
} from "@/data/ecosphere-modules";

const lifecycleColumns: { key: ChallengeLifecycle; label: string }[] = [
  { key: "draft", label: "Draft" },
  { key: "active", label: "Active" },
  { key: "review", label: "Under Review" },
  { key: "completed", label: "Completed" },
];

function ProgressRing({ progress }: { progress: number }) {
  const r = 18;
  const c = 2 * Math.PI * r;
  const offset = c - (progress / 100) * c;
  return (
    <svg className="h-11 w-11 shrink-0" viewBox="0 0 44 44">
      <circle cx="22" cy="22" r={r} fill="none" stroke="var(--border)" strokeWidth="4" />
      <circle
        cx="22"
        cy="22"
        r={r}
        fill="none"
        stroke="var(--accent-teal)"
        strokeWidth="4"
        strokeDasharray={c}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 22 22)"
      />
      <text x="22" y="24" textAnchor="middle" className="fill-[var(--text-primary)] text-[9px] font-bold">
        {progress}%
      </text>
    </svg>
  );
}

export function GamificationHub() {
  return (
    <div className="space-y-4 p-6">
      <div>
        <p className="text-[13px] text-[var(--eco-text-secondary)]">Season 3 · compete · unlock · redeem</p>
        <h1 className="mt-1 text-2xl font-bold text-[var(--eco-text-primary)]">Gamification Hub</h1>
      </div>

      <div className="eco-card overflow-hidden">
        <div className="bg-gradient-to-r from-[var(--eco-accent-purple)] to-[var(--eco-accent-teal)] px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium opacity-90">Season 3</div>
              <div className="text-2xl font-bold">12 days left</div>
            </div>
            <Trophy className="h-10 w-10 opacity-80" />
          </div>
        </div>
        <div className="divide-y divide-[var(--eco-border)]">
          {leaderboardRows.map(row => (
            <div key={row.id} className="flex items-center gap-4 px-6 py-4">
              <span className={`grid h-9 w-9 place-items-center rounded-full text-sm font-bold ${
                row.rank === 1 ? "bg-[var(--eco-accent-amber-bg)] text-[var(--eco-accent-amber)]" : "bg-[var(--eco-bg-page)] text-[var(--eco-text-secondary)]"
              }`}>
                #{row.rank}
              </span>
              <div className="grid h-10 w-10 place-items-center rounded-full bg-[var(--eco-accent-purple-bg)] text-sm font-bold text-[var(--eco-accent-purple)]">
                {row.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-[var(--eco-text-primary)]">{row.name}</div>
                <div className="text-[13px] text-[var(--eco-text-muted)]">{row.department}</div>
              </div>
              <div className="text-lg font-bold text-[var(--eco-accent-teal)]">{row.xp.toLocaleString()} XP</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="eco-card p-4">
          <div className="mb-4 text-xs font-semibold uppercase tracking-[0.05em] text-[var(--eco-text-secondary)]">
            Badge Showcase
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {badgeItems.map(badge => (
              <div
                key={badge.id}
                className={`rounded-xl border p-3 text-center ${
                  badge.unlocked
                    ? "border-[var(--eco-accent-teal)] bg-[var(--eco-accent-teal-bg)]"
                    : "border-[var(--eco-border)] bg-[var(--eco-bg-page)] opacity-70"
                }`}
              >
                <Medal className={`mx-auto h-8 w-8 ${badge.unlocked ? "text-[var(--eco-accent-teal)]" : "text-[var(--eco-text-muted)]"}`} />
                <div className="mt-2 text-sm font-semibold text-[var(--eco-text-primary)]">{badge.name}</div>
                {badge.unlocked ? (
                  <div className="mt-1 text-xs text-[var(--eco-accent-teal)]">Unlocked</div>
                ) : (
                  <div className="mt-1 flex items-center justify-center gap-1 text-xs text-[var(--eco-text-muted)]">
                    <Lock className="h-3 w-3" /> {badge.xp} XP to go
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="eco-card p-4">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.05em] text-[var(--eco-text-secondary)]">
            Active Challenges
          </div>
          <div className="grid grid-cols-2 gap-3">
            {lifecycleColumns.map(col => (
              <div key={col.key}>
                <div className="mb-2 text-xs font-medium text-[var(--eco-text-secondary)]">{col.label}</div>
                <div className="space-y-2">
                  {challengeKanbanCards
                    .filter(c => c.lifecycle === col.key)
                    .map(ch => (
                      <div key={ch.id} className="rounded-lg border border-[var(--eco-border)] bg-white p-2">
                        <div className="flex items-start gap-2">
                          <ProgressRing progress={ch.progress} />
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-[var(--eco-text-primary)]">{ch.title}</div>
                            <div className="text-xs text-[var(--eco-text-muted)]">{ch.category}</div>
                            <div className="mt-1 text-xs font-semibold text-[var(--eco-accent-purple)]">{ch.xp} XP</div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <div className="mb-3 text-xs font-semibold uppercase tracking-[0.05em] text-[var(--eco-text-secondary)]">
          Reward Catalog
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {rewardCatalog.map(reward => (
            <div key={reward.id} className="eco-card p-4 text-center">
              <div className="text-3xl">{reward.icon}</div>
              <div className="mt-2 font-semibold text-[var(--eco-text-primary)]">{reward.name}</div>
              <div className="mt-1 text-sm text-[var(--eco-accent-purple)]">{reward.points} pts</div>
              <div className="mt-1 text-xs text-[var(--eco-text-muted)]">{reward.stock} in stock</div>
              <button
                type="button"
                className="mt-3 w-full rounded-full bg-[var(--eco-accent-teal)] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90"
              >
                Redeem
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-md">
        <AiInsightsCard insights={gamificationInsights} title="AI LIVE INSIGHTS" />
      </div>
    </div>
  );
}
