import type { TwinPrediction } from "@/lib/digital-twin-engine";

export function PredictionKpiRow({ prediction }: { prediction: TwinPrediction }) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <div className="eco-card p-4">
        <div className="text-[11px] uppercase text-[var(--text-secondary)]">Current Carbon</div>
        <div className="text-2xl font-bold text-[var(--text-primary)]">{prediction.currentCarbonT} t</div>
      </div>
      <div className="eco-card border-[var(--accent-amber)]/40 p-4">
        <div className="text-[11px] uppercase text-[var(--text-secondary)]">Prediction (4h)</div>
        <div className="text-2xl font-bold text-[var(--accent-amber)]">{prediction.predictedCarbonT} t</div>
        <div className="text-xs text-[var(--accent-red)]">({prediction.deltaPct >= 0 ? "+" : ""}{prediction.deltaPct}%)</div>
      </div>
      <div className="eco-card p-4">
        <div className="text-[11px] uppercase text-[var(--text-secondary)]">AI Confidence</div>
        <div className="text-2xl font-bold text-[var(--accent-teal)]">{prediction.confidence}%</div>
      </div>
      <div className="eco-card p-4">
        <div className="text-[11px] uppercase text-[var(--text-secondary)]">ESG Score Forecast</div>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold">{prediction.esgNow}</span>
          <span className="text-[var(--text-muted)]">→</span>
          <span className="text-xl font-bold text-[var(--accent-amber)]">{prediction.esgPredicted}</span>
        </div>
        <div className="text-xs text-[var(--text-muted)]">{prediction.esgReason}</div>
      </div>
    </div>
  );
}
