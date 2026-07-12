import { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Loader2, CheckCircle, ChevronRight, MapPin, Play } from "lucide-react";
import { heatmapZones } from "@/data/data";
import { useDistrictFilter } from "@/contexts/DistrictFilterContext";
import { MapInteractChrome } from "@/components/aegis/MapInteractChrome";
import { fetchMovement, type MovementPoint } from "@/lib/api";
import { getCaseBinding } from "@/data/case-bindings";
import { cn } from "@/lib/utils";

const COLORS: Record<string, string> = {
  victim: "#22d3ee",
  suspect: "#ef4444",
  crime: "#facc15",
};

function routeLineOpts(type: string): L.PolylineOptions {
  if (type === "victim") {
    return { color: COLORS.victim, weight: 4, opacity: 0.8, className: "movement-route-victim" };
  }
  if (type === "suspect") {
    return {
      color: COLORS.suspect,
      weight: 4,
      opacity: 0.9,
      dashArray: "12 8",
      className: "movement-route-suspect",
    };
  }
  return { color: COLORS.crime, weight: 3, opacity: 0.95, dashArray: "4 6", className: "movement-route-crime" };
}

function moverOpts(type: string): L.CircleMarkerOptions {
  const color = COLORS[type] ?? "#fff";
  return {
    radius: 7,
    color,
    fillColor: color,
    fillOpacity: 1,
    weight: 3,
    className: type === "suspect" ? "movement-mover-suspect" : "movement-mover-victim",
  };
}

function addWaypoint(
  layerGroup: L.LayerGroup,
  lat: number,
  lng: number,
  type: string,
  label: string,
  time: string,
) {
  const color = COLORS[type] ?? "#fff";
  L.circleMarker([lat, lng], {
    radius: 11,
    color,
    fillColor: "transparent",
    fillOpacity: 0,
    weight: 2,
    opacity: 0.35,
    className: "movement-waypoint-ring",
  })
    .addTo(layerGroup);
  L.circleMarker([lat, lng], {
    radius: 5,
    color,
    fillColor: color,
    fillOpacity: 0.95,
    weight: 2,
    className: "movement-waypoint-dot",
  })
    .bindTooltip(`${label} · ${time}`, { direction: "top" })
    .addTo(layerGroup);
}

function addCrimeSceneMarker(
  layerGroup: L.LayerGroup,
  lat: number,
  lng: number,
  label: string,
  time: string,
) {
  const color = COLORS.crime;
  L.circleMarker([lat, lng], {
    radius: 16,
    color,
    fillColor: "transparent",
    fillOpacity: 0,
    weight: 3,
    opacity: 0.45,
    className: "movement-crime-ring",
  }).addTo(layerGroup);
  L.circleMarker([lat, lng], {
    radius: 9,
    color: "#ca8a04",
    fillColor: color,
    fillOpacity: 1,
    weight: 3,
    className: "movement-crime-hub",
  })
    .bindTooltip(`Crime scene · ${label} · ${time}`, { direction: "top" })
    .addTo(layerGroup);
}

function sameLoc(a: MovementPoint, b: MovementPoint) {
  return Math.abs(a.lat - b.lat) < 0.00005 && Math.abs(a.lng - b.lng) < 0.00005;
}

/** Victim + suspect paths run through crime scene so all points connect. */
function buildRouteTracks(points: MovementPoint[]) {
  const crimes = points.filter(p => p.type === "crime");
  let victims = points
    .filter(p => (p.type ?? "victim") === "victim")
    .sort((a, b) => parseTime(a.time) - parseTime(b.time));
  let suspects = points
    .filter(p => p.type === "suspect")
    .sort((a, b) => parseTime(a.time) - parseTime(b.time));

  for (const c of crimes) {
    if (!victims.some(p => sameLoc(p, c))) {
      victims = [...victims, { ...c, type: "victim" }];
    }
    if (!suspects.some(p => sameLoc(p, c))) {
      suspects = [...suspects, { ...c, type: "suspect" }];
    }
  }

  victims.sort((a, b) => parseTime(a.time) - parseTime(b.time));
  suspects.sort((a, b) => parseTime(a.time) - parseTime(b.time));

  return [
    { type: "victim" as const, color: COLORS.victim, points: victims },
    { type: "suspect" as const, color: COLORS.suspect, points: suspects },
  ].filter(t => t.points.length > 0);
}

function crimeScenes(points: MovementPoint[]) {
  return points.filter(p => p.type === "crime");
}


