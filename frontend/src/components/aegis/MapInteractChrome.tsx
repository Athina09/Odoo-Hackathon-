import { useEffect, useState } from "react";
import type { Map as LeafletMap } from "leaflet";
import { Maximize2, Minimize2, ZoomIn, ZoomOut } from "lucide-react";
import { cn } from "@/lib/utils";

type MapInteractChromeProps = {
  shellRef: React.RefObject<HTMLDivElement | null>;
  mapRef: React.RefObject<LeafletMap | null>;
  onFullscreenChange?: (open: boolean) => void;
  className?: string;
  /** Light buttons for pale maps; dark for navy chrome; satellite for white pills on imagery */
  variant?: "light" | "dark" | "satellite";
};

export function MapInteractChrome({
  shellRef,
  mapRef,
  onFullscreenChange,
  className,
  variant = "light",
}: MapInteractChromeProps) {
  const [isFs, setIsFs] = useState(false);

  useEffect(() => {
    const el = shellRef.current;
    const sync = () => {
      const open = el !== null && document.fullscreenElement === el;
      setIsFs(open);
      onFullscreenChange?.(open);
      requestAnimationFrame(() => mapRef.current?.invalidateSize({ animate: true }));
    };
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, [shellRef, mapRef, onFullscreenChange]);

  const toggleFullscreen = async () => {
    const el = shellRef.current;
    if (!el) return;
    try {
      if (document.fullscreenElement === el) await document.exitFullscreen();
      else await el.requestFullscreen();
    } catch {
      /* browsers may block without gesture */
    }
  };

  const isSatellite = variant === "satellite";
  const isDark = variant === "dark";
  const btnShell = isSatellite
    ? "rounded-full border border-white/90 bg-white/96 text-slate-600 shadow-[0_2px_10px_rgba(0,0,0,0.35)]"
    : isDark
      ? "border border-white/20 bg-[#0A1628]/92 text-white shadow-lg backdrop-blur-sm"
      : "border border-primary/35 bg-background/95 text-primary shadow-md backdrop-blur-sm";
  const btnHover = isSatellite
    ? "hover:bg-slate-50"
    : isDark
      ? "hover:bg-white/10"
      : "hover:bg-primary/10";
  const btnDivider = isSatellite ? "border-slate-200/80" : isDark ? "border-white/15" : "border-border/60";
  const groupRadius = isSatellite ? "rounded-full" : "rounded-lg";

  return (
    <div
      className={[
        "absolute right-3 top-3 z-[1100] flex flex-col gap-1.5",
        className ?? "",
      ].join(" ")}
    >
      <div className={cn("flex flex-col overflow-hidden", groupRadius, btnShell)}>
        <button
          type="button"
          onClick={() => mapRef.current?.zoomIn(1)}
          className={cn("grid h-9 w-9 place-items-center transition-colors", btnHover)}
          aria-label="Zoom in"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => mapRef.current?.zoomOut(1)}
          className={cn("grid h-9 w-9 place-items-center border-t transition-colors", btnDivider, btnHover)}
          aria-label="Zoom out"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
      </div>
      <button
        type="button"
        onClick={toggleFullscreen}
        className={cn(
          "grid h-9 w-9 place-items-center transition-colors",
          isSatellite ? "rounded-full" : "rounded-lg",
          btnShell,
          btnHover,
        )}
        aria-label={isFs ? "Exit full screen" : "View map full screen"}
      >
        {isFs ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
      </button>
    </div>
  );
}
