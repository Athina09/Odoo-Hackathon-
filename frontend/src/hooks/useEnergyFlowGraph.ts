import { useCallback, useEffect, useState } from "react";
import { PLANT_ENERGY_FLOW } from "@/lib/digital-twin-industrial";

export type EnergyFlowEdge = { from: string; to: string };

const STORAGE_PREFIX = "eco-energy-flow";

function edgeKey(from: string, to: string) {
  return `${from}->${to}`;
}

function loadEdges(facilityId: string): EnergyFlowEdge[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}:${facilityId}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as EnergyFlowEdge[];
    if (!Array.isArray(parsed)) return null;
    return parsed.filter(e => e?.from && e?.to);
  } catch {
    return null;
  }
}

function saveEdges(facilityId: string, edges: EnergyFlowEdge[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(`${STORAGE_PREFIX}:${facilityId}`, JSON.stringify(edges));
}

function defaultEdges(facilityId: string): EnergyFlowEdge[] {
  return (PLANT_ENERGY_FLOW[facilityId] ?? []).map(([from, to]) => ({ from, to }));
}

export function useEnergyFlowGraph(facilityId: string) {
  const [edges, setEdges] = useState<EnergyFlowEdge[]>(() => {
    return loadEdges(facilityId) ?? defaultEdges(facilityId);
  });

  useEffect(() => {
    setEdges(loadEdges(facilityId) ?? defaultEdges(facilityId));
  }, [facilityId]);

  const persist = useCallback(
    (next: EnergyFlowEdge[]) => {
      setEdges(next);
      saveEdges(facilityId, next);
    },
    [facilityId],
  );

  const addEdge = useCallback(
    (from: string, to: string) => {
      if (from === to) return;
      persist(
        edges.some(e => e.from === from && e.to === to)
          ? edges
          : [...edges, { from, to }],
      );
    },
    [edges, persist],
  );

  const removeEdge = useCallback(
    (from: string, to: string) => {
      persist(edges.filter(e => !(e.from === from && e.to === to)));
    },
    [edges, persist],
  );

  const resetEdges = useCallback(() => {
    const next = defaultEdges(facilityId);
    persist(next);
  }, [facilityId, persist]);

  const hasCustom = edges.length > 0;

  return { edges, addEdge, removeEdge, resetEdges, hasCustom, edgeKey };
}
