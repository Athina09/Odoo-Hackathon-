import type { CSSProperties } from "react";
import type { KpiCardProps, PillTone } from "@/components/ecosphere/ds";
import { Activity, AlertTriangle, Leaf, Zap } from "lucide-react";
import type { EcoSessionUser } from "@/lib/ecosphere-auth";

export type ZoneStatus = "normal" | "watch" | "critical";

export interface GridPosition {
  colStart: number;
  colEnd: number;
  rowStart: number;
  rowEnd: number;
}

export interface DigitalTwinFacility {
  id: string;
  name: string;
  departmentIds: string[];
  solarOffsetKwh: number;
  gridColumns: number;
  gridRows: number;
}

export interface DigitalTwinZoneRaw {
  facilityId: string;
  zoneId: string;
  name: string;
  energyKwh: number;
  energyBaselineKwh: number;
  co2Kg: number;
  occupancy: number;
  occupancyCapacity: number;
  uptimePct: number;
  topContributor: string;
  gridPosition: GridPosition;
  lastIncident: string;
}

export interface DigitalTwinZone extends DigitalTwinZoneRaw {
  status: ZoneStatus;
  aiNote: string;
}

export const FACILITY_DISTRICT_MAP: Record<string, string> = {
  FAC001: "Chennai",
  FAC002: "Coimbatore",
  FAC003: "Madurai",
  FAC004: "Chennai",
  FAC005: "Chennai",
};

export function getDistrictForFacility(facilityId: string): string {
  return FACILITY_DISTRICT_MAP[facilityId] ?? "Chennai";
}

export const digitalTwinFacilities: DigitalTwinFacility[] = [
  {
    id: "FAC001",
    name: "Chennai Manufacturing Plant",
    departmentIds: ["DEP001"],
    solarOffsetKwh: 120,
    gridColumns: 4,
    gridRows: 4,
  },
  {
    id: "FAC002",
    name: "Coimbatore Data Center",
    departmentIds: ["DEP006"],
    solarOffsetKwh: 45,
    gridColumns: 3,
    gridRows: 3,
  },
  {
    id: "FAC003",
    name: "Madurai Operations Hub",
    departmentIds: ["DEP004"],
    solarOffsetKwh: 80,
    gridColumns: 4,
    gridRows: 3,
  },
  {
    id: "FAC004",
    name: "Chennai Fleet Depot",
    departmentIds: ["DEP005"],
    solarOffsetKwh: 0,
    gridColumns: 3,
    gridRows: 3,
  },
  {
    id: "FAC005",
    name: "Chennai HQ Office",
    departmentIds: ["DEP002", "DEP003"],
    solarOffsetKwh: 65,
    gridColumns: 3,
    gridRows: 2,
  },
];

export const DEPARTMENT_FACILITY_MAP: Record<string, string> = {
  DEP001: "FAC001",
  DEP002: "FAC005",
  DEP003: "FAC005",
  DEP004: "FAC003",
  DEP005: "FAC004",
  DEP006: "FAC002",
};

