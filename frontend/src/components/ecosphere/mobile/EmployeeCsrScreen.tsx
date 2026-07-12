import { useRef, useState } from "react";
import { Camera, CheckCircle2, Clock, MapPin } from "lucide-react";
import { useEmployeeGamification } from "@/context/EmployeeGamificationContext";
import {
  getActiveCsrCatalog,
  registerCsr,
  submitCsrProof,
} from "@/lib/ecosphere-employee-store";

export function EmployeeCsrScreen() {
  const { state, update } = useEmployeeGamification();
  const fileRef = useRef<HTMLInputElement>(null);
  const [pendingRegId, setPendingRegId] = useState<string | null>(null);

  const catalog = getActiveCsrCatalog();
  const mine = state.csrActivities;
  const pending = mine.filter(a => a.status === "pending_review");
  const approved = mine.filter(a => a.status === "approved");
  const attending = mine.filter(a => a.status === "in_progress");

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !pendingRegId) return;
    const url = URL.createObjectURL(file);
    update(submitCsrProof(state, pendingRegId, url));
    setPendingRegId(null);
    e.target.value = "";
  };

  return (
    <div className="space-y-5 p-4">
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />

      <div>
        <h1 className="text-xl font-bold text-[var(--text-primary)]">CSR Activities</h1>
        <p className="text-sm text-[var(--text-muted)]">Volunteer for company-organized activities</p>
      </div>

      <section className="space-y-2">
        <h2 className="text-xs font-semibold uppercase text-[var(--text-secondary)]">Upcoming & active</h2>
        {catalog.map(act => {
          const reg = mine.find(a => a.activityId === act.activityId);
          return (
            <div key={act.activityId} className="eco-card p-4">
              <div className="font-semibold text-[var(--text-primary)]">{act.title}</div>
              <div className="mt-1 flex items-center gap-1 text-xs text-[var(--text-muted)]">
                <MapPin className="h-3 w-3" /> {act.location} · {act.date}
              </div>
              <div className="mt-1 text-xs text-[var(--accent-teal)]">{act.points} points</div>
              {!reg ? (
                <button
                  type="button"
                  onClick={() => update(registerCsr(state, act.activityId))}
                  className="mt-3 rounded-full bg-[var(--accent-teal)] px-4 py-1.5 text-xs font-semibold text-white"
                >
                  Join
                </button>
              ) : (
                <span className="mt-3 inline-block text-xs font-medium text-[var(--accent-teal)]">Registered</span>
              )}
            </div>
          );
        })}
      </section>

      {attending.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-xs font-semibold uppercase text-[var(--text-secondary)]">My CSR activities</h2>
          {attending.map(reg => (
            <div key={reg.id} className="eco-card p-4">
              <div className="font-semibold">{reg.title}</div>
              <div className="mt-1 text-xs text-[var(--text-muted)]">{reg.location} · {reg.date}</div>
              <button
                type="button"
                onClick={() => {
                  setPendingRegId(reg.id);
                  fileRef.current?.click();
                }}
                className="mt-3 inline-flex items-center gap-1 rounded-full bg-[var(--accent-teal)] px-3 py-1.5 text-xs font-semibold text-white"
              >
                <Camera className="h-3 w-3" /> Upload proof
              </button>
            </div>
          ))}
        </section>
      )}

      {pending.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-xs font-semibold uppercase text-[var(--text-secondary)]">Under review</h2>
          {pending.map(reg => (
            <div key={reg.id} className="eco-card flex items-center gap-3 p-4">
              <Clock className="h-5 w-5 text-[var(--accent-amber)]" />
              <div>
                <div className="font-medium">{reg.title}</div>
                <div className="text-xs text-[var(--text-muted)]">Proof submitted — awaiting approval</div>
              </div>
            </div>
          ))}
        </section>
      )}

      {approved.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-xs font-semibold uppercase text-[var(--text-secondary)]">Approved</h2>
          {approved.map(reg => (
            <div key={reg.id} className="eco-card flex items-center gap-3 p-4">
              <CheckCircle2 className="h-5 w-5 text-[var(--accent-green)]" />
              <div>
                <div className="font-medium">{reg.title}</div>
                <div className="text-xs text-[var(--accent-teal)]">+{reg.points} points · feeds dept Social score</div>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
