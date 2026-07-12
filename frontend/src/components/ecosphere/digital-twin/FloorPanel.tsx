import { DarkMapShell } from "@/components/ecosphere/ds/DarkMapShell";
import type { DigitalTwinFacility } from "@/data/digital-twin";
import { gridPlacementStyle } from "@/data/digital-twin";
import type { ZoneTelemetry } from "@/lib/digital-twin-engine";
import { useLiveTwinTelemetry } from "@/hooks/useLiveTwinTelemetry";
import { LiveZoneWidget } from "./LiveZoneWidget";
import { BlueprintCoordinateLabels, BlueprintWallsOverlay } from "./BlueprintOverlays";

export function FloorPanel({
  facility,
  zones,
  selectedZoneId,
  onSelectZone,
  districtLabel,
  compact = false,
  aiConfidence,
}: {
  facility: DigitalTwinFacility;
  zones: ZoneTelemetry[];
  selectedZoneId: string | null;
  onSelectZone: (zoneId: string) => void;
  districtLabel?: string;
  compact?: boolean;
  aiConfidence?: number;
}) {
  const liveZones = useLiveTwinTelemetry(zones, false);
  const floorMinH = compact ? 260 : 440;
  const gridMinH = compact ? 220 : 380;
  const rowMin = compact ? 52 : 72;

  return (
    <div className="dt-floor-panel">
      <DarkMapShell
        label="Plant Blueprint"
        subtitle={`${facility.name} · ${facility.id}${districtLabel ? ` · ${districtLabel}` : ""}`}
        actions={
          <span className="flex items-center gap-2 font-mono text-[8px] uppercase tracking-wider">
            {aiConfidence != null && (
              <span className="rounded border border-cyan-500/30 bg-cyan-950/50 px-1.5 py-0.5 text-cyan-200">
                AI {aiConfidence}%
              </span>
            )}
            <span className="flex items-center gap-1.5 text-[#60A5FA]">
              <span className="dt-online-dot h-1 w-1 rounded-full bg-[#60A5FA]" />
              Live SCADA
            </span>
          </span>
        }
      >
        <div className="relative px-3 pb-3 pt-2 sm:px-6 sm:pb-5" style={{ minHeight: floorMinH }}>
          {!compact && <BlueprintCoordinateLabels columns={facility.gridColumns} rows={facility.gridRows} />}
          <BlueprintWallsOverlay facilityId={facility.id} />

          <div
            className="relative z-20 grid gap-[3px]"
            style={{
              gridTemplateColumns: `repeat(${facility.gridColumns}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${facility.gridRows}, minmax(${rowMin}px, 1fr))`,
              minHeight: gridMinH,
            }}
          >
            {liveZones.map(zone => (
              <div
                key={zone.zoneId}
                style={gridPlacementStyle(zone.gridPosition)}
                className="min-h-0"
              >
                <LiveZoneWidget
                  zone={zone}
                  selected={selectedZoneId === zone.zoneId}
                  onSelect={() => onSelectZone(zone.zoneId)}
                />
              </div>
            ))}
          </div>
        </div>
      </DarkMapShell>
    </div>
  );
}
