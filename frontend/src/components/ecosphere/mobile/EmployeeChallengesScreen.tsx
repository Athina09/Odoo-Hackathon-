import { useRef, useState } from "react";
import { Camera, CheckCircle2, Clock } from "lucide-react";
import { useEmployeeGamification } from "@/context/EmployeeGamificationContext";
import {
  getActiveChallengesCatalog,
  joinChallenge,
  submitChallenge,
  updateChallengeProgress,
} from "@/lib/ecosphere-employee-store";
import { CelebrationOverlay } from "./CelebrationOverlay";

export function EmployeeChallengesScreen() {
  const { state, update, triggerCelebration } = useEmployeeGamification();
  const fileRef = useRef<HTMLInputElement>(null);
  const [pendingSubmitId, setPendingSubmitId] = useState<string | null>(null);
  const [evidencePreview, setEvidencePreview] = useState<string | null>(null);

  const catalog = getActiveChallengesCatalog();
  const inProgress = state.challenges.filter(c => c.status === "in_progress");
  const pending = state.challenges.filter(c => c.status === "pending_review");
  const completed = state.challenges.filter(c => c.status === "approved");

  const handleEvidencePick = (enrollmentId: string) => {
    setPendingSubmitId(enrollmentId);
    fileRef.current?.click();
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !pendingSubmitId) return;
    const url = URL.createObjectURL(file);
    setEvidencePreview(url);
    const next = submitChallenge(state, pendingSubmitId, url);
    update(next);
    setPendingSubmitId(null);
    e.target.value = "";
  };

  return (
    <div className="space-y-5 p-4">
      <CelebrationOverlay />
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />

      <div>
        <h1 className="text-xl font-bold text-[var(--text-primary)]">Challenges</h1>
        <p className="text-sm text-[var(--text-muted)]">Active challenges you can join</p>
      </div>

      <section className="space-y-2">
        <h2 className="text-xs font-semibold uppercase text-[var(--text-secondary)]">Browse active</h2>
        {catalog.map(ch => {
          const enrollment = state.challenges.find(c => c.challengeId === ch.challengeId);
          return (
            <div key={ch.challengeId} className="eco-card p-4">
              <div className="font-semibold text-[var(--text-primary)]">{ch.title}</div>
              <div className="mt-1 text-xs text-[var(--text-muted)]">
                {ch.category} · {ch.xpReward} XP · {ch.difficulty} · Due {ch.deadline}
              </div>
              {ch.evidenceRequired && (
                <div className="mt-1 text-xs text-[var(--accent-amber)]">Evidence required</div>
              )}
              {!enrollment ? (
                <button
                  type="button"
                  onClick={() => update(joinChallenge(state, ch.challengeId))}
                  className="mt-3 rounded-full bg-[var(--accent-teal)] px-4 py-1.5 text-xs font-semibold text-white"
                >
                  Join
                </button>
              ) : (
                <span className="mt-3 inline-block text-xs font-medium text-[var(--accent-teal)]">
                  {enrollment.status === "in_progress" ? "In progress" : enrollment.status.replace("_", " ")}
                </span>
              )}
            </div>
          );
        })}
      </section>

      {inProgress.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-xs font-semibold uppercase text-[var(--text-secondary)]">In progress</h2>
          {inProgress.map(enr => (
            <div key={enr.id} className="eco-card p-4">
              <div className="font-semibold">{enr.title}</div>
              <div className="mt-2 text-sm text-[var(--text-secondary)]">
                Progress: {enr.progress}/{enr.progressTarget}
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--bg-page)]">
                <div
                  className="h-full rounded-full bg-[var(--accent-teal)]"
                  style={{ width: `${(enr.progress / enr.progressTarget) * 100}%` }}
                />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    update(updateChallengeProgress(state, enr.id, enr.progress + 1))
                  }
                  disabled={enr.progress >= enr.progressTarget}
                  className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-medium disabled:opacity-50"
                >
                  +1 progress
                </button>
                <button
                  type="button"
                  onClick={() => handleEvidencePick(enr.id)}
                  disabled={
                    enr.progress < enr.progressTarget ||
                    (enr.evidenceRequired && !evidencePreview && pendingSubmitId !== enr.id)
                  }
                  className="inline-flex items-center gap-1 rounded-full bg-[var(--accent-teal)] px-3 py-1 text-xs font-semibold text-white disabled:opacity-40"
                >
                  <Camera className="h-3 w-3" />
                  Submit {enr.evidenceRequired ? "(photo required)" : ""}
                </button>
              </div>
            </div>
          ))}
        </section>
      )}

      {pending.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-xs font-semibold uppercase text-[var(--text-secondary)]">Under review</h2>
          {pending.map(enr => (
            <div key={enr.id} className="eco-card flex items-center gap-3 p-4">
              <Clock className="h-5 w-5 text-[var(--accent-amber)]" />
              <div>
                <div className="font-medium">{enr.title}</div>
                <div className="text-xs text-[var(--text-muted)]">Waiting for manager approval</div>
              </div>
            </div>
          ))}
        </section>
      )}

      {completed.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-xs font-semibold uppercase text-[var(--text-secondary)]">Completed</h2>
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
