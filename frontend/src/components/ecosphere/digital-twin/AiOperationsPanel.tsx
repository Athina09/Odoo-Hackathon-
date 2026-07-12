import { useMemo, useState, type ReactNode } from "react";
import { AlertTriangle, Bot, ChevronRight, CircleDot } from "lucide-react";
import { ConfidenceBar } from "@/components/ecosphere/ds";
import { getZoneHistory, statusLabel, type DigitalTwinFacility } from "@/data/digital-twin";
import type { ZoneTelemetry, TwinPrediction, SensorFeedItem } from "@/lib/digital-twin-engine";
import { STATUS_COLORS } from "@/lib/digital-twin-industrial";
import { buildTrendSeries } from "@/lib/digital-twin-prediction";
import { TwinTrendChart, type TrendMetric } from "./TwinTrendChart";

function HealthGauge({ value }: { value: number }) {
  const angle = (value / 100) * 180;
  const color = value >= 85 ? STATUS_COLORS.normal : value >= 70 ? STATUS_COLORS.watch : STATUS_COLORS.critical;
  return (
    <div className="relative mx-auto h-[72px] w-[120px]">
      <svg viewBox="0 0 120 70" className="h-full w-full">
        <path d="M 10 60 A 50 50 0 0 1 110 60" fill="none" stroke="var(--border)" strokeWidth="6" strokeLinecap="round" />
        <path
          d="M 10 60 A 50 50 0 0 1 110 60"
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={`${(angle / 180) * 157} 157`}
        />
      </svg>
      <div className="absolute inset-x-0 bottom-0 text-center">
        <div className="text-xl font-bold tabular-nums text-[var(--text-primary)]">{value}</div>
        <div className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Health Index</div>
      </div>
    </div>
  );
}

function PanelSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="border-b border-[var(--border)] py-3 last:border-0">
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.05em] text-[var(--text-secondary)]">{title}</div>
      {children}
    </div>
  );
}

function CarbonRow({ label, value, delta }: { label: string; value: number; delta?: number }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-[13px] text-[var(--text-secondary)]">{label}</span>
      <div className="text-right">
        <span className="text-sm font-semibold tabular-nums text-[var(--text-primary)]">{value.toFixed(2)} t</span>
        {delta !== undefined && (
          <span
            className="ml-1.5 text-xs font-medium"
            style={{ color: delta > 0 ? "var(--accent-amber)" : "var(--accent-green)" }}
          >
            {delta >= 0 ? "▲" : "▼"} {Math.abs(delta)}%
          </span>
        )}
      </div>
    </div>
  );
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-[var(--border)] py-2 last:border-0">
      <span className="text-[13px] text-[var(--text-secondary)]">{label}</span>
      <span className="text-sm font-semibold text-[var(--text-primary)]">{value}</span>
    </div>
  );
}

function ZoneDetailSection({ zone, facilityId }: { zone: ZoneTelemetry; facilityId: string }) {
  const [metric, setMetric] = useState<TrendMetric>("carbon");
  const history = getZoneHistory(facilityId, zone.zoneId);
  const allowNegative = zone.co2Kg < 0;

  const series = useMemo(() => {
    const values = metric === "carbon" ? history.co2KgLast14Days : history.energyKwhLast14Days;
    return buildTrendSeries(values, allowNegative);
  }, [metric, history, allowNegative]);

  return (
    <>
      <PanelSection title={`${zone.name} — Trend`}>
        <TwinTrendChart series={series} metric={metric} onMetricChange={setMetric} compact />
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-[var(--text-muted)]">Prediction confidence</span>
          <ConfidenceBar value={series.confidence} />
        </div>
        <div className="mt-1 text-xs text-[var(--text-muted)]">
          7-day projection: {series.projectedDeltaPct >= 0 ? "+" : ""}
          {series.projectedDeltaPct}% vs current
        </div>
      </PanelSection>

      <PanelSection title="Live Metrics">
        <MetricRow label="Power Draw" value={`${zone.energyKwh.toLocaleString()} kWh`} />
        <MetricRow label="Carbon Emissions" value={`${zone.co2Tonnes.toFixed(2)} tCO₂`} />
        <MetricRow label="Machine Utilization" value={`${zone.utilizationPct}%`} />
        <MetricRow label="Temperature" value={`${zone.temperatureC}°C`} />
        <MetricRow label="Efficiency" value={`${zone.efficiencyPct}%`} />
        <MetricRow label="Status" value={statusLabel(zone.status)} />
      </PanelSection>
    </>
  );
}

