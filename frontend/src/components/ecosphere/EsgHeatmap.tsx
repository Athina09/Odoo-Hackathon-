import { useEffect, useMemo, useRef, useState } from "react";
import type { Map as LeafletMap } from "leaflet";
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
  const mapRef = useRef<LeafletMap | null>(null);
  const [fullscreen, setFullscreen] = useState(false);

  const zones = useMemo(() => heatmapZones, []);

  useEffect(() => {
    if (!ref.current || typeof window === "undefined") return;

    let map: LeafletMap;
    let cancelled = false;

    void import("leaflet").then(({ default: L }) => {
      if (cancelled || !ref.current) return;

      map = L.map(ref.current, {
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
            : `<div style="font-size:11px"><b>${z.district}</b><br/>ESG exposure: ${z.risk}</div>`,
          { direction: "top" },
        );
      });

      const bounds = L.latLngBounds(zones.map(z => [z.lat, z.lng] as [number, number]));
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 8 });
    });

    return () => {
      cancelled = true;
      mapRef.current = null;
      map?.remove();
    };
  }, [zones]);

  return (
    <div
      ref={shellRef}
      className={cn(
        "relative overflow-hidden rounded-xl border border-border/50 bg-background",
        fullscreen ? "h-screen max-h-[100dvh] w-full rounded-none" : "h-[360px]",
      )}
    >
      <div ref={ref} className="h-full w-full min-h-[200px]" />
      <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-primary/20" />
      <div className="pointer-events-none absolute left-3 top-3 z-[500] max-w-[calc(100%-5rem)] rounded-md border border-border bg-white/95 px-2 py-1 text-xs uppercase tracking-widest text-muted-foreground shadow-sm">
        ESG Heatmap · Tamil Nadu
      </div>
      <MapInteractChrome shellRef={shellRef} mapRef={mapRef} onFullscreenChange={setFullscreen} />
    </div>
  );
}
