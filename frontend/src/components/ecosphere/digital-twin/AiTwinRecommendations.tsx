import { Bot } from "lucide-react";
import type { TwinPrediction } from "@/lib/digital-twin-engine";

export function AiTwinRecommendations({ prediction }: { prediction: TwinPrediction }) {
  const r = prediction.recommendation;
  return (
    <div className="eco-card p-4">
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
        <Bot className="h-4 w-4 text-[var(--accent-teal)]" /> AI Recommendation
      </div>
      <p className="text-sm text-[var(--text-primary)]">{r.action}</p>
      <div className="my-3 flex items-center justify-center gap-2 text-sm">
        <span className="rounded-lg bg-[var(--bg-page)] px-3 py-2">Switch to Grid</span>
        <span className="text-[var(--text-muted)]">↓</span>
        <span className="rounded-lg bg-[var(--accent-green-bg)] px-3 py-2 font-semibold text-[var(--accent-green)]">
          Save {r.saveTco2} tCO₂
        </span>
        <span className="text-[var(--text-muted)]">↓</span>
        <span className="rounded-lg bg-[var(--accent-teal-bg)] px-3 py-2 font-semibold text-[var(--accent-teal)]">
          ESG +{r.esgBoost}
        </span>
      </div>
      <ul className="space-y-1 text-xs text-[var(--text-secondary)]">
        {r.bullets.map(b => (
          <li key={b}>• {b}</li>
        ))}
      </ul>
      <div className="mt-2 text-xs font-semibold text-[var(--accent-teal)]">
        Expected reduction: {r.expectedReductionPct}%
      </div>
    </div>
  );
}
