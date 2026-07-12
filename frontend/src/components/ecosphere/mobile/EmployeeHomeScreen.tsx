import { useEffect } from "react";
import { Trophy, Target } from "lucide-react";
import { useEcoAuth } from "@/context/EcoAuthContext";
import { useEmployeeGamification } from "@/context/EmployeeGamificationContext";
import {
  BADGE_RULES,
  getActiveChallengesCatalog,
  joinChallenge,
  nextBadgeProgress,
  loadEmployeeState,
} from "@/lib/ecosphere-employee-store";
import { CelebrationOverlay } from "./CelebrationOverlay";

function ProgressRing({ progress }: { progress: number }) {
  const r = 42;
  const c = 2 * Math.PI * r;
  const offset = c - (progress / 100) * c;
  return (
    <svg className="h-28 w-28" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r={r} fill="none" stroke="var(--border)" strokeWidth="8" />
      <circle
        cx="50"
        cy="50"
        r={r}
        fill="none"
        stroke="var(--accent-teal)"
        strokeWidth="8"
        strokeDasharray={c}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 50 50)"
      />
      <text x="50" y="54" textAnchor="middle" className="fill-[var(--text-primary)] text-lg font-bold">
        {Math.round(progress)}%
      </text>
    </svg>
  );
}

export function EmployeeHomeScreen() {
  const { user } = useEcoAuth();
  const { state, update, refresh, triggerCelebration } = useEmployeeGamification();
  const { next, progress } = nextBadgeProgress(state.xp);
  const recommended = getActiveChallengesCatalog().slice(0, 3);

  useEffect(() => {
    const onFocus = () => {
      const prevXp = state.xp;
      refresh();
      const nextState = loadEmployeeState(user?.id ?? "");
      if (nextState.xp > prevXp) triggerCelebration();
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [refresh, state.xp, triggerCelebration, user?.id]);

  const unlockedBadges = BADGE_RULES.filter(b => state.badges.includes(b.id));

  return (
    <div className="space-y-5 p-4">
      <CelebrationOverlay />

      <section className="eco-card p-5">
        <p className="text-[13px] text-[var(--text-secondary)]">Personal ESG Profile</p>
        <h1 className="mt-1 text-2xl font-bold text-[var(--text-primary)]">{user?.name}</h1>
        <p className="text-sm text-[var(--text-muted)]">{user?.departmentName ?? "EcoSphere"}</p>

        <div className="mt-5 flex items-center gap-5">
          <ProgressRing progress={progress} />
          <div className="flex-1 space-y-3">
            <div>
              <div className="text-[11px] uppercase tracking-wide text-[var(--text-secondary)]">Total XP</div>
              <div className="text-3xl font-bold text-[var(--accent-teal)]">{state.xp.toLocaleString()}</div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-[var(--text-muted)]">Rank </span>
                <span className="font-semibold">#{state.rank}</span>
              </div>
              <div>
                <span className="text-[var(--text-muted)]">Points </span>
                <span className="font-semibold">{state.points}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-lg bg-[var(--bg-page)] p-3">
          <div className="flex items-center gap-2 text-sm font-medium text-[var(--text-primary)]">
            <Target className="h-4 w-4 text-[var(--accent-purple)]" />
            Next badge: {next.name}
          </div>
          <p className="mt-1 text-xs text-[var(--text-muted)]">{next.xpRequired - state.xp} XP to unlock</p>
        </div>

        {unlockedBadges.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {unlockedBadges.map(b => (
              <span
                key={b.id}
                className="rounded-full bg-[var(--accent-teal-bg)] px-2.5 py-0.5 text-xs font-semibold text-[var(--accent-teal)]"
              >
                {b.name}
              </span>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
          <Trophy className="h-4 w-4" /> Recommended challenges
        </h2>
        <div className="space-y-2">
          {recommended.map(ch => {
            const joined = state.challenges.some(c => c.challengeId === ch.challengeId);
            return (
              <div key={ch.challengeId} className="eco-card flex items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <div className="font-semibold text-[var(--text-primary)]">{ch.title}</div>
                  <div className="text-xs text-[var(--text-muted)]">
                    {ch.category} · {ch.xpReward} XP · {ch.difficulty}
                  </div>
                </div>
                <button
                  type="button"
                  disabled={joined}
                  onClick={() => update(joinChallenge(state, ch.challengeId))}
                  className="shrink-0 rounded-full bg-[var(--accent-teal)] px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
                >
                  {joined ? "Joined" : "Join"}
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