export const digitalTwinZonesRaw: DigitalTwinZoneRaw[] = [
  // Chennai Manufacturing Plant
  {
    facilityId: "FAC001",
    zoneId: "z1",
    name: "Production Line 1",
    energyKwh: 2840,
    energyBaselineKwh: 2200,
    co2Kg: 1390,
    occupancy: 38,
    occupancyCapacity: 45,
    uptimePct: 96.2,
    topContributor: "CNC spindle motors + HVAC",
    gridPosition: { colStart: 1, colEnd: 3, rowStart: 1, rowEnd: 3 },
    lastIncident: "Jul 1 — peak load 18% over target",
  },
  {
    facilityId: "FAC001",
    zoneId: "z2",
    name: "Production Line 2",
    energyKwh: 1980,
    energyBaselineKwh: 2100,
    co2Kg: 970,
    occupancy: 32,
    occupancyCapacity: 45,
    uptimePct: 98.1,
    topContributor: "Conveyor + lighting",
    gridPosition: { colStart: 3, colEnd: 5, rowStart: 1, rowEnd: 3 },
    lastIncident: "None in 30 days",
  },
  {
    facilityId: "FAC001",
    zoneId: "z3",
    name: "Assembly Floor",
    energyKwh: 1120,
    energyBaselineKwh: 900,
    co2Kg: 549,
    occupancy: 24,
    occupancyCapacity: 30,
    uptimePct: 94.5,
    topContributor: "Pneumatic tools + compressed air",
    gridPosition: { colStart: 1, colEnd: 3, rowStart: 3, rowEnd: 4 },
    lastIncident: "Jun 28 — air leak repaired",
  },
  {
    facilityId: "FAC001",
    zoneId: "z4",
    name: "Raw Materials Warehouse",
    energyKwh: 420,
    energyBaselineKwh: 450,
    co2Kg: 206,
    occupancy: 6,
    occupancyCapacity: 12,
    uptimePct: 99.2,
    topContributor: "Cold storage units",
    gridPosition: { colStart: 3, colEnd: 5, rowStart: 3, rowEnd: 4 },
    lastIncident: "None in 30 days",
  },
  {
    facilityId: "FAC001",
    zoneId: "z5",
    name: "Generator Room",
    energyKwh: 1680,
    energyBaselineKwh: 400,
    co2Kg: 1120,
    occupancy: 2,
    occupancyCapacity: 4,
    uptimePct: 88.0,
    topContributor: "Diesel backup generator (420 L)",
    gridPosition: { colStart: 1, colEnd: 2, rowStart: 4, rowEnd: 5 },
    lastIncident: "Jul 2 — backup gen ran 6h during grid outage",
  },
  {
    facilityId: "FAC001",
    zoneId: "z6",
    name: "Office Wing",
    energyKwh: 310,
    energyBaselineKwh: 350,
    co2Kg: 152,
    occupancy: 18,
    occupancyCapacity: 25,
    uptimePct: 99.8,
    topContributor: "Office HVAC + workstations",
    gridPosition: { colStart: 2, colEnd: 5, rowStart: 4, rowEnd: 5 },
    lastIncident: "None in 30 days",
  },
  // Coimbatore Data Center
  {
    facilityId: "FAC002",
    zoneId: "z1",
    name: "Server Hall A",
    energyKwh: 3100,
    energyBaselineKwh: 2800,
    co2Kg: 1520,
    occupancy: 4,
    occupancyCapacity: 6,
    uptimePct: 99.97,
    topContributor: "Rack cooling + compute load",
    gridPosition: { colStart: 1, colEnd: 3, rowStart: 1, rowEnd: 3 },
    lastIncident: "Jul 4 — cooling setpoint adjusted",
  },
  {
    facilityId: "FAC002",
    zoneId: "z2",
    name: "Server Hall B",
    energyKwh: 2400,
    energyBaselineKwh: 2500,
    co2Kg: 1176,
    occupancy: 3,
    occupancyCapacity: 6,
    uptimePct: 99.95,
    topContributor: "CRAC units",
    gridPosition: { colStart: 3, colEnd: 4, rowStart: 1, rowEnd: 3 },
    lastIncident: "None in 30 days",
  },
  {
    facilityId: "FAC002",
    zoneId: "z3",
    name: "Network Ops",
    energyKwh: 180,
    energyBaselineKwh: 200,
    co2Kg: 88,
    occupancy: 5,
    occupancyCapacity: 8,
    uptimePct: 99.9,
    topContributor: "Switch gear + UPS",
    gridPosition: { colStart: 1, colEnd: 2, rowStart: 3, rowEnd: 4 },
    lastIncident: "None in 30 days",
  },
  {
    facilityId: "FAC002",
    zoneId: "z4",
    name: "Solar Array",
    energyKwh: -45,
    energyBaselineKwh: 40,
    co2Kg: -22,
    occupancy: 0,
    occupancyCapacity: 0,
    uptimePct: 100,
    topContributor: "Rooftop PV generation",
    gridPosition: { colStart: 2, colEnd: 4, rowStart: 3, rowEnd: 4 },
    lastIncident: "None in 30 days",
  },
  // Madurai Operations Hub
  {
    facilityId: "FAC003",
    zoneId: "z1",
    name: "Loading Bay",
    energyKwh: 890,
    energyBaselineKwh: 750,
    co2Kg: 436,
    occupancy: 12,
    occupancyCapacity: 20,
    uptimePct: 95.0,
    topContributor: "Dock doors + refrigeration",
    gridPosition: { colStart: 1, colEnd: 3, rowStart: 1, rowEnd: 2 },
    lastIncident: "Jul 2 — dock door sensor fault",
  },
  {
    facilityId: "FAC003",
    zoneId: "z2",
    name: "Cold Storage",
    energyKwh: 1420,
    energyBaselineKwh: 1100,
    co2Kg: 696,
    occupancy: 4,
    occupancyCapacity: 8,
    uptimePct: 97.2,
    topContributor: "Compressor banks",
    gridPosition: { colStart: 3, colEnd: 5, rowStart: 1, rowEnd: 2 },
    lastIncident: "Jun 30 — temp excursion logged",
  },
  {
    facilityId: "FAC003",
    zoneId: "z3",
    name: "Sorting Floor",
    energyKwh: 620,
    energyBaselineKwh: 600,
    co2Kg: 304,
    occupancy: 16,
    occupancyCapacity: 22,
    uptimePct: 96.8,
    topContributor: "Belt conveyors",
    gridPosition: { colStart: 1, colEnd: 3, rowStart: 2, rowEnd: 3 },
    lastIncident: "None in 30 days",
  },
  {
    facilityId: "FAC003",
    zoneId: "z4",
    name: "Admin Block",
    energyKwh: 210,
    energyBaselineKwh: 240,
    co2Kg: 103,
    occupancy: 8,
    occupancyCapacity: 12,
    uptimePct: 99.5,
    topContributor: "Office lighting",
    gridPosition: { colStart: 3, colEnd: 5, rowStart: 2, rowEnd: 3 },
    lastIncident: "None in 30 days",
  },
  // Chennai Fleet Depot
  {
    facilityId: "FAC004",
    zoneId: "z1",
    name: "Vehicle Bay A",
    energyKwh: 420,
    energyBaselineKwh: 380,
    co2Kg: 1104,
    occupancy: 8,
    occupancyCapacity: 12,
    uptimePct: 93.0,
    topContributor: "Fleet diesel idling + workshop",
    gridPosition: { colStart: 1, colEnd: 2, rowStart: 1, rowEnd: 3 },
    lastIncident: "Jun 30 — fleet diesel batch logged",
  },
  {
    facilityId: "FAC004",
    zoneId: "z2",
    name: "Vehicle Bay B",
    energyKwh: 380,
    energyBaselineKwh: 350,
    co2Kg: 980,
    occupancy: 6,
    occupancyCapacity: 12,
    uptimePct: 94.2,
    topContributor: "Diesel pumps + maintenance bay",
    gridPosition: { colStart: 2, colEnd: 3, rowStart: 1, rowEnd: 3 },
    lastIncident: "Jul 3 — route CHN–CBE refuel",
  },
  {
    facilityId: "FAC004",
    zoneId: "z3",
    name: "Driver Lounge",
    energyKwh: 95,
    energyBaselineKwh: 110,
    co2Kg: 47,
    occupancy: 14,
    occupancyCapacity: 20,
    uptimePct: 99.0,
    topContributor: "HVAC + kitchen",
    gridPosition: { colStart: 3, colEnd: 4, rowStart: 1, rowEnd: 2 },
    lastIncident: "None in 30 days",
  },
  {
    facilityId: "FAC004",
    zoneId: "z4",
    name: "Dispatch Office",
    energyKwh: 72,
    energyBaselineKwh: 80,
    co2Kg: 35,
    occupancy: 5,
    occupancyCapacity: 8,
    uptimePct: 99.5,
    topContributor: "Workstations",
    gridPosition: { colStart: 3, colEnd: 4, rowStart: 2, rowEnd: 3 },
    lastIncident: "None in 30 days",
  },
  // Chennai HQ Office
  {
    facilityId: "FAC005",
    zoneId: "z1",
    name: "HR Floor",
    energyKwh: 280,
    energyBaselineKwh: 320,
    co2Kg: 137,
    occupancy: 16,
    occupancyCapacity: 18,
    uptimePct: 99.9,
    topContributor: "Open-plan HVAC",
    gridPosition: { colStart: 1, colEnd: 2, rowStart: 1, rowEnd: 2 },
    lastIncident: "None in 30 days",
  },
  {
    facilityId: "FAC005",
    zoneId: "z2",
    name: "Finance Wing",
    energyKwh: 190,
    energyBaselineKwh: 220,
    co2Kg: 93,
    occupancy: 12,
    occupancyCapacity: 15,
    uptimePct: 99.8,
    topContributor: "Hybrid workstations (low occupancy)",
    gridPosition: { colStart: 2, colEnd: 3, rowStart: 1, rowEnd: 2 },
    lastIncident: "None in 30 days",
  },
  {
    facilityId: "FAC005",
    zoneId: "z3",
    name: "Shared Facilities",
    energyKwh: 145,
    energyBaselineKwh: 160,
    co2Kg: 71,
    occupancy: 8,
    occupancyCapacity: 30,
    uptimePct: 99.5,
    topContributor: "Cafeteria + meeting rooms",
    gridPosition: { colStart: 3, colEnd: 4, rowStart: 1, rowEnd: 2 },
    lastIncident: "None in 30 days",
  },
];

