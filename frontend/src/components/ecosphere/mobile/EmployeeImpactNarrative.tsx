import { Leaf, Sparkles } from "lucide-react";
import type { ImpactNarrative } from "@/lib/employee-impact";

export function EmployeeImpactNarrative({ narratives }: { narratives: ImpactNarrative[] }) {
  if (narratives.length === 0) return null;

  return (
    <div className="border-t border-[var(--border)] bg-gradient-to-b from-[var(--accent-teal-bg)]/40 to-[var(--bg-card)] px-4 py-4">
      <div className="mb-3 flex items-center gap-2">
        <Leaf className="h-4 w-4 text-[var(--accent-teal)]" />
        <h3 className="text-[11px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
          Your impact in words
        </h3>
      </div>

      <div className="space-y-3">
        {narratives.map((item, i) => (
          <article
            key={item.id}
            className="rounded-lg border border-[var(--border)] bg-white/90 p-3 shadow-sm"
          >
            <div className="flex items-start gap-2">
              {i === 0 ? (
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent-teal)]" />
              ) : (
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-teal)]" />
              )}
              <div className="min-w-0">
                <h4 className="text-sm font-semibold leading-snug text-[var(--text-primary)]">
                  {item.headline}
                </h4>
                <p className="mt-1 text-[13px] leading-relaxed text-[var(--text-secondary)]">
                  {item.body}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
