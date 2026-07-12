export type RiskLevel = "low" | "medium" | "high";
export type FacilityStatus = "good" | "watch" | "critical";

export {
  ecoSphereMockData,
  organization,
  orgDepartments,
  emissionFactors,
  sustainabilityGoals,
  csrCategories,
  challengeCategories,
  csrActivities,
  sustainabilityChallenges,
  ecoBadges,
  ecoRewards,
  ecoPolicies,
  ecoAudits,
  complianceIssueTypes,
  notificationTypes,
  aiInsightTypes,
  ecoRoles,
  esgStatusLabels,
} from "./ecosphere-mock";

export type {
  EcoOrganization,
  EcoDepartment,
  EcoEmployee,
  RoleAssignments,
  NotificationSettings,
  EmissionFactor,
  SustainabilityGoal,
  CsrActivity,
  SustainabilityChallenge,
  EcoBadge,
  EcoReward,
  EcoRole,
  EsgStatusLabel,
  EcoSphereMockData,
} from "./ecosphere-mock";

export interface Facility {
  id: string;
  name: string;
  district: string;
  lat: number;
  lng: number;
  status: FacilityStatus;
  energy: number;
  water: number;
  carbon: number;
  employees: number;
  waste: number;
  risk: RiskLevel;
}

/** Tamil Nadu overview — same framing as AEGIS RiskMap */
export const TN_MAP_CENTER: [number, number] = [11.1271, 78.6569];
export const TN_MAP_ZOOM = 6;

export interface DepartmentRow {
  id: string;
  department: string;
  esg: number;
  carbon: RiskLevel;
  csr: number;
  governance: number;
  confidence: number;
  risk: RiskLevel;
  status: "excellent" | "good" | "watch" | "critical";
}

export interface FeedItem {
  id: string;
  t: string;
  text: string;
  tag: "environment" | "social" | "governance" | "ai" | "carbon";
}

export const ESG_KPIS = {
  overallScore: { value: 91, label: "Excellent", trend: "↑ +4%" },
  carbon: { value: "124 tCO₂", trend: "↓ 12%" },
  aiConfidence: { value: "94%", sub: "Verified" },
  complianceIssues: { value: 4, sub: "2 Critical" },
  csrParticipation: { value: "87%", trend: "↑ 8%" },
  challengesActive: { value: 18, sub: "6 ending soon" },
};

export const facilities: Facility[] = [
  {
    id: "chennai-plant",
    name: "Chennai Plant",
    district: "Chennai",
    lat: 13.0827,
    lng: 80.2707,
    status: "critical",
    energy: 91,
    water: 88,
    carbon: 94,
    employees: 420,
    waste: 82,
    risk: "high",
  },
  {
    id: "coimbatore-factory",
    name: "Coimbatore Factory",
    district: "Coimbatore",
    lat: 11.0168,
    lng: 76.9558,
    status: "good",
    energy: 78,
    water: 81,
    carbon: 55,
    employees: 310,
    waste: 62,
    risk: "low",
  },
  {
    id: "madurai-warehouse",
    name: "Madurai Warehouse",
    district: "Madurai",
    lat: 9.9252,
    lng: 78.1198,
    status: "watch",
    energy: 64,
    water: 58,
    carbon: 72,
    employees: 180,
    waste: 65,
    risk: "medium",
  },
  {
    id: "salem-unit",
    name: "Salem Unit",
    district: "Salem",
    lat: 11.6643,
    lng: 78.146,
    status: "good",
    energy: 76,
    water: 74,
    carbon: 58,
    employees: 145,
    waste: 60,
    risk: "low",
  },
  {
    id: "trichy-office",
    name: "Trichy Office",
    district: "Trichy",
    lat: 10.7905,
    lng: 78.7047,
    status: "watch",
    energy: 70,
    water: 68,
    carbon: 66,
    employees: 95,
    waste: 58,
    risk: "medium",
  },
  {
    id: "tirunelveli-site",
    name: "Tirunelveli Site",
    district: "Tirunelveli",
    lat: 8.7139,
    lng: 77.7567,
    status: "good",
    energy: 72,
    water: 79,
    carbon: 48,
    employees: 88,
    waste: 54,
    risk: "low",
  },
  {
    id: "vellore-lab",
    name: "Vellore Lab",
    district: "Vellore",
    lat: 12.9165,
    lng: 79.1325,
    status: "watch",
    energy: 68,
    water: 71,
    carbon: 61,
    employees: 120,
    waste: 57,
    risk: "medium",
  },
  {
    id: "kanyakumari-depot",
    name: "Kanyakumari Depot",
    district: "Kanyakumari",
    lat: 8.0883,
    lng: 77.5385,
    status: "good",
    energy: 65,
    water: 83,
    carbon: 42,
    employees: 52,
    waste: 50,
    risk: "low",
  },
];

export const departments: DepartmentRow[] = [
  { id: "mfg", department: "Manufacturing", esg: 71, carbon: "high", csr: 68, governance: 74, confidence: 83, risk: "high", status: "watch" },
  { id: "hr", department: "HR", esg: 92, carbon: "low", csr: 94, governance: 96, confidence: 97, risk: "low", status: "excellent" },
  { id: "it", department: "IT", esg: 88, carbon: "medium", csr: 85, governance: 90, confidence: 91, risk: "medium", status: "good" },
  { id: "fin", department: "Finance", esg: 95, carbon: "low", csr: 93, governance: 98, confidence: 99, risk: "low", status: "excellent" },
  { id: "ops", department: "Operations", esg: 79, carbon: "medium", csr: 77, governance: 82, confidence: 86, risk: "medium", status: "good" },
  { id: "legal", department: "Legal & Compliance", esg: 90, carbon: "low", csr: 88, governance: 97, confidence: 95, risk: "low", status: "excellent" },
];

