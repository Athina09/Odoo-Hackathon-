import type { ZoneStatus } from "@/data/digital-twin";

export type SensorBadge = "ONLINE" | "WARNING" | "MAINTENANCE" | "OFFLINE";

export function sensorBadgeFor(status: ZoneStatus, uptime: number): SensorBadge {
  if (uptime < 90) return "MAINTENANCE";
  if (status === "critical") return "OFFLINE";
  if (status === "watch") return "WARNING";
  return "ONLINE";
}

export function badgeStyles(badge: SensorBadge): { color: string; bg: string } {
  switch (badge) {
    case "ONLINE":
      return { color: "#22C55E", bg: "rgba(34,197,94,0.12)" };
    case "WARNING":
      return { color: "#F59E0B", bg: "rgba(245,158,11,0.12)" };
    case "MAINTENANCE":
      return { color: "#94A3B8", bg: "rgba(148,163,184,0.12)" };
    case "OFFLINE":
      return { color: "#EF4444", bg: "rgba(239,68,68,0.12)" };
  }
}

export const STATUS_COLORS: Record<ZoneStatus | "selected", string> = {
  normal: "#22C55E",
  watch: "#F59E0B",
  critical: "#EF4444",
  selected: "#3B82F6",
};

/** Meaningful plant energy paths only — zone edge to zone edge, 3–4 per facility */
export const PLANT_ENERGY_FLOW: Record<string, [string, string][]> = {
  FAC001: [
    ["z5", "z1"],
    ["z1", "z3"],
    ["z4", "z2"],
  ],
  FAC002: [
    ["z4", "z1"],
    ["z1", "z2"],
    ["z2", "z3"],
  ],
  FAC003: [
    ["z1", "z2"],
    ["z2", "z3"],
    ["z3", "z4"],
  ],
  FAC004: [
    ["z1", "z2"],
    ["z2", "z3"],
  ],
  FAC005: [
    ["z1", "z2"],
    ["z2", "z3"],
  ],
};

/** @deprecated Use PLANT_ENERGY_FLOW for blueprint overlay */
export const FACILITY_FLOW_EDGES: Record<string, [string, string][]> = {
  FAC001: [
    ["grid", "z5"],
    ["z5", "z1"],
    ["z5", "z2"],
    ["z1", "z3"],
    ["z2", "z3"],
    ["z3", "z4"],
  ],
  FAC002: [["grid", "z4"], ["z4", "z1"], ["z1", "z2"], ["z2", "z3"]],
  FAC003: [["grid", "z1"], ["z1", "z2"], ["z2", "z3"], ["z3", "z4"]],
  FAC004: [["grid", "z1"], ["z1", "z2"], ["z2", "z3"]],
  FAC005: [["grid", "z1"], ["z1", "z2"], ["z2", "z3"]],
};
