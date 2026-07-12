import { useMemo, useState } from "react";
import { FloorPanel } from "@/components/ecosphere/digital-twin/FloorPanel";
import { getDistrictForFacility } from "@/data/digital-twin";
import { DEFAULT_SIMULATION, computeTwinState } from "@/lib/digital-twin-engine";
import type { FacilityEnergySnapshot, ImpactNarrative } from "@/lib/employee-impact";
import { AiConfidenceBadge } from "@/components/ecosphere/ds/AiConfidenceBadge";
import { EmployeeImpactNarrative } from "./EmployeeImpactNarrative";

/** Compact live digital twin for employee view */
export function EmployeeTwinPanel({
  facility,
  narratives,
}: {
  facility: FacilityEnergySnapshot;
  narratives: ImpactNarrative[];
}) {
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const twinFacility = facility.facility;

  const twinState = useMemo(() => {
    const sim = DEFAULT_SIMULATION(twinFacility);
    return computeTwinState(twinFacility, facility.zones, sim);
  }, [twinFacility, facility.zones]);

  const district = getDistrictForFacility(twinFacility.id);

  return (
    <section className="eco-card overflow-hidden p-0">
      <FloorPanel
        facility={twinFacility}
        zones={twinState.telemetry}
        selectedZoneId={selectedZoneId}
        onSelectZone={setSelectedZoneId}
        districtLabel={district}
        compact
        aiConfidence={twinState.prediction.confidence}
      />
      <div className="border-t border-[var(--border)] bg-[var(--bg-page)] px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-[11px] text-[var(--text-muted)]">
            Live twin · {facility.totalDrawKwh.toLocaleString()} kWh draw
          </span>
          <span className="font-semibold text-[var(--accent-teal)]">
            −{facility.facilityReductionPct}% vs baseline
          </span>
        </div>
        <div className="mt-2">
          <AiConfidenceBadge
            value={twinState.prediction.confidence}
            label="AI twin confidence"
            compact
          />
        </div>
      </div>

      <EmployeeImpactNarrative narratives={narratives} />
    </section>
  );
}