/** Mock JSON export name — one entry per zone per facility */
export const digital_twin_zones = digitalTwinZonesRaw;

export interface ZoneHistorySeries {
  co2KgLast14Days: number[];
  energyKwhLast14Days: number[];
}

export type ZoneConnectionType = "energy" | "flow" | "risk";

export interface ZoneConnection {
  facilityId: string;
  from: string;
  to: string;
  type: ZoneConnectionType;
  tooltip: string;
}

/** Build a realistic 14-day rising series ending at `current` */
function synth14DaySeries(current: number, trendPct = 0.012, seed = 0): number[] {
  const start = current / (1 + trendPct * 10);
  return Array.from({ length: 14 }, (_, i) => {
    const wave = 1 + Math.sin((i + seed) * 0.9) * 0.018;
    return Math.round(start * (1 + trendPct * i) * wave);
  });
}

export const zoneHistory: Record<string, ZoneHistorySeries> = Object.fromEntries(
  digitalTwinZonesRaw.map((z, idx) => {
    const allowNeg = z.co2Kg < 0;
    const co2 =
      z.zoneId === "z1" && z.facilityId === "FAC001"
        ? [1980, 2010, 2040, 2100, 2085, 2150, 2200, 2180, 2250, 2300, 2280, 2340, 2320, 2380]
        : synth14DaySeries(Math.abs(z.co2Kg), 0.014, idx);
    const energy = synth14DaySeries(Math.abs(z.energyKwh), 0.011, idx + 3);
    if (allowNeg) {
      return [z.zoneId + "@" + z.facilityId, { co2KgLast14Days: co2.map(v => -v), energyKwhLast14Days: energy.map(v => -v) }];
    }
    return [z.zoneId + "@" + z.facilityId, { co2KgLast14Days: co2, energyKwhLast14Days: energy }];
  }),
);

