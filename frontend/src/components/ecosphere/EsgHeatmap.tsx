import { HeatmapPanel } from "@/components/ecosphere/ds";
import { esgHeatmapZones } from "@/data/ecosphere-modules";

export function EsgHeatmap() {
  return (
    <HeatmapPanel
      label="ESG Heatmap · Tamil Nadu"
      zones={esgHeatmapZones}
      height={400}
    />
  );
}
