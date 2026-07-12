import { useRef } from "react";
import { Camera, CheckCircle2, Clock, ImagePlus, Sparkles, Trophy, Zap } from "lucide-react";
import { toast } from "sonner";
import { useEmployeeGamification } from "@/context/EmployeeGamificationContext";
import {
  attachChallengeEvidence,
  canSubmitChallenge,
  getActiveChallengesCatalog,
  joinChallenge,
  submitChallenge,
  updateChallengeProgress,
  type ChallengeEnrollment,
} from "@/lib/ecosphere-employee-store";
import { CelebrationOverlay } from "./CelebrationOverlay";
import { cn } from "@/lib/utils";

const CATEGORY_ACCENT: Record<string, { color: string; icon: typeof Zap }> = {
  "Cycle to Work": { color: "#2563eb", icon: Zap },
  "Reduce Plastic Usage": { color: "#059669", icon: Sparkles },
  "Energy Saving": { color: "#d97706", icon: Trophy },
};

const DEFAULT_ACCENT = { color: "#0d9488", icon: Trophy };

function accentFor(category: string) {
  return CATEGORY_ACCENT[category] ?? DEFAULT_ACCENT;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
      {children}
    </h2>
  );
}

function StatusPill({ status }: { status: ChallengeEnrollment["status"] }) {
  const styles = {
    in_progress: "bg-blue-50 text-blue-700",
    pending_review: "bg-amber-50 text-amber-700",
    approved: "bg-emerald-50 text-emerald-700",
    rejected: "bg-red-50 text-red-700",
  };
  const labels = {
    in_progress: "In progress",
    pending_review: "Under review",
    approved: "Completed",
    rejected: "Rejected",
  };
  return (
    <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", styles[status])}>
      {labels[status]}
    </span>
  );
}