export function getZoneHistory(facilityId: string, zoneId: string): ZoneHistorySeries {
  return (
    zoneHistory[`${zoneId}@${facilityId}`] ?? {
      co2KgLast14Days: synth14DaySeries(500),
      energyKwhLast14Days: synth14DaySeries(800),
    }
  );
}

export const zoneConnections: ZoneConnection[] = [
  {
    facilityId: "FAC001",
    from: "z6",
    to: "z5",
    type: "energy",
    tooltip: "Office Wing grid tie shares load path with Generator Room backup circuit",
  },
  {
    facilityId: "FAC001",
    from: "z1",
    to: "z3",
    type: "flow",
    tooltip: "Production Line 1 output feeds Assembly Floor — material flow active",
  },
  {
    facilityId: "FAC001",
    from: "z3",
    to: "z4",
    type: "flow",
    tooltip: "Assembly Floor finished goods route to Raw Materials Warehouse staging",
  },
  {
    facilityId: "FAC001",
    from: "z1",
    to: "z4",
    type: "risk",
    tooltip: "Warehouse cold storage idling correlates with Line 1 overload — 3 of last 4 incidents",
  },
  {
    facilityId: "FAC002",
    from: "z4",
    to: "z1",
    type: "energy",
    tooltip: "Solar Array offsets Server Hall A grid draw during peak hours",
  },
  {
    facilityId: "FAC002",
    from: "z1",
    to: "z2",
    type: "flow",
    tooltip: "Server Hall A thermal load cascades to Hall B cooling loop",
  },
  {
    facilityId: "FAC002",
    from: "z1",
    to: "z3",
    type: "risk",
    tooltip: "Network Ops UPS strain correlates with Hall A cooling spikes — 2 of last 3 events",
  },
  {
    facilityId: "FAC003",
    from: "z2",
    to: "z1",
    type: "energy",
    tooltip: "Cold Storage compressor load drives Loading Bay refrigeration demand",
  },
  {
    facilityId: "FAC003",
    from: "z1",
    to: "z3",
    type: "flow",
    tooltip: "Loading Bay inbound freight routes to Sorting Floor",
  },
  {
    facilityId: "FAC003",
    from: "z2",
    to: "z4",
    type: "risk",
    tooltip: "Admin Block HVAC spikes when Cold Storage exceeds setpoint — 4 of last 5 alerts",
  },
  {
    facilityId: "FAC004",
    from: "z1",
    to: "z2",
    type: "flow",
    tooltip: "Vehicle Bay A dispatch queue feeds Bay B maintenance rotation",
  },
  {
    facilityId: "FAC004",
    from: "z1",
    to: "z4",
    type: "risk",
    tooltip: "Dispatch Office idle time correlates with Bay A diesel idling — 3 of last 4 incidents",
  },
  {
    facilityId: "FAC005",
    from: "z1",
    to: "z3",
    type: "energy",
    tooltip: "HR Floor HVAC load shares circuit with Shared Facilities cafeteria",
  },
  {
    facilityId: "FAC005",
    from: "z2",
    to: "z3",
    type: "flow",
    tooltip: "Finance Wing occupancy patterns drive Shared Facilities scheduling",
  },
];

