import type { TwinSimulation, TwinPrediction } from "@/lib/digital-twin-engine";

export function CarbonSimulator({
  sim,
  prediction,
  onChange,
}: {
  sim: TwinSimulation;
  prediction: TwinPrediction;
  onChange: (patch: Partial<TwinSimulation>) => void;
}) {
  const genCarbon = prediction.currentCarbonT;
  const simulatedCarbon = prediction.predictedCarbonT;
  const savings =
    genCarbon > 0 ? Math.round((1 - simulatedCarbon / (genCarbon * 1.18)) * 100) : 0;

  return (
    <div className="eco-card p-4">
      <div className="mb-3 text-xs font-semibold uppercase tracking-[0.05em] text-[var(--text-secondary)]">
        Scenario Simulator
      </div>
      <div className="space-y-3">
        <div>
          <div className="mb-1 flex justify-between text-sm">
            <span className="text-[var(--text-secondary)]">Generator Load</span>
            <span className="font-bold text-[var(--text-primary)]">{sim.generatorUsagePct}%</span>
          </div>
          <input
            type="range"
            min={20}
            max={100}
            value={sim.generatorUsagePct}
            onChange={e => onChange({ generatorUsagePct: Number(e.target.value) })}
            className="w-full accent-[var(--accent-teal)]"
          />
        </div>
        <div>
          <div className="mb-1 flex justify-between text-sm">
            <span className="text-[var(--text-secondary)]">Solar Output</span>
            <span className="font-bold text-[var(--text-primary)]">{sim.solarKwh} kWh</span>
          </div>
          <input
            type="range"
            min={0}
            max={500}
            step={10}
            value={sim.solarKwh}
            onChange={e => onChange({ solarKwh: Number(e.target.value) })}
            className="w-full accent-[var(--accent-teal)]"
          />
        </div>
        <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-page)] p-2.5 text-center">
          <div className="text-xs text-[var(--text-muted)]">Net Carbon</div>
          <div className="mt-1 text-sm font-semibold tabular-nums text-[var(--text-primary)]">
            {genCarbon.toFixed(2)} t
            <span className="mx-1.5 text-[var(--text-muted)]">→</span>
            <span className="text-[var(--accent-teal)]">{simulatedCarbon.toFixed(2)} t</span>
          </div>
          <div className="mt-1 text-xs" style={{ color: savings > 0 ? "var(--accent-green)" : "var(--text-muted)" }}>
            Potential reduction {Math.max(0, savings)}%
          </div>
        </div>
      </div>
    </div>
  );
}
