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
}: {
  facility: DigitalTwinFacility;
  zones: ZoneTelemetry[];
  selectedZoneId: string | null;
  onSelectZone: (zoneId: string) => void;
  districtLabel?: string;
}) {
  const liveZones = useLiveTwinTelemetry(zones, false);

  return (
    <div className="dt-floor-panel">
      <DarkMapShell
        label="Plant Blueprint"
        subtitle={`${facility.name} · ${facility.id}${districtLabel ? ` · ${districtLabel}` : ""}`}
        actions={
          <span className="flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-wider text-[#60A5FA]">
            <span className="dt-online-dot h-1 w-1 rounded-full bg-[#60A5FA]" />
            Live SCADA
          </span>
        }
      >
        <div className="relative px-6 pb-5 pt-2" style={{ minHeight: 440 }}>
          <BlueprintCoordinateLabels columns={facility.gridColumns} rows={facility.gridRows} />
          <BlueprintWallsOverlay facilityId={facility.id} />

          <div
            className="relative z-20 grid gap-[3px]"
            style={{
              gridTemplateColumns: `repeat(${facility.gridColumns}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${facility.gridRows}, minmax(72px, 1fr))`,
              minHeight: 380,
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