export function getConnectionsForFacility(facilityId: string): ZoneConnection[] {
  return zoneConnections.filter(c => c.facilityId === facilityId);
}

export function getFacilityCo2History(facilityId: string): number[] {
  const zones = digitalTwinZonesRaw.filter(z => z.facilityId === facilityId);
  const series = zones.map(z => getZoneHistory(facilityId, z.zoneId).co2KgLast14Days);
  const len = 14;
  return Array.from({ length: len }, (_, i) =>
    series.reduce((sum, s) => sum + (s[i] ?? 0), 0),
  );
}

export function getFacilityEnergyHistory(facilityId: string): number[] {
  const zones = digitalTwinZonesRaw.filter(z => z.facilityId === facilityId);
  const series = zones.map(z => getZoneHistory(facilityId, z.zoneId).energyKwhLast14Days);
  const len = 14;
  return Array.from({ length: len }, (_, i) =>
    series.reduce((sum, s) => sum + Math.max(0, s[i] ?? 0), 0),
  );
}

/** Threshold rules: +20% over baseline = watch, +40% = critical */
export function deriveZoneStatus(energyKwh: number, baselineKwh: number): ZoneStatus {
  if (baselineKwh <= 0) return "normal";
  const ratio = energyKwh / baselineKwh;
  if (ratio > 1.4) return "critical";
  if (ratio > 1.2) return "watch";
  return "normal";
}

export function generateZoneAiNote(zone: DigitalTwinZoneRaw): string {
  const ratio = zone.energyBaselineKwh > 0 ? zone.energyKwh / zone.energyBaselineKwh : 1;
  const pct = Math.round((ratio - 1) * 100);
  const contributor = zone.topContributor;

  if (ratio > 1.4) {
    return `${zone.name} is ${pct}% above baseline — ${contributor} is the top contributor. Load-shedding or maintenance check recommended.`;
  }
  if (ratio > 1.2) {
    return `${zone.name} energy is ${pct}% above baseline vs facility average — ${contributor} is driving the increase.`;
  }
  if (ratio < 0.85) {
    return `${zone.name} running ${Math.abs(pct)}% below baseline — ${contributor} within efficient range.`;
  }
  return `${zone.name} within normal range — ${contributor} tracking to baseline.`;
}

export function enrichZone(raw: DigitalTwinZoneRaw): DigitalTwinZone {
  return {
    ...raw,
    status: deriveZoneStatus(raw.energyKwh, raw.energyBaselineKwh),
    aiNote: generateZoneAiNote(raw),
  };
}

export function getFacilityById(id: string): DigitalTwinFacility | undefined {
  return digitalTwinFacilities.find(f => f.id === id);
}

export function getZonesForFacility(facilityId: string): DigitalTwinZone[] {
  return digitalTwinZonesRaw.filter(z => z.facilityId === facilityId).map(enrichZone);
}

