import { Clock } from "lucide-react";
import { timeLabel } from "@/lib/digital-twin-engine";

export function TimeTravelSlider({
  value,
  onChange,
}: {
  value: number;
  onChange: (hours: number) => void;
}) {
  return (
    <div className="eco-card p-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-3.5 w-3.5 text-[var(--text-secondary)]" strokeWidth={1.5} />
          <span className="text-xs font-semibold uppercase tracking-[0.05em] text-[var(--text-secondary)]">
            Temporal Simulation
          </span>
        </div>
        <span className="rounded-full bg-[var(--accent-teal-bg)] px-2.5 py-0.5 text-xs font-bold text-[var(--accent-teal)]">
          {timeLabel(value)}
        </span>
      </div>
      <div className="flex items-center gap-2 text-[10px] text-[var(--text-muted)]">
        <span>-12h</span>
        <span className="flex-1 text-center font-semibold text-[var(--accent-teal)]">LIVE</span>
        <span>+24h</span>
      </div>
      <input
        type="range"
        min={-12}
        max={24}
        step={1}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="mt-2 h-2 w-full cursor-pointer accent-[var(--accent-teal)]"
        aria-label="Time offset hours"
      />
    </div>
  );
}
