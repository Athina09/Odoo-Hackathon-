import type { TwinPrediction } from "@/lib/digital-twin-engine";

export function RootCauseChain({ prediction }: { prediction: TwinPrediction }) {
  return (
    <div className="eco-card p-4">
      <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
        Root Cause Chain
      </div>
      <div className="flex flex-col items-center gap-1">
        {prediction.rootCause.map((step, i) => (
          <div key={step} className="flex flex-col items-center">
            <div
              className={`rounded-lg border px-4 py-2 text-sm font-medium ${
                i === prediction.rootCause.length - 1
                  ? "border-[var(--accent-red)] bg-[var(--accent-red-bg)] text-[var(--accent-red)]"
                  : "border-[var(--border)] bg-[var(--bg-page)]"
              }`}
            >
              {step}
            </div>
            {i < prediction.rootCause.length - 1 && (
              <span className="text-[var(--text-muted)]">↓</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