function parseTime(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function createBaseMap(
  container: HTMLDivElement,
  center: [number, number],
  zoom: number,
  points: MovementPoint[],
) {
  const map = L.map(container, {
    center,
    zoom,
    scrollWheelZoom: true,
    zoomControl: false,
    attributionControl: false,
  });
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
  if (points.length > 0) {
    const bounds = L.latLngBounds(points.map(p => [p.lat, p.lng] as [number, number]));
    map.fitBounds(bounds.pad(0.25));
  }
  return map;
}

function drawStaticRoutes(map: L.Map, points: MovementPoint[]): L.LayerGroup {
  const group = L.layerGroup().addTo(map);
  const tracks = buildRouteTracks(points);
  const crimes = crimeScenes(points);

  for (const track of tracks) {
    const latlngs = track.points.map(p => [p.lat, p.lng] as [number, number]);
    if (latlngs.length > 1) {
      L.polyline(latlngs, routeLineOpts(track.type)).addTo(group);
    }
    for (const p of track.points) {
      const isCrime = crimes.some(c => sameLoc(c, p));
      if (isCrime) continue;
      addWaypoint(group, p.lat, p.lng, track.type, p.label, p.time);
    }
  }

  for (const c of crimes) {
    addCrimeSceneMarker(group, c.lat, c.lng, c.label, c.time);
  }

  return group;
}

function runTravelReplay(
  map: L.Map,
  points: MovementPoint[],
  onProgress: (pct: number) => void,
  onDone: () => void,
) {
  const tracks = buildRouteTracks(points);
  const crimes = crimeScenes(points);
  const layerGroup = L.layerGroup().addTo(map);
  const crimeMarkersPlaced = new Set<string>();
  let cancelled = false;

  function markCrimeAt(lat: number, lng: number) {
    const hit = crimes.find(c => sameLoc(c, { lat, lng, label: "", time: "" }));
    if (!hit) return;
    const key = `${hit.lat},${hit.lng}`;
    if (crimeMarkersPlaced.has(key)) return;
    crimeMarkersPlaced.add(key);
    addCrimeSceneMarker(layerGroup, hit.lat, hit.lng, hit.label, hit.time);
  }

  type AnimState = {
    track: (typeof tracks)[0];
    mover: L.CircleMarker;
    line: L.Polyline;
    segIdx: number;
    segStart: number;
    pauseUntil: number;
    done: boolean;
  };

  const states: AnimState[] = tracks.map(track => {
    const first = track.points[0];
    const line = L.polyline([], routeLineOpts(track.type)).addTo(layerGroup);

    const mover = L.circleMarker(first ? [first.lat, first.lng] : [0, 0], moverOpts(track.type)).addTo(
      layerGroup,
    );
    mover.bindTooltip(track.type === "victim" ? "Victim" : "Suspect", { direction: "top" });

    if (first) {
      addWaypoint(layerGroup, first.lat, first.lng, track.type, first.label, first.time);
      markCrimeAt(first.lat, first.lng);
    }

    return {
      track,
      mover,
      line,
      segIdx: 0,
      segStart: 0,
      pauseUntil: 0,
      done: track.points.length <= 1,
    };
  });

  const segmentMs = 1000;
  const pauseMs = 300;
  const totalSegments = states.reduce((n, s) => n + Math.max(0, s.track.points.length - 1), 0);
  let doneSegments = 0;

  function tick(now: number) {
    if (cancelled) return;

    let anyActive = false;

    for (const s of states) {
      if (s.done) continue;
      const pts = s.track.points;
      if (s.segIdx >= pts.length - 1) {
        s.done = true;
        continue;
      }

      anyActive = true;
      const from = pts[s.segIdx];
      const to = pts[s.segIdx + 1];

      if (s.pauseUntil > now) continue;

      if (!s.segStart) s.segStart = now;
      const t = Math.min(1, (now - s.segStart) / segmentMs);
      const lat = lerp(from.lat, to.lat, t);
      const lng = lerp(from.lng, to.lng, t);
      s.mover.setLatLng([lat, lng]);

      const pathSoFar = pts.slice(0, s.segIdx + 1).map(p => [p.lat, p.lng] as [number, number]);
      pathSoFar.push([lat, lng]);
      s.line.setLatLngs(pathSoFar);

      if (t >= 1) {
        const wpType = crimes.some(c => sameLoc(c, to)) ? "crime" : s.track.type;
        addWaypoint(layerGroup, to.lat, to.lng, wpType, to.label, to.time);
        markCrimeAt(to.lat, to.lng);
        s.segIdx++;
        s.segStart = 0;
        s.pauseUntil = now + pauseMs;
        doneSegments++;
        if (s.segIdx >= pts.length - 1) s.done = true;
      }
    }

    onProgress(Math.round((doneSegments / Math.max(totalSegments, 1)) * 100));

    if (!anyActive) {
      for (const c of crimes) {
        markCrimeAt(c.lat, c.lng);
      }
      onProgress(100);
      onDone();
      return;
    }

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);

  return () => {
    cancelled = true;
    layerGroup.clearLayers();
    map.removeLayer(layerGroup);
  };
}

// ── Upload modal ───────────────────────────────────────────────────────────

function UploadModal({ onFile, onClose }: { onFile: (f: File) => void; onClose: () => void }) {
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDrag(false);
      const f = e.dataTransfer.files[0];
      if (f) onFile(f);
    },
    [onFile],
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-[600] flex items-center justify-center rounded-xl"
      style={{ background: "rgba(2,6,20,0.94)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 16 }}
        onClick={e => e.stopPropagation()}
        className="w-[380px] rounded-2xl border border-cyan-500/30 bg-[#060e26] p-6 shadow-2xl"
        style={{ boxShadow: "0 0 60px rgba(34,211,238,0.1)" }}
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="text-[12px] font-black uppercase tracking-[0.18em] text-cyan-400">
              Add Mobile GPS Log Data
            </div>
            <div className="text-[9px] text-slate-500 mt-0.5">CSV, JSON, or any format · routes replay on map</div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div
          onDragOver={e => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-7 cursor-pointer transition-all ${
            drag ? "border-cyan-400 bg-cyan-500/10" : "border-white/10 hover:border-cyan-500/40 hover:bg-cyan-500/5"
          }`}
        >
          <MapPin className={`h-10 w-10 transition-colors ${drag ? "text-cyan-400" : "text-slate-500"}`} />
          <div className="text-center">
            <div className={`text-[11px] font-semibold ${drag ? "text-cyan-300" : "text-slate-400"}`}>
              {drag ? "Release to import GPS log" : "Drag & drop GPS log file"}
            </div>
            <div className="text-[9px] text-slate-600 mt-1">Victim & suspect dots will travel the route</div>
          </div>
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={e => {
              const f = e.target.files?.[0];
              if (f) onFile(f);
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

type SimPhase = "idle" | "parsing" | "extracting" | "rendering" | "complete";

const SIM_STEPS: { phase: Exclude<SimPhase, "idle" | "complete">; label: string; pct: number }[] = [
  { phase: "parsing", label: "Parsing GPS coordinates", pct: 30 },
  { phase: "extracting", label: "Extracting timestamps", pct: 65 },
  { phase: "rendering", label: "Building travel paths", pct: 90 },
];

function SimOverlay({
  phase,
  fileName,
  progress,
  onDismiss,
}: {
  phase: SimPhase;
  fileName: string;
  progress: number;
  onDismiss: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-[600] flex items-center justify-center rounded-xl"
      style={{ background: "rgba(2,6,20,0.96)", backdropFilter: "blur(8px)" }}
    >
      <div className="w-full max-w-sm px-6 py-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/15 border border-cyan-500/30">
            <MapPin className="h-5 w-5 text-cyan-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-black uppercase tracking-[0.15em] text-cyan-400">
              {phase === "complete" ? "Routes Ready" : "Processing GPS Data"}
            </div>
            <div className="text-[9px] text-slate-500 font-mono mt-0.5 truncate">{fileName}</div>
          </div>
          {phase === "complete" && (
            <button onClick={onDismiss} className="text-slate-400 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="mb-5">
          <div className="flex justify-between text-[9px] text-slate-500 mb-1.5">
            <span>{phase === "complete" ? "Done" : "Processing…"}</span>
            <span className="font-mono text-cyan-400">{progress}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <div className="space-y-2">
          {SIM_STEPS.map((s, i) => {
            const done = progress >= s.pct;
            const active = phase === s.phase;
            return (
              <div key={s.phase} className="flex items-center gap-2.5">
                <div
                  className={`h-5 w-5 rounded-full flex items-center justify-center shrink-0 border ${
                    done ? "border-emerald-500 bg-emerald-950/60" : active ? "border-cyan-500" : "border-white/10"
                  }`}
                >
                  {done ? (
                    <CheckCircle className="h-3 w-3 text-emerald-400" />
                  ) : active ? (
                    <Loader2 className="h-3 w-3 text-cyan-400 animate-spin" />
                  ) : (
                    <span className="text-[8px] text-slate-600">{i + 1}</span>
                  )}
                </div>
                <span className={`text-[10px] ${done ? "text-emerald-400" : active ? "text-cyan-300" : "text-slate-600"}`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        {phase === "complete" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 rounded-lg border border-emerald-500/30 bg-emerald-950/20 p-3 flex items-center justify-between"
          >
            <div>
              <div className="text-[10px] font-bold text-emerald-400">Ready to replay</div>
              <div className="text-[9px] text-slate-500">Watch victim & suspect dots travel the route</div>
            </div>
            <button
              onClick={onDismiss}
              className="flex items-center gap-1.5 rounded-lg bg-cyan-500/20 border border-cyan-500/40 px-3 py-1.5 text-[10px] font-bold text-cyan-300 hover:bg-cyan-500/30"
            >
              Play replay <ChevronRight className="h-3 w-3" />
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export function MovementMap({ caseId }: { caseId: string }) {
  const binding = getCaseBinding(caseId);
  const { district: districtFilter } = useDistrictFilter();
  const ref = useRef<HTMLDivElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const stopReplayRef = useRef<(() => void) | null>(null);
  const routesLayerRef = useRef<L.LayerGroup | null>(null);

  const [fullscreen, setFullscreen] = useState(false);
  const [points, setPoints] = useState<MovementPoint[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [simPhase, setSimPhase] = useState<SimPhase>("idle");
  const [simProgress, setSimProgress] = useState(0);
  const [fileName, setFileName] = useState("");
  const [replayPct, setReplayPct] = useState(0);
  const [isReplaying, setIsReplaying] = useState(false);
  const [replayDone, setReplayDone] = useState(false);

  const isSimulating = simPhase !== "idle";
  const showCaseReplay =
    binding.hasMovement && (districtFilter === null || districtFilter === binding.district);

  useEffect(() => {
    if (!binding.hasMovement) {
      setPoints([]);
      return;
    }
    fetchMovement(caseId)
      .then(r => setPoints(r.movement))
      .catch(() => setPoints([]));
  }, [caseId, binding.hasMovement]);

  const drawRoutes = useCallback(() => {
    if (!mapRef.current || points.length === 0) return;
    routesLayerRef.current?.remove();
    routesLayerRef.current = drawStaticRoutes(mapRef.current, points);
  }, [points]);

  const startReplay = useCallback(() => {
    if (!mapRef.current || points.length === 0) return;
    stopReplayRef.current?.();
    routesLayerRef.current?.remove();
    routesLayerRef.current = null;
    setReplayDone(false);
    setIsReplaying(true);
    setReplayPct(0);
    stopReplayRef.current = runTravelReplay(
      mapRef.current,
      points,
      setReplayPct,
      () => {
        setIsReplaying(false);
        setReplayDone(true);
        setReplayPct(100);
        drawRoutes();
      },
    );
  }, [points, drawRoutes]);

  useEffect(() => {
    if (!ref.current) return;
    stopReplayRef.current?.();
    stopReplayRef.current = null;

    const map = createBaseMap(ref.current, binding.mapCenter, binding.mapZoom, points);
    mapRef.current = map;

    if (!showCaseReplay && districtFilter) {
      const z = heatmapZones.find(x => x.district === districtFilter);
      if (z) map.setView([z.lat, z.lng], 11);
    }

    return () => {
      stopReplayRef.current?.();
      stopReplayRef.current = null;
      routesLayerRef.current?.remove();
      routesLayerRef.current = null;
      mapRef.current = null;
      map.remove();
    };
  }, [points, binding.mapCenter, binding.mapZoom, showCaseReplay, districtFilter]);

  useEffect(() => {
    if (dataLoaded && showCaseReplay && points.length > 0 && mapRef.current) {
      drawRoutes();
      const t = window.setTimeout(() => startReplay(), 600);
      return () => window.clearTimeout(t);
    }
  }, [dataLoaded, showCaseReplay, points, startReplay, drawRoutes]);

  async function handleFile(file: File) {
    setShowUpload(false);
    setFileName(file.name);
    setSimPhase("parsing");
    setSimProgress(10);
    await new Promise(r => setTimeout(r, 700));
    setSimProgress(30);
    await new Promise(r => setTimeout(r, 500));
    setSimPhase("extracting");
    setSimProgress(50);
    await new Promise(r => setTimeout(r, 700));
    setSimProgress(65);
    await new Promise(r => setTimeout(r, 400));
    setSimPhase("rendering");
    setSimProgress(80);
    await new Promise(r => setTimeout(r, 700));
    setSimProgress(100);
    setSimPhase("complete");
  }

  function handleDismiss() {
    setSimPhase("idle");
    setDataLoaded(true);
  }

  if (!binding.hasMovement) {
    return (
      <div className="glass flex h-[500px] items-center justify-center rounded-xl px-6 text-center text-sm text-muted-foreground">
        No movement data for <span className="font-mono text-foreground">{caseId}</span>.
      </div>
    );
  }

  return (
    <div
      ref={shellRef}
      className={cn(
        "relative w-full overflow-hidden rounded-xl border border-border/50 bg-background",
        fullscreen ? "h-screen max-h-[100dvh] rounded-none" : "h-[500px]",
      )}
    >
      <div ref={ref} className="h-full w-full min-h-[200px]" />
      <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-primary/20" />
      <MapInteractChrome shellRef={shellRef} mapRef={mapRef} onFullscreenChange={setFullscreen} />

      <button
        onClick={() => setShowUpload(true)}
        disabled={isSimulating || isReplaying}
        className="absolute top-3 right-16 z-[500] flex items-center gap-1.5 rounded-lg border border-cyan-500/50 bg-[#060e26]/90 px-3 py-1.5 text-[10px] font-bold text-cyan-300 backdrop-blur-sm hover:bg-cyan-500/20 disabled:opacity-50"
      >
        {isSimulating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
        Add Mobile GPS Log Data
      </button>

      {dataLoaded && replayDone && !isReplaying && (
        <button
          onClick={startReplay}
          className="absolute top-3 right-[11.5rem] z-[500] flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-[#060e26]/90 px-3 py-1.5 text-[10px] font-bold text-emerald-300 backdrop-blur-sm hover:bg-emerald-500/20"
        >
          <Play className="h-3 w-3" />
          Replay
        </button>
      )}

      {dataLoaded && (
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          className="pointer-events-none absolute left-3 top-3 z-[500] flex flex-col gap-2 rounded-md border border-border/60 bg-background/70 px-3 py-2 text-[10px] backdrop-blur shadow-xl"
        >
          <span className="flex items-center gap-1.5 text-cyan-400">
            <span className="h-0.5 w-4 rounded-full bg-cyan-400/80" />
            Victim route
          </span>
          <span className="flex items-center gap-1.5 text-red-400">
            <span className="h-0 w-4 border-t border-dashed border-red-500/80" />
            Suspect route
          </span>
          <span className="flex items-center gap-1.5 text-yellow-400">
            <span className="h-2 w-2 rounded-full ring-2 ring-yellow-400/40" style={{ backgroundColor: COLORS.crime }} />
            Crime scene
          </span>
          {isReplaying && (
            <span className="text-cyan-400 font-mono text-[9px]">Traveling… {replayPct}%</span>
          )}
        </motion.div>
      )}

      <AnimatePresence>
        {!dataLoaded && !isSimulating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[500] flex items-center justify-center pointer-events-none"
          >
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-cyan-500/20 bg-black/70 px-8 py-5 backdrop-blur-sm text-center">
              <MapPin className="h-8 w-8 text-cyan-400" />
              <div className="text-[11px] font-black uppercase tracking-[0.18em] text-cyan-400">Import GPS Log Data</div>
              <div className="text-[10px] text-slate-500 max-w-[220px]">
                Upload a log — victim & suspect dots travel along their paths on the map
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!showCaseReplay && districtFilter && dataLoaded && (
        <div className="pointer-events-none absolute bottom-3 left-3 right-16 z-[500] rounded-md border border-primary/35 bg-background/85 px-3 py-2 text-center text-[11px] text-muted-foreground backdrop-blur">
          Movement replay is for <span className="font-medium text-foreground">{binding.district}</span>. Map centered on{" "}
          <span className="font-medium text-foreground">{districtFilter}</span>.
        </div>
      )}

      <AnimatePresence>
        {showUpload && !isSimulating && (
          <UploadModal key="upload" onFile={handleFile} onClose={() => setShowUpload(false)} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isSimulating && (
          <SimOverlay key="sim" phase={simPhase} fileName={fileName} progress={simProgress} onDismiss={handleDismiss} />
        )}
      </AnimatePresence>
    </div>
  );
}
