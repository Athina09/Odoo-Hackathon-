import { useRef, useState } from "react";
import { Camera, CheckCircle2, Clock, Heart, MapPin, TreePine, Waves } from "lucide-react";
import { useEmployeeGamification } from "@/context/EmployeeGamificationContext";
import {
  getActiveCsrCatalog,
  registerCsr,
  submitCsrProof,
} from "@/lib/ecosphere-employee-store";

const CSR_ACCENT: Record<string, { color: string; icon: typeof Heart }> = {
  "csr-tree": { color: "#059669", icon: TreePine },
  "csr-blood": { color: "#dc2626", icon: Heart },
  "csr-beach": { color: "#0284c7", icon: Waves },
};

const DEFAULT_ACCENT = { color: "#0d9488", icon: Heart };

function accentFor(activityId: string) {
  return CSR_ACCENT[activityId] ?? DEFAULT_ACCENT;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
      {children}
    </h2>
  );
}

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
    update(submitCsrProof(state, pendingRegId, URL.createObjectURL(file)));
    setPendingRegId(null);
    e.target.value = "";
  };

  return (
    <div className="space-y-5 p-4 pb-8">
      <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={onFileChange} />

      <div>
        <h1 className="text-xl font-bold text-[var(--text-primary)]">CSR Activities</h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">Volunteer for company-organized activities</p>
        <p className="mt-2 text-xs text-[var(--text-secondary)]">
          {attending.length} attending · {pending.length} in review · {approved.length} approved
        </p>
      </div>

      <section className="space-y-2">
        <SectionTitle>Upcoming & active</SectionTitle>
        {catalog.map(act => {
          const reg = mine.find(a => a.activityId === act.activityId);
          const { color, icon: Icon } = accentFor(act.activityId);

          return (
            <div
              key={act.activityId}
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
                <div className="font-semibold text-[var(--text-primary)]">{act.title}</div>
                <div className="mt-1 flex items-center gap-1 text-xs text-[var(--text-muted)]">
                  <MapPin className="h-3 w-3" />
                  {act.location} · {act.date}
                </div>
                <div className="mt-1 text-xs font-medium text-[var(--accent-teal)]">{act.points} points</div>
                <div className="mt-3">
                  {!reg ? (
                    <button
                      type="button"
                      onClick={() => update(registerCsr(state, act.activityId))}
                      className="rounded-full bg-[var(--accent-teal)] px-4 py-1.5 text-xs font-semibold text-white"
                    >
                      Join
                    </button>
                  ) : (
                    <span className="text-xs font-medium text-[var(--accent-teal)]">Registered</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {attending.length > 0 && (
        <section className="space-y-2">
          <SectionTitle>My CSR activities</SectionTitle>
          {attending.map(reg => (
            <div key={reg.id} className="eco-card p-4">
              <div className="font-semibold">{reg.title}</div>
              <div className="mt-1 text-xs text-[var(--text-muted)]">
                {reg.location} · {reg.date}
              </div>
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
          <SectionTitle>Under review</SectionTitle>
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
          <SectionTitle>Approved</SectionTitle>
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
