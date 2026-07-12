import type { ZoneStatus } from "@/data/digital-twin";

export const UNIT_BLUE = "#3B82F6";
export const UNIT_LABEL = "rgba(255,255,255,0.65)";

export type TwinCanvasNodeType = "person" | "csr";

export interface TwinPersonNode {
  id: string;
  type: "person";
  facilityId: string;
  name: string;
  role: string;
  dept: string;
  initials: string;
  assignedZoneId?: string;
  assignedActivityId?: string;
  xPct: number;
  yPct: number;
}

export interface TwinCsrActivityNode {
  id: string;
  type: "csr";
  facilityId: string;
  name: string;
  xPct: number;
  yPct: number;
}

export type TwinCanvasNode = TwinPersonNode | TwinCsrActivityNode;

export interface AssignmentConnection {
  facilityId: string;
  from: string;
  to: string;
  type: "assignment";
  tooltip: string;
}

export const twinPersonNodes: TwinPersonNode[] = [
  {
    id: "p1",
    type: "person",
    facilityId: "FAC001",
    name: "R. Iyer",
    role: "Line Supervisor",
    dept: "Manufacturing",
    initials: "RI",
    assignedZoneId: "z1",
    xPct: 18,
    yPct: 88,
  },
  {
    id: "p2",
    type: "person",
    facilityId: "FAC001",
    name: "Priya Sharma",
    role: "CSR Volunteer",
    dept: "HR",
    initials: "PS",
    assignedActivityId: "csr1",
    xPct: 42,
    yPct: 88,
  },
  {
    id: "p3",
    type: "person",
    facilityId: "FAC001",
    name: "K. Menon",
    role: "Ops Lead",
    dept: "Operations",
    initials: "KM",
    assignedZoneId: "z3",
    xPct: 66,
    yPct: 88,
  },
  {
    id: "p4",
    type: "person",
    facilityId: "FAC002",
    name: "A. Kumar",
    role: "Facility Engineer",
    dept: "IT",
    initials: "AK",
    assignedZoneId: "z1",
    xPct: 25,
    yPct: 88,
  },
  {
    id: "p5",
    type: "person",
    facilityId: "FAC003",
    name: "S. Patel",
    role: "Warehouse Lead",
    dept: "Logistics",
    initials: "SP",
    assignedZoneId: "z1",
    xPct: 30,
    yPct: 88,
  },
];

export const twinCsrActivityNodes: TwinCsrActivityNode[] = [
  {
    id: "csr1",
    type: "csr",
    facilityId: "FAC001",
    name: "Tree Plantation Drive",
    xPct: 42,
    yPct: 94,
  },
  {
    id: "csr2",
    type: "csr",
    facilityId: "FAC005",
    name: "Beach Cleanup Campaign",
    xPct: 50,
    yPct: 88,
  },
];

export function getPeopleForFacility(facilityId: string): TwinPersonNode[] {
  return twinPersonNodes.filter(p => p.facilityId === facilityId);
}

export function getCsrNodesForFacility(facilityId: string): TwinCsrActivityNode[] {
  return twinCsrActivityNodes.filter(c => c.facilityId === facilityId);
}

export function buildAssignmentConnections(facilityId: string): AssignmentConnection[] {
  const people = getPeopleForFacility(facilityId);
  return people
    .map(p => {
      const target = p.assignedZoneId ?? p.assignedActivityId;
      if (!target) return null;
      const label = p.assignedZoneId
        ? `${p.name} supervises ${p.assignedZoneId.toUpperCase()}`
        : `${p.name} volunteering at ${p.assignedActivityId}`;
      return {
        facilityId,
        from: p.id,
        to: target,
        type: "assignment" as const,
        tooltip: label,
      };
    })
    .filter(Boolean) as AssignmentConnection[];
}

export function zoneStatusColor(status: ZoneStatus): string {
  switch (status) {
    case "critical":
      return "#EF4444";
    case "watch":
      return "#F59E0B";
    default:
      return "#22C55E";
  }
}

export function personBorderColor(
  person: TwinPersonNode,
  zoneStatuses: Record<string, ZoneStatus>,
): string {
  if (person.assignedZoneId) {
    return zoneStatusColor(zoneStatuses[person.assignedZoneId] ?? "normal");
  }
  return "#64748B";
}
