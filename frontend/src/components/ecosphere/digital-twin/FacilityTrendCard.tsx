import { useMemo, useState } from "react";
import { TrendingUp } from "lucide-react";
import { ConfidenceBar } from "@/components/ecosphere/ds";
import {
  getFacilityCo2History,
  getFacilityEnergyHistory,
  getZoneHistory,
  type DigitalTwinFacility,
  type DigitalTwinZone,
} from "@/data/digital-twin";
import { buildTrendSeries, generateFacilityCarbonAiNote, findTopTrendZone } from "@/lib/digital-twin-prediction";
import { TwinTrendChart, type TrendMetric } from "./TwinTrendChart";

export function FacilityTrendCard({
  facility,
  zones,
}: {
  facility: DigitalTwinFacility;
  zones: DigitalTwinZone[];
}) {
  const [metric, setMetric] = useState<TrendMetric>("carbon");

  const series = useMemo(() => {
    const history =
      metric === "carbon"
        ? getFacilityCo2History(facility.id)
        : getFacilityEnergyHistory(facility.id);
    return buildTrendSeries(history);
  }, [facility.id, metric]);

  const aiNote = useMemo(() => {
    const historyMap = Object.fromEntries(
      zones.map(z => [z.zoneId, getZoneHistory(facility.id, z.zoneId)]),
    );
    const top = findTopTrendZone(zones, historyMap);
    const offsetZone = zones.find(z => z.zoneId === "z4") ?? zones[zones.length - 1];
    return generateFacilityCarbonAiNote({
      topZoneName: top.name,
      projectedRisePct: series.projectedDeltaPct,
      offsetZoneName: offsetZone?.name ?? "downstream zone",
      offsetPct: Math.round(Math.abs(series.projectedDeltaPct) * 0.45),
    });
  }, [zones, facility.id, series.projectedDeltaPct]);

  return (
    <div className="eco-card p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-[var(--text-secondary)]" strokeWidth={1.5} />
          <span className="text-xs font-semibold uppercase tracking-[0.05em] text-[var(--text-secondary)]">
            Facility Carbon Trend — Actual + Predicted
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--text-muted)]">Prediction confidence</span>
          <ConfidenceBar value={series.confidence} />
        </div>
      </div>

      <TwinTrendChart series={series} metric={metric} onMetricChange={setMetric} />

      <div className="mt-3 rounded-lg border border-[var(--border)] bg-[var(--bg-page)] px-3 py-2.5">
        <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.05em] text-[var(--text-secondary)]">
          AI Insight
        </div>
        <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{aiNote}</p>
      </div>
    </div>
  );
}