export function AiOperationsPanel({
  facility,
  zones,
  selectedZone,
  prediction,
  alerts,
}: {
  facility: DigitalTwinFacility;
  zones: ZoneTelemetry[];
  selectedZone: ZoneTelemetry | null;
  prediction: TwinPrediction;
  alerts: SensorFeedItem[];
}) {
  const criticalCount = zones.filter(z => z.status === "critical").length;
  const watchCount = zones.filter(z => z.status === "watch").length;

  return (
    <div className="eco-card flex h-full min-h-[520px] flex-col overflow-hidden">
      <div className="border-b border-[var(--border)] px-4 py-3">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4 text-[var(--accent-teal)]" strokeWidth={1.5} />
          <span className="text-xs font-semibold uppercase tracking-[0.05em] text-[var(--text-secondary)]">
            AI Operations Console
          </span>
        </div>
        <h2 className="mt-1 text-lg font-bold text-[var(--text-primary)]">{facility.name}</h2>
        {selectedZone && (
          <div className="mt-1 text-xs font-medium text-[var(--accent-blue)]">
            Selected: {selectedZone.zoneId.toUpperCase()} — {selectedZone.name}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4">
        {selectedZone ? (
          <ZoneDetailSection zone={selectedZone} facilityId={facility.id} />
        ) : (
          <PanelSection title="Facility Health">
            <HealthGauge value={prediction.facilityHealth} />
            <div className="mt-2 flex justify-center gap-4 text-xs text-[var(--text-muted)]">
              <span style={{ color: criticalCount ? "var(--accent-red)" : undefined }}>
                {criticalCount} Critical
              </span>
              <span style={{ color: watchCount ? "var(--accent-amber)" : undefined }}>
                {watchCount} Warning
              </span>
              <span>{zones.length - criticalCount - watchCount} Healthy</span>
            </div>
          </PanelSection>
        )}

        <PanelSection title="Carbon Emissions">
          <CarbonRow label="Current" value={prediction.currentCarbonT} />
          <CarbonRow
            label="Predicted +2h"
            value={prediction.predicted2h}
            delta={
              prediction.currentCarbonT > 0
                ? Math.round(((prediction.predicted2h - prediction.currentCarbonT) / prediction.currentCarbonT) * 100)
                : 0
            }
          />
          <CarbonRow
            label="Predicted +6h"
            value={prediction.predicted6h}
            delta={
              prediction.currentCarbonT > 0
                ? Math.round(((prediction.predicted6h - prediction.currentCarbonT) / prediction.currentCarbonT) * 100)
                : 0
            }
          />
          <CarbonRow
            label="Predicted +24h"
            value={prediction.predicted24h}
            delta={
              prediction.currentCarbonT > 0
                ? Math.round(((prediction.predicted24h - prediction.currentCarbonT) / prediction.currentCarbonT) * 100)
                : 0
            }
          />
          <div className="mt-2 flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--bg-page)] px-2 py-1.5">
            <span className="text-xs text-[var(--text-muted)]">Carbon Forecast</span>
            <span
              className="text-sm font-semibold"
              style={{ color: prediction.carbonForecastDelta > 0 ? "var(--accent-amber)" : "var(--accent-green)" }}
            >
              {prediction.carbonForecastDelta >= 0 ? "▲" : "▼"} {Math.abs(prediction.carbonForecastDelta)}%
            </span>
            <span className="text-xs text-[var(--text-muted)]">Confidence {prediction.confidence}%</span>
          </div>
        </PanelSection>

        {!selectedZone && (
          <>
            <PanelSection title="Root Cause Analysis">
              <div className="flex flex-wrap gap-1">
                {prediction.rootCause.map(tag => (
                  <span
                    key={tag}
                    className="rounded border border-[var(--border)] bg-[var(--bg-page)] px-1.5 py-0.5 text-xs text-[var(--text-secondary)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-xs leading-relaxed text-[var(--text-muted)]">
                Primary factors: {prediction.factors.join(" · ")}
              </p>
            </PanelSection>

            <PanelSection title="Recommended Actions">
              <div className="mb-2 text-sm font-semibold text-[var(--text-primary)]">{prediction.recommendation.title}</div>
              <ul className="space-y-1.5">
                {prediction.recommendation.bullets.map(b => (
                  <li key={b} className="flex items-start gap-1.5 text-xs text-[var(--text-secondary)]">
                    <ChevronRight className="mt-0.5 h-3 w-3 shrink-0 text-[var(--accent-teal)]" />
                    {b}
                  </li>
                ))}
              </ul>
            </PanelSection>
          </>
        )}

        <PanelSection title="Active Alerts">
          <div className="max-h-[140px] space-y-1.5 overflow-y-auto">
            {alerts.filter(a => a.alert).map((item, i) => (
              <div
                key={`${item.time}-${i}`}
                className="flex items-start gap-2 rounded-lg border border-[var(--accent-red)]/30 bg-[var(--accent-red-bg)] px-2 py-1.5"
              >
                <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-[var(--accent-red)]" strokeWidth={1.5} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-[var(--text-muted)]">{item.time}</span>
                    <CircleDot className="h-1.5 w-1.5 text-[var(--accent-red)]" />
                  </div>
                  <div className="text-xs text-[var(--text-primary)]">
                    {item.source} — {item.metric}
                  </div>
                  <div className="text-xs font-semibold text-[var(--accent-red)]">{item.value}</div>
                </div>
              </div>
            ))}
            {alerts.filter(a => a.alert).length === 0 && (
              <p className="text-xs text-[var(--text-muted)]">No active alerts</p>
            )}
          </div>
        </PanelSection>
      </div>
    </div>
  );
}