export const liveInsightsSeed: FeedItem[] = [
  { id: "1", t: "9s ago", text: "Manufacturing emissions increased 18%", tag: "carbon" },
  { id: "2", t: "14s ago", text: "New CSR challenge uploaded", tag: "social" },
  { id: "3", t: "1m ago", text: "HR completed diversity policy review", tag: "governance" },
  { id: "4", t: "3m ago", text: "Finance reached Gold Badge", tag: "social" },
  { id: "5", t: "6m ago", text: "Audit approved — Warehouse Q2", tag: "governance" },
  { id: "6", t: "11m ago", text: "Carbon reduced by 7% — Chennai Plant", tag: "environment" },
  { id: "7", t: "18m ago", text: "AI flagged overdue audit in HR", tag: "ai" },
];

export const carbonTrend = [
  { month: "Jan", tco2: 148 },
  { month: "Feb", tco2: 142 },
  { month: "Mar", tco2: 138 },
  { month: "Apr", tco2: 135 },
  { month: "May", tco2: 130 },
  { month: "Jun", tco2: 124 },
];

export const esgRadar = [
  { axis: "Environment", score: 88 },
  { axis: "Social", score: 92 },
  { axis: "Governance", score: 94 },
  { axis: "Ethics", score: 89 },
  { axis: "Supply Chain", score: 85 },
];

export const departmentScores = [
  { name: "HR", value: 92 },
  { name: "Finance", value: 95 },
  { name: "IT", value: 88 },
  { name: "Ops", value: 79 },
  { name: "Mfg", value: 71 },
];

export const topEmitters = [
  { site: "Chennai Plant", tco2: 42 },
  { site: "Madurai Warehouse", tco2: 28 },
  { site: "Coimbatore Factory", tco2: 22 },
  { site: "Trichy Office", tco2: 18 },
];

export const aiRecommendations = [
  {
    id: "r1",
    title: "Switch 5 diesel fleet vehicles to EV",
    impact: "Save 21 tons CO₂",
    esgBoost: "+8 ESG",
  },
  {
    id: "r2",
    title: "Enable smart HVAC in Office Chennai",
    impact: "−14% energy use",
    esgBoost: "+3 ESG",
  },
];

export const ecoNav = [
  { to: "/", label: "Dashboard", icon: "dashboard" },
  { to: "/environment", label: "Environment", icon: "leaf" },
  { to: "/manager", label: "Social", icon: "users" },
  { to: "/manager", label: "Governance", icon: "shield" },
  { to: "/manager", label: "AI Insights", icon: "sparkles" },
  { to: "/manager", label: "Reports", icon: "file" },
] as const;

export type EsgSeverity = "low" | "medium" | "high" | "critical";

export interface EnvironmentCase {
  id: string;
  ref: string;
  title: string;
  district: string;
  status: "Active" | "Review" | "Closed" | "Watch";
  severity: EsgSeverity;
  aiConfidence: number;
  flagged: boolean;
  officer: string;
  opened: string;
  type: string;
  site: string;
}

export const environmentCases: EnvironmentCase[] = [
  { id: "ES-101", ref: "ENV/2026/CHN/0042", title: "Chennai Plant Carbon Overrun", district: "Chennai", status: "Active", severity: "critical", aiConfidence: 94, flagged: true, officer: "M. Priya", opened: "2026-05-10", type: "Carbon", site: "Chennai Plant" },
  { id: "ES-102", ref: "ENV/2026/MDU/0018", title: "Madurai Warehouse Waste Breach", district: "Madurai", status: "Active", severity: "critical", aiConfidence: 88, flagged: true, officer: "R. Kumar", opened: "2026-05-12", type: "Waste", site: "Madurai Warehouse" },
  { id: "ES-103", ref: "ENV/2026/CBE/0033", title: "Coimbatore Energy Audit Failure", district: "Coimbatore", status: "Review", severity: "high", aiConfidence: 72, flagged: true, officer: "S. Anand", opened: "2026-05-14", type: "Energy", site: "Coimbatore Factory" },
  { id: "ES-104", ref: "ENV/2026/SLM/0012", title: "Salem Scope 2 Reporting Gap", district: "Salem", status: "Active", severity: "medium", aiConfidence: 58, flagged: false, officer: "K. Devi", opened: "2026-05-03", type: "Reporting", site: "Salem Unit" },
  { id: "ES-105", ref: "ENV/2026/TRY/0029", title: "Trichy Water Usage Anomaly", district: "Trichy", status: "Active", severity: "high", aiConfidence: 83, flagged: true, officer: "A. Ramesh", opened: "2026-05-04", type: "Water", site: "Trichy Office" },
  { id: "ES-106", ref: "ENV/2026/TIR/0007", title: "Tirunelveli Solar Offset Delay", district: "Tirunelveli", status: "Watch", severity: "medium", aiConfidence: 41, flagged: false, officer: "D. Vinod", opened: "2026-03-19", type: "Renewable", site: "Tirunelveli Site" },
  { id: "ES-107", ref: "ENV/2026/VEL/0051", title: "Vellore Emissions Spike", district: "Vellore", status: "Active", severity: "critical", aiConfidence: 79, flagged: true, officer: "S. Hari", opened: "2026-05-06", type: "Emissions", site: "Vellore Lab" },
  { id: "ES-108", ref: "ENV/2026/KNY/0002", title: "Kanyakumari Plastic Waste Audit", district: "Kanyakumari", status: "Review", severity: "low", aiConfidence: 33, flagged: false, officer: "L. Thomas", opened: "2026-05-07", type: "Waste", site: "Kanyakumari Depot" },
];
