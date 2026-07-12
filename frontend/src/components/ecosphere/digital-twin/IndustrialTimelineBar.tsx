import { cn } from "@/lib/utils";

const MARKERS = [
  { label: "09:30", offset: -1.5 },
  { label: "10:00", offset: -1 },
  { label: "10:30", offset: -0.5 },
  { label: "NOW", offset: 0, active: true },
  { label: "+2h Forecast", offset: 2, forecast: true },
] as const;

export function IndustrialTimelineBar({
  timeOffsetHours,
  onSelect,
}: {
  timeOffsetHours: number;
  onSelect?: (hours: number) => void;
}) {
  return (
    <div className="dt-timeline-bar border-t border-[#334155] bg-[#0A1628] px-3 py-2">
      <div className="mb-1 flex items-center justify-between">
        <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-[#64748B]">
          Operations Timeline
        </span>
        <span className="font-mono text-[8px] text-[#94A3B8]">
          Offset: {timeOffsetHours === 0 ? "LIVE" : `${timeOffsetHours > 0 ? "+" : ""}${timeOffsetHours}h`}
        </span>
      </div>
      <div className="relative flex items-center">
        <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-[#334155]" />
        <div
          className="absolute top-1/2 h-px -translate-y-1/2 bg-[#3B82F6] transition-all duration-300"
          style={{
            left: "37.5%",
            width: `${Math.min(100, 37.5 + (timeOffsetHours / 2) * 12.5)}%`,
            maxWidth: "62.5%",
          }}
        />
        {MARKERS.map(m => {
          const positions = [0, 25, 50, 75, 100];
          const idx = MARKERS.indexOf(m);
          const isCurrent =
            Math.abs(timeOffsetHours - m.offset) < 0.3 ||
            (m.active && timeOffsetHours === 0);
          return (
            <button
              key={m.label}
              type="button"
              onClick={() => onSelect?.(m.offset)}
              className="relative z-10 flex flex-1 flex-col items-center gap-1"
              style={{ left: `${positions[idx]}%` }}
            >
              <span
                className={cn(
                  "h-2 w-2 rounded-full border transition-all",
                  isCurrent
                    ? "border-[#3B82F6] bg-[#3B82F6] dt-online-dot"
                    : m.forecast
                      ? "border-[#F59E0B] bg-transparent"
                      : "border-[#475569] bg-[#1E293B]",
                )}
              />
              <span
                className={cn(
                  "font-mono text-[7px] uppercase tracking-wider",
                  isCurrent ? "text-[#3B82F6]" : m.forecast ? "text-[#F59E0B]" : "text-[#64748B]",
                )}
              >
                {m.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
