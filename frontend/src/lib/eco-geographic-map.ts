import type { HeatmapZone } from "@/components/ecosphere/ds";

/** Tamil Nadu framing — same as AEGIS RiskMap */
export const TN_MAP_CENTER: [number, number] = [11.1271, 78.6569];
export const TN_MAP_ZOOM = 6;

/** OSM + AEGIS invert filter in .eco-heatmap (dark teal sea, dark land) */
export const ECO_MAP_TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

export const ECO_MAP_TILE_OPTIONS = {
  subdomains: "abc" as const,
  maxZoom: 19,
  attribution: "",
};

/** Deep teal-navy sea (letterbox + gaps) */
export const ECO_MAP_SEA_COLOR = "#122c34";

/** AEGIS RiskMap marker palette */
export function severityMarkerColor(severity: HeatmapZone["severity"], value: number): string {
  if (severity === "critical" || value > 85) return "#ff4d6d";
  if (severity === "high" || value > 70) return "#ffb454";
  if (severity === "medium" || value > 50) return "#fbbf24";
  return "#5fd4ff";
}

export function markerRadiusPx(value: number) {
  return 8 + (value / 100) * 22;
}
