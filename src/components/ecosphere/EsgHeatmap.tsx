import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import { heatmapZones } from "@/data/data";
import { facilities } from "@/data/ecosphere";
import { MapInteractChrome } from "@/components/aegis/MapInteractChrome";
import { cn } from "@/lib/utils";

const TN_OVERVIEW: [number, number] = [11.1271, 78.6569];
const TN_ZOOM = 6;

function zoneColor(risk: number) {
  return risk > 80 ? "#ff4d6d" : risk > 60 ? "#ffb454" : "#5fd4ff";
}

function zoneRadius(risk: number) {
  return 8 + (risk / 100) * 22;
}

export function EsgHeatmap() {
  const ref = useRef<HTMLDivElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const [fullscreen, setFullscreen] = useState(false);

  const zones = useMemo(() => heatmapZones, []);

  useEffect(() => {
    if (!ref.current) return;

    const map = L.map(ref.current, {
      center: TN_OVERVIEW,
      zoom: TN_ZOOM,
      scrollWheelZoom: true,
      zoomControl: false,
      attributionControl: false,
    });
    mapRef.current = map;
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

    zones.forEach(z => {
      const r = zoneRadius(z.risk);
      const color = zoneColor(z.risk);
      const site = facilities.find(f => f.district === z.district);

      const m = L.circleMarker([z.lat, z.lng], {
        radius: r,
        color,
        fillColor: color,
        fillOpacity: 0.35,
        weight: 2,
      }).addTo(map);

      m.bindTooltip(
        site
          ? `<div style="font-size:11px"><b>${z.district}</b><br/>Site: ${site.name}<br/>Carbon: ${site.carbon}<br/>Energy: ${site.energy}<br/>Employees: ${site.employees}</div>`
          : `<div style="font-size:11px"><b>${z.district}</b><br/>Risk: ${z.risk}<br/>Crimes: ${z.crimes}</div>`,
        { direction: "top" },
      );
    });

    const bounds = L.latLngBounds(zones.map(z => [z.lat, z.lng] as [number, number]));
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 8 });

    return () => {
      mapRef.current = null;
      map.remove();
    };
  }, [zones]);

  return (
    <div
      ref={shellRef}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-[rgba(59,130,246,0.25)] bg-[#111827]",
        fullscreen ? "h-screen max-h-[100dvh] w-full rounded-none" : "h-[360px]",
      )}
    >
      <div ref={ref} className="h-full w-full min-h-[200px]" />
      <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-[#22C55E]/15" />
      <div className="pointer-events-none absolute left-3 top-3 z-[500] max-w-[calc(100%-5rem)] rounded-md border border-[rgba(59,130,246,0.35)] bg-[#0B1120]/75 px-2 py-1 text-[10px] uppercase tracking-widest text-slate-400 backdrop-blur">
        ESG Heatmap · Tamil Nadu
      </div>
      <MapInteractChrome
        shellRef={shellRef}
        mapRef={mapRef}
        onFullscreenChange={setFullscreen}
        className="[&_button]:border-[rgba(59,130,246,0.35)] [&_button]:bg-[#0B1120]/95 [&_button]:text-[#22C55E] [&_button:hover]:bg-[#22C55E]/10"
      />
    </div>
  );
}
