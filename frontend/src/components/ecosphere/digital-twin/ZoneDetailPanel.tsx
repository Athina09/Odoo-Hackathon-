import { StatusPill } from "@/components/ecosphere/ds";
import {
  type DigitalTwinFacility,
  computeFacilityHealth,
  statusLabel,
  statusToPillTone,
} from "@/data/digital-twin";
import type { ZoneTelemetry, TwinPrediction } from "@/lib/digital-twin-engine";
import { shortRootCause, zoneEnergyDeltaPct } from "@/lib/digital-twin-blueprint";

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-[var(--border)] py-2 last:border-0">
      <span className="text-[13px] text-[var(--text-secondary)]">{label}</span>
      <span className="text-sm font-semibold text-[var(--text-primary)]">{value}</span>
    </div>
  );
}

function FacilitySummary({
  facility,
  zones,
  prediction,
}: {
  facility: DigitalTwinFacility;
  zones: ZoneTelemetry[];
  prediction: TwinPrediction;
}) {
  const health = computeFacilityHealth(zones);
  const watchZones = zones.filter(z => z.status === "watch" || z.status === "critical");
  const totalEnergy = zones.reduce((sum, z) => sum + Math.max(0, z.energyKwh), 0);

  return (
    <>
      <h2 className="text-lg font-bold text-[var(--text-primary)]">{facility.name}</h2>
      <p className="mt-1 text-[13px] text-[var(--text-muted)]">
        Facility-wide summary — select a zone on the floor plan for drill-down
      </p>
      <div className="mt-3 space-y-0">
        <MetricRow label="Overall facility health" value={`${health}%`} />
        <MetricRow label="Zones monitored" value={`${zones.length}`} />
        <MetricRow label="Total live energy draw" value={`${totalEnergy.toLocaleString()} kWh`} />
        <MetricRow label="Net carbon" value={`${prediction.currentCarbonT} tCO₂`} />
        <MetricRow label="Prediction confidence" value={`${prediction.confidence}%`} />
      </div>
      {watchZones.length > 0 && (
        <div className="mt-4">
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.05em] text-[var(--text-secondary)]">
            Zones in watch / critical
          </div>
          <div className="space-y-1.5">
            {watchZones.map(z => (
              <div key={z.zoneId} className="flex items-center justify-between text-sm">
                <span className="text-[var(--text-primary)]">{z.name}</span>
                <StatusPill label={statusLabel(z.status)} tone={statusToPillTone(z.status)} />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function ZoneDetail({
  zone,
  prediction,
}: {
  zone: ZoneTelemetry;
  prediction: TwinPrediction;
}) {
  const delta = zoneEnergyDeltaPct(zone.energyKwh, zone.energyBaselineKwh);
  const rootCause = shortRootCause(zone.topContributor);

  return (
    <>
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
            {zone.zoneId.toUpperCase()}
          </div>
          <h2 className="text-lg font-bold text-[var(--text-primary)]">{zone.name}</h2>
        </div>
        <StatusPill label={statusLabel(zone.status)} tone={statusToPillTone(zone.status)} />
      </div>

      <div className="mb-3 flex gap-3 rounded-lg border border-[var(--border)] bg-[var(--bg-page)] px-3 py-2">
        <div>
          <div className="text-[10px] uppercase text-[var(--text-muted)]">Δ vs baseline</div>
          <div
            className="text-lg font-bold"
            style={{
              color: delta > 20 ? "var(--accent-red)" : delta > 0 ? "var(--accent-amber)" : "var(--accent-green)",
            }}
          >
            {delta >= 0 ? "+" : ""}
            {delta}%
          </div>
        </div>
        <div className="border-l border-[var(--border)] pl-3">
          <div className="text-[10px] uppercase text-[var(--text-muted)]">Root cause</div>
          <div className="text-sm font-semibold text-[var(--text-primary)]">{rootCause}</div>
        </div>
      </div>

      <div className="space-y-0">
        <MetricRow label="Energy (24h)" value={`${zone.energyKwh.toLocaleString()} kWh`} />
        <MetricRow label="CO₂ (24h)" value={`${zone.co2Kg.toLocaleString()} kg`} />
        <MetricRow
          label="Occupancy"
          value={`${zone.occupancy} / ${zone.occupancyCapacity}`}
        />
        <MetricRow label="Uptime" value={`${zone.uptimePct}%`} />
        <MetricRow label="Efficiency" value={`${zone.efficiencyPct}%`} />
        <MetricRow label="Temperature" value={`${zone.temperatureC}°C`} />
      </div>

      <div className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--bg-page)] px-3 py-2.5">
        <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.05em] text-[var(--text-secondary)]">
          AI Insight
        </div>
        <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{zone.aiNote}</p>
        <p className="mt-2 text-xs text-[var(--text-muted)]">
          Model confidence: {prediction.confidence}% · Top factor: {zone.topContributor}
        </p>
      </div>
    </>
  );
}

export function ZoneDetailPanel({
  facility,
  zones,
  selectedZone,
  prediction,
}: {
  facility: DigitalTwinFacility;
  zones: ZoneTelemetry[];
  selectedZone: ZoneTelemetry | null;
  prediction: TwinPrediction;
}) {
  return (
    <div className="eco-card flex h-full min-h-[480px] flex-col p-4">
      {selectedZone ? (
        <ZoneDetail zone={selectedZone} prediction={prediction} />
      ) : (
        <FacilitySummary facility={facility} zones={zones} prediction={prediction} />
      )}
    </div>
  );
}
