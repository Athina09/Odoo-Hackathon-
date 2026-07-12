/** CAD blueprint helpers — archetypes, corridors, short labels */

export type ZoneArchetype =
  | "production"
  | "assembly"
  | "warehouse"
  | "office"
  | "generator"
  | "electrical"
  | "server"
  | "loading"
  | "cold"
  | "solar"
  | "network"
  | "fleet"
  | "default";

export function inferZoneArchetype(name: string): ZoneArchetype {
  const n = name.toLowerCase();
  if (n.includes("production") || n.includes("line")) return "production";
  if (n.includes("assembly") || n.includes("sorting")) return "assembly";
  if (n.includes("warehouse") || n.includes("materials") || n.includes("storage")) return "warehouse";
  if (n.includes("office") || n.includes("admin") || n.includes("hr") || n.includes("finance"))
    return "office";
  if (n.includes("generator")) return "generator";
  if (n.includes("electrical") || n.includes("ups") || n.includes("network ops"))
    return "electrical";
  if (n.includes("server")) return "server";
  if (n.includes("loading") || n.includes("bay") || n.includes("depot")) return "loading";
  if (n.includes("cold")) return "cold";
  if (n.includes("solar")) return "solar";
  if (n.includes("dispatch") || n.includes("lounge")) return "office";
  if (n.includes("vehicle") || n.includes("fleet")) return "fleet";
  return "default";
}

export function shortRootCause(contributor: string): string {
  const parts = contributor.split(/[+,&]/).map(s => s.trim());
  const first = parts[0] ?? contributor;
  return first
    .replace(/\(.*\)/, "")
    .replace(/spindle motors/i, "Motors")
    .replace(/backup generator/i, "Generator")
    .split(" ")
    .slice(0, 2)
    .join(" ")
    .trim();
}

export function zoneEnergyDeltaPct(energyKwh: number, baselineKwh: number): number {
  if (baselineKwh <= 0) return 0;
  return Math.round(((energyKwh / baselineKwh - 1) * 100));
}

export const STATUS_BORDER: Record<"normal" | "watch" | "critical", string> = {
  normal: "#22C55E",
  watch: "#F59E0B",
  critical: "#EF4444",
};

/** Percent-based wall / corridor segments per facility (0–100) */
export interface BlueprintWall {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  thick?: boolean;
}

export const FACILITY_WALLS: Record<string, BlueprintWall[]> = {
  FAC001: [
    { x1: 50, y1: 8, x2: 50, y2: 62, thick: true },
    { x1: 4, y1: 62, x2: 96, y2: 62, thick: true },
    { x1: 50, y1: 62, x2: 50, y2: 78 },
    { x1: 22, y1: 78, x2: 96, y2: 78 },
  ],
  FAC002: [
    { x1: 66, y1: 6, x2: 66, y2: 72 },
    { x1: 4, y1: 72, x2: 96, y2: 72 },
  ],
  FAC003: [
    { x1: 50, y1: 6, x2: 50, y2: 48 },
    { x1: 4, y1: 48, x2: 96, y2: 48 },
  ],
  FAC004: [
    { x1: 33, y1: 6, x2: 33, y2: 88 },
    { x1: 66, y1: 6, x2: 66, y2: 55 },
  ],
  FAC005: [
    { x1: 33, y1: 6, x2: 33, y2: 88 },
    { x1: 66, y1: 6, x2: 66, y2: 88 },
  ],
};

export const SENSOR_TYPES = ["Temp", "Power", "CO₂"] as const;
