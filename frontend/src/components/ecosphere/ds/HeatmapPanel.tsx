import { useEffect, useMemo, useRef, useState } from "react";
import type { Map as LeafletMap } from "leaflet";
import { MapInteractChrome } from "@/components/aegis/MapInteractChrome";
import { cn } from "@/lib/utils";
import {
  ECO_MAP_TILE_OPTIONS,
  ECO_MAP_TILE_URL,
  TN_MAP_CENTER,
  TN_MAP_ZOOM,
  markerRadiusPx,
  severityMarkerColor,
} from "@/lib/eco-geographic-map";

export interface HeatmapZone {
  id: string;
  label: string;
  lat: number;
  lng: number;
  value: number;
  severity: "critical" | "high" | "medium" | "low";
  tooltip?: string;
}

const DEFAULT_HEIGHT = 400;

export function HeatmapPanel({
  label,
  zones,
  height = DEFAULT_HEIGHT,
  highlightDistrict,
  subtitle,
  compact = false,
}: {
  label: string;
  zones: HeatmapZone[];
  height?: number;
  highlightDistrict?: string;
  subtitle?: string;
  compact?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const data = useMemo(() => zones, [zones]);
  const panelHeight = compact ? 200 : height;

  useEffect(() => {
    if (!ref.current || typeof window === "undefined") return;

    let map: LeafletMap;
    let cancelled = false;

    void import("leaflet").then(({ default: L }) => {
      if (cancelled || !ref.current) return;

      map = L.map(ref.current, {
        center: TN_MAP_CENTER,
        zoom: compact ? 6 : TN_MAP_ZOOM,
        scrollWheelZoom: !compact,
        zoomControl: false,
        attributionControl: false,
      });
      mapRef.current = map;
      L.tileLayer(ECO_MAP_TILE_URL, ECO_MAP_TILE_OPTIONS).addTo(map);

      data.forEach(z => {
        const color = severityMarkerColor(z.severity, z.value);
        const radius = markerRadiusPx(z.value);
        const highlighted =
          highlightDistrict != null && z.label.toLowerCase() === highlightDistrict.toLowerCase();

        const m = L.circleMarker([z.lat, z.lng], {
          radius: highlighted ? radius + 4 : radius,
          color,
          fillColor: color,
          fillOpacity: highlighted ? 0.5 : 0.35,
          weight: highlighted ? 3 : 2,
        }).addTo(map);

        m.bindTooltip(
          z.tooltip ??
            `<div style="font-size:11px;font-weight:600"><b>${z.label}</b><br/>Index: ${z.value}</div>`,
          { direction: "top", opacity: 0.95 },
        );

        L.marker([z.lat, z.lng], {
          icon: L.divIcon({
            className: "esg-heatmap-label",
            html: `<span class="${highlighted ? "esg-heatmap-label--active" : ""}">${z.label}</span>`,
            iconSize: [0, 0],
            iconAnchor: [0, 0],
          }),
          interactive: false,
          zIndexOffset: highlighted ? 2000 : 1000,
        }).addTo(map);
      });

      const bounds = L.latLngBounds(data.map(z => [z.lat, z.lng] as [number, number]));
      if (data.length > 0) {
        map.fitBounds(bounds, {
          padding: compact ? [28, 28] : [48, 48],
          maxZoom: compact ? 7 : 8,
        });
      }
    });

    return () => {
      cancelled = true;
      mapRef.current = null;
      map?.remove();
    };
  }, [data, highlightDistrict, compact]);

  const shell = (
    <>
      <div ref={ref} className="eco-dark-surface-map h-full w-full min-h-[200px]" />
      <div className="pointer-events-none absolute inset-0 z-[500] ring-1 ring-inset ring-cyan-400/20" />
      <div className="pointer-events-none absolute left-3 top-3 z-[600] max-w-[calc(100%-5rem)] rounded-md border border-cyan-500/25 bg-[#0a1628]/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-cyan-100/75 backdrop-blur-sm">
        {label}
      </div>
      {subtitle && (
        <div className="pointer-events-none absolute bottom-3 left-3 z-[600] max-w-[70%] font-mono text-[9px] text-white/40">
          {subtitle}
        </div>
      )}
      <MapInteractChrome
        shellRef={shellRef}
        mapRef={mapRef}
        onFullscreenChange={setFullscreen}
      />
    </>
  );

  if (fullscreen) {
    return (
      <div
        ref={shellRef}
        className="eco-heatmap fixed inset-0 z-[100] h-screen w-screen rounded-none border-0"
      >
        <div className="h-full w-full">{shell}</div>
      </div>
    );
  }

  return (
    <div
      ref={shellRef}
      className={cn(
        "eco-heatmap relative overflow-hidden rounded-xl border border-cyan-900/40 bg-[#122c34]",
      )}
      style={{ height: panelHeight }}
    >
      {shell}
    </div>
  );
}
