import { useCallback, useEffect, useState, type MutableRefObject, type RefObject } from "react";
import type { EnergyFlowEdge } from "@/hooks/useEnergyFlowGraph";

const FLOW_STROKE = "rgba(250, 204, 21, 0.75)";
const FLOW_HIT = "rgba(250, 204, 21, 0.01)";

interface Rect {
  cx: number;
  cy: number;
  hw: number;
  hh: number;
}

function toRect(el: HTMLElement, container: DOMRect): Rect {
  const r = el.getBoundingClientRect();
  return {
    cx: r.left - container.left + r.width / 2,
    cy: r.top - container.top + r.height / 2,
    hw: r.width / 2,
    hh: r.height / 2,
  };
}

function borderPoint(rect: Rect, tx: number, ty: number) {
  const dx = tx - rect.cx;
  const dy = ty - rect.cy;
  if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
    return { x: rect.cx, y: rect.cy };
  }
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);
  if (absDx * rect.hh > absDy * rect.hw) {
    const sign = dx > 0 ? 1 : -1;
    return { x: rect.cx + sign * rect.hw, y: rect.cy + (dy / absDx) * rect.hw };
  }
  const sign = dy > 0 ? 1 : -1;
  return { x: rect.cx + (dx / absDy) * rect.hh, y: rect.cy + sign * rect.hh };
}

export function BlueprintFlowLines({
  edges,
  zoneIds,
  nodeRefs,
  containerRef,
  visible,
  editable = false,
  isDragging = false,
  onRemoveEdge,
  previewLine,
}: {
  edges: EnergyFlowEdge[];
  zoneIds: string[];
  nodeRefs: MutableRefObject<Map<string, HTMLDivElement>>;
  containerRef: RefObject<HTMLDivElement | null>;
  visible: boolean;
  editable?: boolean;
  isDragging?: boolean;
  onRemoveEdge?: (from: string, to: string) => void;
  previewLine?: { x1: number; y1: number; x2: number; y2: number } | null;
}) {
  const [segments, setSegments] = useState<
    { id: string; from: string; to: string; x1: number; y1: number; x2: number; y2: number }[]
  >([]);
  const [size, setSize] = useState({ w: 0, h: 0 });

  const recompute = useCallback(() => {
    if (!visible) {
      setSegments([]);
      return;
    }
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    setSize({ w: rect.width, h: rect.height });

    const next = edges
      .map(({ from, to }) => {
        const elA = nodeRefs.current.get(from);
        const elB = nodeRefs.current.get(to);
        if (!elA || !elB) return null;
        const a = toRect(elA, rect);
        const b = toRect(elB, rect);
        const p1 = borderPoint(a, b.cx, b.cy);
        const p2 = borderPoint(b, a.cx, a.cy);
        return { id: `${from}->${to}`, from, to, x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y };
      })
      .filter(Boolean) as {
      id: string;
      from: string;
      to: string;
      x1: number;
      y1: number;
      x2: number;
      y2: number;
    }[];

    setSegments(next);
  }, [edges, containerRef, nodeRefs, visible]);

  useEffect(() => {
    recompute();
    const container = containerRef.current;
    if (!container) return;
    const ro = new ResizeObserver(recompute);
    ro.observe(container);
    window.addEventListener("resize", recompute);
    const id = setInterval(recompute, 5000);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", recompute);
      clearInterval(id);
    };
  }, [recompute, zoneIds.join(",")]);

  if (!visible || size.w === 0) return null;

  const linesInteractive = editable && !isDragging;

  return (
    <svg
      className="absolute inset-0 z-[15]"
      width={size.w}
      height={size.h}
      style={{ pointerEvents: linesInteractive ? "auto" : "none" }}
      aria-hidden={!linesInteractive}
    >
      <defs>
        <marker id="dt-flow-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill="rgba(250, 204, 21, 0.85)" />
        </marker>
      </defs>

      {segments.map(s => (
        <g key={s.id}>
          {linesInteractive && (
            <line
              x1={s.x1}
              y1={s.y1}
              x2={s.x2}
              y2={s.y2}
              stroke={FLOW_HIT}
              strokeWidth={14}
              className="cursor-pointer"
              onClick={e => {
                e.stopPropagation();
                onRemoveEdge?.(s.from, s.to);
              }}
            />
          )}
          <line
            x1={s.x1}
            y1={s.y1}
            x2={s.x2}
            y2={s.y2}
            stroke={FLOW_STROKE}
            strokeWidth={linesInteractive ? 2 : 1.5}
            strokeLinecap="round"
            markerEnd="url(#dt-flow-arrow)"
            className="pointer-events-none"
          />
        </g>
      ))}

      {previewLine && (
        <line
          x1={previewLine.x1}
          y1={previewLine.y1}
          x2={previewLine.x2}
          y2={previewLine.y2}
          stroke="rgba(250, 204, 21, 0.45)"
          strokeWidth={2}
          strokeDasharray="6 4"
          strokeLinecap="round"
          pointerEvents="none"
        />
      )}
    </svg>
  );
}
