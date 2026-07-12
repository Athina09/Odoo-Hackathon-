import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LiveZoneState } from "@/hooks/useLiveTwinTelemetry";
import { statusLabel, type ZoneStatus } from "@/data/digital-twin";
import { STATUS_BORDER } from "@/lib/digital-twin-blueprint";

const ZONE_BG = "#0F1729";
const UNIT_BLUE = "#3B82F6";
const LABEL_STYLE = { color: "rgba(255,255,255,0.72)" } as const;

function StatusBadge({ status }: { status: ZoneStatus }) {
  const color = STATUS_BORDER[status];
  return (
    <span
      className="inline-flex shrink-0 items-center gap-1 rounded px-1.5 py-0.5"
      style={{ background: `${color}22`, border: `1px solid ${color}55` }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
      <span className="font-mono text-[8px] font-semibold uppercase tracking-wider" style={{ color }}>
        {statusLabel(status)}
      </span>
    </span>
  );
}

function MetricCell({
  label,
  value,
  pulse,
}: {
  label: string;
  value: string;
  pulse?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <span className="font-mono text-[11px]" style={LABEL_STYLE}>
        {label}
      </span>
      <span
        className={cn("font-mono text-[14px] font-semibold tabular-nums", pulse && "dt-value-pulse")}
        style={{ color: UNIT_BLUE }}
      >
        {value}
      </span>
    </div>
  );
}

export function LiveZoneWidget({
  zone,
  selected,
  onSelect,
}: {
  zone: LiveZoneState;
  selected: boolean;
  onSelect: () => void;
}) {
  const status = zone.status;
  const borderColor = selected ? "#93C5FD" : STATUS_BORDER[status];
  const forecastDelta = zone.carbonForecastDelta;
  const forecastUp = forecastDelta >= 0;

  return (
    <div className="relative h-full min-h-[88px]">
      <button
        type="button"
        onClick={onSelect}
        className={cn(
          "dt-blueprint-zone group relative flex h-full w-full flex-col overflow-hidden rounded-lg text-left transition-colors duration-200",
          "focus-visible:outline-none",
          selected && "dt-zone-selected",
        )}
        style={{
          background: ZONE_BG,
          borderWidth: 2,
          borderStyle: "solid",
          borderColor,
        }}
      >
        <div className="flex items-center justify-between gap-1 px-2.5 pt-2">
          <span
            className="min-w-0 truncate font-mono text-[11px] font-bold uppercase tracking-wide text-white"
            title={zone.name}
          >
            {zone.name}
          </span>
          <StatusBadge status={status} />
        </div>

        <div className="dt-zone-metrics flex-1 px-2.5 pb-1 pt-2">
          <div className="grid grid-cols-2 gap-x-3 gap-y-2">
            <MetricCell
              label="PWR"
              value={`${zone.energyKwh.toLocaleString()} kWh`}
              pulse={zone.pulsing.pwr}
            />
            <MetricCell
              label="CO₂"
              value={`${zone.co2Kg.toLocaleString()} kg`}
              pulse={zone.pulsing.co2}
            />
            <MetricCell label="TMP" value={`${zone.temperatureC}°C`} />
            <MetricCell label="EFF" value={`${zone.efficiencyPct}%`} />
          </div>
        </div>

        <div className="border-t border-white/10 px-2.5 py-1.5">
          <div className="dt-forecast-card flex items-center gap-2">
            <Sparkles className="h-3 w-3 shrink-0 text-[#60A5FA]" strokeWidth={2} />
            <span
              className="dt-forecast-delta font-mono text-[12px] font-semibold tabular-nums"
              style={{ color: forecastUp ? "#F59E0B" : "#22C55E" }}
            >
              {forecastUp ? "▲" : "▼"}
              {forecastUp ? "+" : ""}
              {forecastDelta}%
            </span>
            <span className="font-mono text-[10px] tabular-nums" style={{ color: "rgba(255,255,255,0.55)" }}>
              {zone.forecastConfidence}% conf
            </span>
          </div>
        </div>

        <span
          className="absolute bottom-1 right-1.5 font-mono text-[6px]"
          style={{ color: "rgba(255,255,255,0.3)" }}
          aria-hidden
        >
          {zone.zoneId.toUpperCase()}
        </span>
      </button>
    </div>
  );
}
