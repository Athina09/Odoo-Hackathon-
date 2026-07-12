import { useMemo, useState } from "react";
import { Building2, ChevronDown, Filter } from "lucide-react";
import { DataTable, KpiCard, StatusPill } from "@/components/ecosphere/ds";
import { FloorPanel } from "@/components/ecosphere/digital-twin/FloorPanel";
import { ZoneDetailPanel } from "@/components/ecosphere/digital-twin/ZoneDetailPanel";
import { useEcoAuth } from "@/context/EcoAuthContext";
import {
  buildDigitalTwinKpis,
  buildZoneHistoryRows,
  digitalTwinFacilities,
  getDefaultFacilityIdForUser,
  getDistrictForFacility,
  getFacilityById,
  getZonesForFacility,
  statusLabel,
  statusToPillTone,
  type ZoneHistoryRow,
} from "@/data/digital-twin";
import {
  DEFAULT_SIMULATION,
  computeTwinState,
} from "@/lib/digital-twin-engine";

export function DigitalTwinPage() {
  const { user, isSuperAdmin } = useEcoAuth();
  const defaultFacilityId = getDefaultFacilityIdForUser(user);
  const [facilityId, setFacilityId] = useState(defaultFacilityId);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);

  const facility = useMemo(() => getFacilityById(facilityId)!, [facilityId]);
  const baseZones = useMemo(() => getZonesForFacility(facilityId), [facilityId]);
  const sim = useMemo(() => DEFAULT_SIMULATION(facility), [facility]);

  const twinState = useMemo(
    () => computeTwinState(facility, baseZones, sim),
    [facility, baseZones, sim],
  );

  const kpis = useMemo(
    () => buildDigitalTwinKpis(facility, twinState.telemetry),
    [facility, twinState.telemetry],
  );

  const selectedZone = twinState.telemetry.find(z => z.zoneId === selectedZoneId) ?? null;
  const historyRows = useMemo(
    () => buildZoneHistoryRows(twinState.telemetry),
    [twinState.telemetry],
  );

  const handleFacilityChange = (id: string) => {
    setFacilityId(id);
    setSelectedZoneId(null);
  };

  return (
    <div className="space-y-5 p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[13px] text-[var(--text-secondary)]">
            Facilities → Digital Twin → Live Floor View
          </p>
          <div className="mt-1 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-[var(--text-secondary)]" strokeWidth={1.5} />
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Digital Twin</h1>
          </div>
          <p className="mt-1 text-sm text-[var(--text-muted)]">{facility.name}</p>
        </div>
        {isSuperAdmin && (
          <div className="flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--bg-card)] px-2 py-1">
            <Filter
              className="h-3.5 w-3.5 shrink-0 text-[var(--text-secondary)]"
              aria-hidden
              strokeWidth={1.5}
            />
            <select
              aria-label="Select facility"
              value={facilityId}
              onChange={e => handleFacilityChange(e.target.value)}
              className="max-w-[14rem] cursor-pointer bg-transparent py-0.5 text-sm text-[var(--text-primary)] outline-none"
            >
              {digitalTwinFacilities.map(f => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
            <ChevronDown
              className="h-3 w-3 shrink-0 text-[var(--text-secondary)]"
              aria-hidden
              strokeWidth={1.5}
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map(kpi => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,65%)_minmax(0,35%)]">
        <FloorPanel
          facility={facility}
          zones={twinState.telemetry}
          selectedZoneId={selectedZoneId}
          onSelectZone={setSelectedZoneId}
          districtLabel={getDistrictForFacility(facilityId)}
        />
        <ZoneDetailPanel
          facility={facility}
          zones={twinState.telemetry}
          selectedZone={selectedZone}
          prediction={twinState.prediction}
        />
      </div>

      <DataTable<ZoneHistoryRow>
        title="Zone History"
        subtitle="Current readings · 24h rolling window"
        rows={historyRows}
        columns={[
          { key: "zone", header: "Zone", render: r => <span className="text-[13px]">{r.zone}</span> },
          {
            key: "status",
            header: "Current Status",
            render: r => (
              <StatusPill label={statusLabel(r.status)} tone={statusToPillTone(r.status)} />
            ),
          },
          {
            key: "energy",
            header: "Energy (24h)",
            render: r => `${r.energy24h.toLocaleString()} kWh`,
            align: "right",
          },
          {
            key: "co2",
            header: "CO₂ (24h)",
            render: r => `${r.co2_24h.toLocaleString()} kg`,
            align: "right",
          },
          { key: "occupancy", header: "Occupancy", render: r => r.occupancy },
          {
            key: "incident",
            header: "Last Incident",
            render: r => (
              <span className="text-[13px] text-[var(--text-secondary)]">{r.lastIncident}</span>
            ),
          },
        ]}
        onOpen={row => setSelectedZoneId(row.id)}
      />
    </div>
  );
}
