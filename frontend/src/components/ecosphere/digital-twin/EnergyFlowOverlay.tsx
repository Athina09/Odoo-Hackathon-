import { useMemo } from "react";
import type { DigitalTwinFacility, DigitalTwinZone } from "@/data/digital-twin";
import { FACILITY_FLOW_EDGES } from "@/lib/digital-twin-industrial";

function zoneCenter(
  zone: DigitalTwinZone,
  cols: number,
  rows: number,
): { x: number; y: number } {
  const colMid = (zone.gridPosition.colStart + zone.gridPosition.colEnd - 1) / 2;
  const rowMid = (zone.gridPosition.rowStart + zone.gridPosition.rowEnd - 1) / 2;
  return {
    x: (colMid / cols) * 100,
    y: (rowMid / rows) * 100,
  };
}

const GRID_NODE = { x: 4, y: 96 };

export function EnergyFlowOverlay({
  facility,
  zones,
  hoveredZoneId,
  selectedZoneId,
}: {
  facility: DigitalTwinFacility;
  zones: DigitalTwinZone[];
  hoveredZoneId: string | null;
  selectedZoneId: string | null;
}) {
  const edges = FACILITY_FLOW_EDGES[facility.id] ?? [];
  const activeId = hoveredZoneId ?? selectedZoneId;

  const zoneMap = useMemo(
    () => Object.fromEntries(zones.map(z => [z.zoneId, z])),
    [zones],
  );

  const connected = useMemo(() => {
    if (!activeId) return new Set<string>();
    const set = new Set<string>([activeId]);
    for (const [from, to] of edges) {
      if (from === activeId) set.add(to);
      if (to === activeId) set.add(from);
      if (from === "grid" && to === activeId) set.add("grid");
      if (to === "grid" && from === activeId) set.add("grid");
    }
    return set;
  }, [activeId, edges]);

  const paths = useMemo(() => {
    return edges
      .map(([from, to], i) => {
        const fromPt =
          from === "grid"
            ? GRID_NODE
            : zoneMap[from]
              ? zoneCenter(zoneMap[from], facility.gridColumns, facility.gridRows)
              : null;
        const toPt =
          to === "grid"
            ? GRID_NODE
            : zoneMap[to]
              ? zoneCenter(zoneMap[to], facility.gridColumns, facility.gridRows)
              : null;
        if (!fromPt || !toPt) return null;
        const isEnergy = from === "grid" || from === "z5" || to === "z5";
        const isCarbon = to === "z4" || from === "z3";
        const isActive =
          !activeId ||
          connected.has(from) ||
          connected.has(to);
        return { id: `${from}-${to}-${i}`, fromPt, toPt, isEnergy, isCarbon, isActive };
      })
      .filter(Boolean) as {
      id: string;
      fromPt: { x: number; y: number };
      toPt: { x: number; y: number };
      isEnergy: boolean;
      isCarbon: boolean;
      isActive: boolean;
    }[];
  }, [edges, zoneMap, facility, connected, activeId]);

  return (
    <svg
      className="pointer-events-none absolute inset-0 z-10 h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <marker id="dt-arrow-energy" markerWidth="4" markerHeight="4" refX="3" refY="2" orient="auto">
          <path d="M0,0 L4,2 L0,4 Z" fill="#3B82F6" opacity="0.7" />
        </marker>
        <marker id="dt-arrow-carbon" markerWidth="4" markerHeight="4" refX="3" refY="2" orient="auto">
          <path d="M0,0 L4,2 L0,4 Z" fill="#F59E0B" opacity="0.6" />
        </marker>
      </defs>

      {/* Grid connection node */}
      <circle cx={GRID_NODE.x} cy={GRID_NODE.y} r="1.2" fill="#3B82F6" opacity="0.8" className="dt-online-dot" />
      <text x={GRID_NODE.x + 2} y={GRID_NODE.y} fill="#64748B" fontSize="2.2" fontFamily="monospace">
        GRID
      </text>

      {paths.map(p => {
        const midX = (p.fromPt.x + p.toPt.x) / 2;
        const midY = (p.fromPt.y + p.toPt.y) / 2 - 3;
        const d = `M ${p.fromPt.x} ${p.fromPt.y} Q ${midX} ${midY} ${p.toPt.x} ${p.toPt.y}`;
        const stroke = p.isCarbon ? "#F59E0B" : "#3B82F6";
        const opacity = p.isActive ? (p.isCarbon ? 0.55 : 0.65) : 0.12;
        return (
          <path
            key={p.id}
            d={d}
            fill="none"
            stroke={stroke}
            strokeWidth={p.isActive ? 0.35 : 0.2}
            strokeDasharray={p.isCarbon ? "1.5 1" : "2 1.2"}
            opacity={opacity}
            markerEnd={p.isActive ? `url(#${p.isCarbon ? "dt-arrow-carbon" : "dt-arrow-energy"})` : undefined}
            className={p.isActive ? "dt-flow-line" : undefined}
          />
        );
      })}
    </svg>
  );
}