export function getDefaultFacilityIdForUser(user: EcoSessionUser | null): string {
  if (!user) return "FAC001";
  if (user.factoryId) return user.factoryId;
  if (user.departmentId && DEPARTMENT_FACILITY_MAP[user.departmentId]) {
    return DEPARTMENT_FACILITY_MAP[user.departmentId];
  }
  return "FAC001";
}

export function statusToPillTone(status: ZoneStatus): PillTone {
  switch (status) {
    case "critical":
      return "critical";
    case "watch":
      return "medium";
    default:
      return "excellent";
  }
}

export function statusLabel(status: ZoneStatus): string {
  switch (status) {
    case "critical":
      return "Critical";
    case "watch":
      return "Watch";
    default:
      return "Normal";
  }
}

export function zoneStatusColors(status: ZoneStatus): { bg: string; border: string } {
  switch (status) {
    case "critical":
      return { bg: "rgba(239, 68, 68, 0.35)", border: "#EF4444" };
    case "watch":
      return { bg: "rgba(245, 158, 11, 0.35)", border: "#F59E0B" };
    default:
      return { bg: "rgba(34, 197, 94, 0.35)", border: "#22C55E" };
  }
}

export function gridPlacementStyle(pos: GridPosition): CSSProperties {
  return {
    gridColumn: `${pos.colStart} / ${pos.colEnd}`,
    gridRow: `${pos.rowStart} / ${pos.rowEnd}`,
  };
}

export function computeFacilityHealth(zones: DigitalTwinZone[]): number {
  if (zones.length === 0) return 0;
  const scores = zones.map(z => {
    if (z.status === "critical") return 40;
    if (z.status === "watch") return 72;
    return 95;
  });
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

export function buildDigitalTwinKpis(
  facility: DigitalTwinFacility,
  zones: DigitalTwinZone[],
): KpiCardProps[] {
  const watchCritical = zones.filter(z => z.status === "watch" || z.status === "critical").length;
  const totalEnergy = zones.reduce((sum, z) => sum + Math.max(0, z.energyKwh), 0);
  const grossCo2 = zones.reduce((sum, z) => sum + Math.max(0, z.co2Kg), 0);
  const solarCo2Offset = Math.round(facility.solarOffsetKwh * 0.49);
  const netCo2 = grossCo2 - solarCo2Offset;
  const health = computeFacilityHealth(zones);

  return [
    {
      label: "Overall Facility Health",
      value: `${health}%`,
      subtitle: health >= 85 ? "Good standing" : health >= 70 ? "Needs attention" : "At risk",
      icon: Activity,
      iconColor: health >= 85 ? "green" : health >= 70 ? "amber" : "red",
      trend: health >= 85 ? "stable" : "review zones",
      trendDirection: health >= 85 ? "up" : "down",
    },
    {
      label: "Zones in Watch / Critical",
      value: watchCritical,
      subtitle: `${zones.filter(z => z.status === "critical").length} critical`,
      icon: AlertTriangle,
      iconColor: watchCritical > 0 ? "amber" : "green",
      trend: watchCritical > 0 ? "action needed" : "all clear",
      trendDirection: watchCritical > 0 ? "down" : "up",
    },
    {
      label: "Total Live Energy Draw",
      value: `${(totalEnergy / 1000).toFixed(1)} MWh`,
      subtitle: "rolling 24h",
      icon: Zap,
      iconColor: "purple",
      trend: `${zones.length} zones monitored`,
      trendDirection: "up",
    },
    {
      label: "Net Carbon",
      value: `${(netCo2 / 1000).toFixed(2)} t`,
      subtitle: `incl. ${facility.solarOffsetKwh} kWh solar offset`,
      icon: Leaf,
      iconColor: "teal",
      trend: netCo2 < grossCo2 ? `−${solarCo2Offset} kg offset` : "no offset",
      trendDirection: "down",
    },
  ];
}

export interface ZoneHistoryRow {
  id: string;
  zone: string;
  status: ZoneStatus;
  energy24h: number;
  co2_24h: number;
  occupancy: string;
  lastIncident: string;
}

export function buildZoneHistoryRows(zones: DigitalTwinZone[]): ZoneHistoryRow[] {
  return zones.map(z => ({
    id: z.zoneId,
    zone: z.name,
    status: z.status,
    energy24h: z.energyKwh,
    co2_24h: z.co2Kg,
    occupancy: `${z.occupancy}/${z.occupancyCapacity}`,
    lastIncident: z.lastIncident,
  }));
}