export function EmployeeChallengesScreen() {
  const { state, update, triggerCelebration } = useEmployeeGamification();
  const fileRef = useRef<HTMLInputElement>(null);
  const pendingEnrId = useRef<string | null>(null);

  const catalog = getActiveChallengesCatalog();
  const inProgress = state.challenges.filter(c => c.status === "in_progress");
  const pending = state.challenges.filter(c => c.status === "pending_review");
  const completed = state.challenges.filter(c => c.status === "approved");

  const openCamera = (enrollmentId: string) => {
    pendingEnrId.current = enrollmentId;
    fileRef.current?.click();
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const enrollmentId = pendingEnrId.current;
    if (!file || !enrollmentId) return;
    update(attachChallengeEvidence(state, enrollmentId, URL.createObjectURL(file)));
    toast.success("Photo attached");
    pendingEnrId.current = null;
    e.target.value = "";
  };

  const handleSubmit = (enrollmentId: string) => {
    const enr = state.challenges.find(c => c.id === enrollmentId);
    if (!enr || !canSubmitChallenge(enr)) return;
    update(submitChallenge(state, enrollmentId, enr.evidenceUrl));
    triggerCelebration();
    toast.success("Submitted for review");
  };

  return (
    <div className="space-y-5 p-4 pb-8">
      <CelebrationOverlay />
      <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={onFileChange} />

      <div>
        <h1 className="text-xl font-bold text-[var(--text-primary)]">Challenges</h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">Snap a photo as you go — submit when ready</p>
        <p className="mt-2 text-xs text-[var(--text-secondary)]">
          {inProgress.length} active · {pending.length} in review · {completed.length} done
        </p>
      </div>

      <section className="space-y-2">
        <SectionTitle>Browse active</SectionTitle>
        {catalog.map(ch => {
          const enrollment = state.challenges.find(c => c.challengeId === ch.challengeId);
          const { color, icon: Icon } = accentFor(ch.category);

          return (
            <div
              key={ch.challengeId}
              className="eco-card flex gap-3 border-l-[3px] p-4"
              style={{ borderLeftColor: color }}
            >
              <div
                className="grid h-9 w-9 shrink-0 place-items-center rounded-lg"
                style={{ background: `${color}14`, color }}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-[var(--text-primary)]">{ch.title}</div>
                <div className="mt-1 text-xs text-[var(--text-muted)]">
                  {ch.category} · {ch.xpReward} XP · {ch.difficulty} · Due {ch.deadline}
                </div>
                {ch.evidenceRequired && (
                  <p className="mt-1 text-xs text-[var(--accent-amber)]">Photo evidence required</p>
                )}
                <div className="mt-3">
                  {!enrollment ? (
                    <button
                      type="button"
                      onClick={() => update(joinChallenge(state, ch.challengeId))}
                      className="rounded-full bg-[var(--accent-teal)] px-4 py-1.5 text-xs font-semibold text-white"
                    >
                      Join
                    </button>
                  ) : (
                    <StatusPill status={enrollment.status} />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {inProgress.length > 0 && (
        <section className="space-y-2">
          <SectionTitle>In progress</SectionTitle>
          {inProgress.map(enr => {
            const ready = canSubmitChallenge(enr);
            const { color } = accentFor(enr.category);
            const pct = Math.min(100, (enr.progress / enr.progressTarget) * 100);

            return (
              <div key={enr.id} className="eco-card p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="font-semibold text-[var(--text-primary)]">{enr.title}</div>
                  <StatusPill status="in_progress" />
                </div>
                <div className="mt-2 text-sm text-[var(--text-secondary)]">
                  Progress: {enr.progress}/{enr.progressTarget}
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--bg-page)]">
                  <div
                    className="h-full rounded-full bg-[var(--accent-teal)] transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                {enr.evidenceUrl && (
                  <div className="mt-3 overflow-hidden rounded-lg border border-[var(--border)]">
                    <img src={enr.evidenceUrl} alt="Challenge evidence" className="h-32 w-full object-cover" />
                    <p className="bg-[var(--bg-page)] px-2 py-1 text-[11px] text-[var(--accent-green)]">
                      Photo attached — tap Submit when ready
                    </p>
                  </div>
                )}

                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => update(updateChallengeProgress(state, enr.id, enr.progress + 1))}
                    disabled={enr.progress >= enr.progressTarget}
                    className="rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-medium disabled:opacity-50"
                  >
                    +1 progress
                  </button>
                  <button
                    type="button"
                    onClick={() => openCamera(enr.id)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[var(--accent-teal)] px-3 py-1.5 text-xs font-semibold text-[var(--accent-teal)]"
                  >
                    <Camera className="h-3.5 w-3.5" />
                    {enr.evidenceUrl ? "Retake photo" : "Take photo"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSubmit(enr.id)}
                    disabled={!ready}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-teal)] px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-40"
                  >
                    <ImagePlus className="h-3.5 w-3.5" />
                    Submit
                  </button>
                </div>

                {enr.evidenceRequired && !enr.evidenceUrl && (
                  <p className="mt-2 text-[11px] text-[var(--text-muted)]">Take a photo to unlock Submit</p>
                )}
              </div>
            );
          })}
        </section>
      )}

      {pending.length > 0 && (
        <section className="space-y-2">
          <SectionTitle>Under review</SectionTitle>
          {pending.map(enr => (
            <div key={enr.id} className="eco-card flex items-center gap-3 p-4">
              <Clock className="h-5 w-5 shrink-0 text-[var(--accent-amber)]" />
              <div className="min-w-0 flex-1">
                <div className="font-medium">{enr.title}</div>
                <div className="text-xs text-[var(--text-muted)]">Waiting for manager approval</div>
                {enr.evidenceUrl && (
                  <img src={enr.evidenceUrl} alt="Submitted evidence" className="mt-2 h-20 w-full rounded-md object-cover" />
                )}
              </div>
            </div>
          ))}
        </section>
      )}

      {completed.length > 0 && (
        <section className="space-y-2">
          <SectionTitle>Completed</SectionTitle>
          {completed.map(enr => (
            <div key={enr.id} className="eco-card flex items-center gap-3 p-4">
              <CheckCircle2 className="h-5 w-5 text-[var(--accent-green)]" />
              <div>
                <div className="font-medium">{enr.title}</div>
                <div className="text-xs text-[var(--accent-teal)]">+{enr.xpReward} XP awarded</div>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
