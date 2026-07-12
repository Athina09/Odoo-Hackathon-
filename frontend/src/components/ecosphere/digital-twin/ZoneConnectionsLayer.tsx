import { useCallback, useEffect, useState, type MutableRefObject, type RefObject } from "react";
import type { ZoneConnection } from "@/data/digital-twin";
import type { ZoneTelemetry } from "@/lib/digital-twin-engine";
import type { AssignmentConnection } from "@/lib/digital-twin-people";
import type { ZoneStatus } from "@/data/digital-twin";

const TYPE_STYLES = {
  energy: { stroke: "#FACC15", dash: undefined as string | undefined, width: 1.5, opacity: 0.72 },
  flow: { stroke: "#8B5CF6", dash: undefined, width: 1.5, opacity: 0.55 },
  risk: { stroke: "#EF4444", dash: "4 3", width: 1.5, opacity: 0.55 },
  assignment: { stroke: "#94A3B8", dash: undefined, width: 0.8, opacity: 0.28 },
} as const;

type CanvasConnection = ZoneConnection | AssignmentConnection;

function riskVisible(conn: ZoneConnection, zones: ZoneTelemetry[]): boolean {
  if (conn.type !== "risk") return true;
  const from = zones.find(z => z.zoneId === conn.from);
  const to = zones.find(z => z.zoneId === conn.to);
  const stressed = (s: ZoneStatus | undefined) => s === "watch" || s === "critical";
  return stressed(from?.status) && stressed(to?.status);
}

export function ZoneConnectionsLayer({
  connections,
  assignmentConnections,
  zones,
  nodeRefs,
  containerRef,
  highlightedZones,
  onHighlightZones,
  onHoverConnection,
}: {
  connections: ZoneConnection[];
  assignmentConnections: AssignmentConnection[];
  zones: ZoneTelemetry[];
  nodeRefs: MutableRefObject<Map<string, HTMLDivElement>>;
  containerRef: RefObject<HTMLDivElement | null>;
  highlightedZones: Set<string>;
  onHighlightZones: (ids: Set<string>) => void;
  onHoverConnection: (tooltip: string | null, pos: { x: number; y: number } | null) => void;
}) {
  const [paths, setPaths] = useState<
    { id: string; d: string; conn: CanvasConnection; visible: boolean }[]
  >([]);
  const [size, setSize] = useState({ w: 0, h: 0 });

  const recompute = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    setSize({ w: rect.width, h: rect.height });

    const centers = new Map<string, { x: number; y: number }>();
    nodeRefs.current.forEach((el, id) => {
      const r = el.getBoundingClientRect();
      centers.set(id, {
        x: r.left + r.width / 2 - rect.left,
        y: r.top + r.height / 2 - rect.top,
      });
    });

    const all: CanvasConnection[] = [...connections, ...assignmentConnections];
    const next = all
      .map(conn => {
        const from = centers.get(conn.from);
        const to = centers.get(conn.to);
        if (!from || !to) return null;
        if (conn.type === "risk" && !riskVisible(conn, zones)) return null;
        const mx = (from.x + to.x) / 2;
        const my = (from.y + to.y) / 2 - (conn.type === "assignment" ? 12 : 24);
        const d = `M ${from.x} ${from.y} Q ${mx} ${my} ${to.x} ${to.y}`;
        return { id: `${conn.from}-${conn.to}-${conn.type}`, d, conn, visible: true };
      })
      .filter(Boolean) as { id: string; d: string; conn: CanvasConnection; visible: boolean }[];

    setPaths(next);
  }, [connections, assignmentConnections, zones, containerRef, nodeRefs]);

  useEffect(() => {
    recompute();
    const container = containerRef.current;
    if (!container) return;
    const ro = new ResizeObserver(recompute);
    ro.observe(container);
    window.addEventListener("resize", recompute);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", recompute);
    };
  }, [recompute, containerRef]);

  if (size.w === 0) return null;

  return (
    <svg
      className="pointer-events-none absolute inset-0 z-30"
      width={size.w}
      height={size.h}
      aria-hidden
    >
      {paths.map(p => {
        const style = TYPE_STYLES[p.conn.type];
        const active =
          highlightedZones.has(p.conn.from) || highlightedZones.has(p.conn.to);
        const isAssignment = p.conn.type === "assignment";
        return (
          <path
            key={p.id}
            d={p.d}
            fill="none"
            stroke={style.stroke}
            strokeWidth={active && !isAssignment ? 2.5 : style.width}
            strokeDasharray={style.dash}
            opacity={active && !isAssignment ? 0.95 : style.opacity}
            className={
              p.conn.type !== "risk" && p.conn.type !== "assignment"
                ? "dt-flow-line pointer-events-auto cursor-default"
                : "pointer-events-auto cursor-default"
            }
            style={{ pointerEvents: "stroke" }}
            onMouseEnter={e => {
              onHighlightZones(new Set([p.conn.from, p.conn.to]));
              const rect = containerRef.current?.getBoundingClientRect();
              if (rect) {
                onHoverConnection(p.conn.tooltip, {
                  x: e.clientX - rect.left,
                  y: e.clientY - rect.top,
                });
              }
            }}
            onMouseLeave={() => {
              onHighlightZones(new Set());
              onHoverConnection(null, null);
            }}
          />
        );
      })}
    </svg>
  );
}

export function ConnectionsLegend() {
  return (
    <div className="pointer-events-none absolute bottom-14 left-3 z-40 rounded-md border border-white/10 bg-black/40 px-2 py-1.5">
      <div className="mb-1 text-[9px] font-semibold uppercase tracking-[0.05em] text-white/70">
        Zone Connections
      </div>
      <div className="flex flex-col gap-1">
        {[
          { label: "Energy", color: "#FACC15", dash: false },
          { label: "Flow", color: "#8B5CF6", dash: false },
          { label: "Risk", color: "#EF4444", dash: true },
          { label: "Assignment", color: "#94A3B8", dash: false, faint: true },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-1.5">
            <span
              className="inline-block h-px w-4"
              style={{
                background: l.dash ? undefined : l.color,
                borderTop: l.dash ? `1px dashed ${l.color}` : undefined,
                opacity: l.faint ? 0.45 : 1,
              }}
            />
            <span className="text-[9px] font-medium uppercase tracking-wider text-white/60">{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
