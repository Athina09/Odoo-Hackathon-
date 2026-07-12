import {
  Cloud,
  TrendingDown,
  Factory,
  Target,
  Gauge,
  AlertTriangle,
  Users,
  Heart,
  GraduationCap,
  UserCheck,
  Clock,
  Shield,
  FileWarning,
  Calendar,
  ClipboardCheck,
  Trophy,
  Medal,
  Gift,
  Crown,
  Zap,
} from "lucide-react";
import { heatmapZones } from "@/data/data";
import { liveInsightsSeed } from "@/data/ecosphere";
import type { FeedInsight, HeatmapZone, KpiCardProps } from "@/components/ecosphere/ds";
import type { PillTone } from "@/components/ecosphere/ds";

function zoneFromDistrict(
  district: string,
  value: number,
  severity: HeatmapZone["severity"],
  extra?: string,
): HeatmapZone {
  const z = heatmapZones.find(h => h.district === district)!;
  return {
    id: district.toLowerCase(),
    label: district,
    lat: z.lat,
    lng: z.lng,
    value,
    severity,
    tooltip: extra ?? `<b>${district}</b><br/>Index: ${value}`,
  };
}

export const environmentalKpis: KpiCardProps[] = [
  { label: "Total Emissions", value: "12.4", subtitle: "tCO₂ this quarter", icon: Cloud, iconColor: "purple", trend: "↓ 8%", trendDirection: "down" },
  { label: "Emission Trend", value: "−8%", subtitle: "vs last quarter", icon: TrendingDown, iconColor: "teal", trend: "on track", trendDirection: "up" },
  { label: "Top Source", value: "Mfg", subtitle: "Manufacturing · 58% of total", icon: Factory, iconColor: "amber", trend: "Transport 24%", trendDirection: "down" },
  { label: "Goal Progress", value: "68%", subtitle: "20% reduction target", icon: Target, iconColor: "green", trend: "↑ 8%", trendDirection: "up" },
  { label: "Factors Configured", value: 5, subtitle: "active emission factors", icon: Gauge, iconColor: "blue" },
  { label: "Depts Over Target", value: 2, subtitle: "Manufacturing, Transport", icon: AlertTriangle, iconColor: "red", trend: "review due", trendDirection: "down" },
];

export const environmentalInsights: FeedInsight[] = [
  { id: "e1", timestamp: "9s ago", text: "Transport fleet diesel (890 L) added 2,340 kg CO₂ — largest transaction this week" },
  { id: "e2", timestamp: "2m ago", text: "Manufacturing grid load on Jul 1: 12,400 kWh → 6,080 kg CO₂, 18% above target" },
  { id: "e3", timestamp: "5m ago", text: "Manufacturing accounts for 58% of org emissions — diesel generator + grid combined" },
  { id: "e4", timestamp: "11m ago", text: "Finance + HR combined footprint only 2% — remote-friendly offices performing well" },
  { id: "e5", timestamp: "18m ago", text: "Transport fleet is 24% of total — consider EV pilot on Chennai–Coimbatore route" },
];

export interface CarbonDeptRow {
  id: string;
  department: string;
  emissions: number;
  vsTarget: string;
  trend: string;
  confidence: number;
  risk: PillTone;
  status: PillTone;
}

export const emissionsTrendWithTarget = [
  { month: "Jan", actual: 148, target: 140 },
  { month: "Feb", actual: 142, target: 136 },
  { month: "Mar", actual: 138, target: 132 },
  { month: "Apr", actual: 135, target: 128 },
  { month: "May", actual: 130, target: 124 },
  { month: "Jun", actual: 124, target: 120 },
];

export const emissionSourceBreakdown = [
  { source: "Manufacturing", tco2: 7.2, pct: 58, color: "#8B5CF6" },
  { source: "Transport", tco2: 3.0, pct: 24, color: "#EF4444" },
  { source: "Operations", tco2: 1.2, pct: 10, color: "#F59E0B" },
  { source: "IT", tco2: 0.7, pct: 6, color: "#3B82F6" },
  { source: "HR", tco2: 0.15, pct: 1, color: "#14B8A6" },
  { source: "Finance", tco2: 0.15, pct: 1, color: "#22C55E" },
];

export interface CarbonTransaction {
  id: string;
  date: string;
  source: string;
  department: string;
  amount: string;
  co2Kg: number;
  factor: string;
  factorValue: string;
  linkedRecord: string;
}

export const carbonTransactions: CarbonTransaction[] = [
  { id: "ct1", date: "Jun 28", source: "Diesel generator", department: "Manufacturing", amount: "420 L", co2Kg: 1120, factor: "Diesel", factorValue: "2.68 kg CO₂/L", linkedRecord: "Backup generator · Chennai Plant Floor 3" },
  { id: "ct2", date: "Jun 30", source: "Fleet diesel", department: "Transport", amount: "890 L", co2Kg: 2340, factor: "Diesel", factorValue: "2.68 kg CO₂/L", linkedRecord: "Fleet batch #TR-449 · 6 vehicles" },
  { id: "ct3", date: "Jul 1", source: "Grid electricity", department: "Manufacturing", amount: "12,400 kWh", co2Kg: 6080, factor: "Electricity", factorValue: "0.49 kg CO₂/kWh", linkedRecord: "Production run · Lines 1–4 peak load" },
  { id: "ct4", date: "Jul 2", source: "Grid electricity", department: "Operations", amount: "4,200 kWh", co2Kg: 2060, factor: "Electricity", factorValue: "0.49 kg CO₂/kWh", linkedRecord: "Warehouse ops · Madurai hub" },
  { id: "ct5", date: "Jul 3", source: "Fleet diesel", department: "Transport", amount: "610 L", co2Kg: 1600, factor: "Diesel", factorValue: "2.68 kg CO₂/L", linkedRecord: "Route CHN–CBE · 4 trucks" },
  { id: "ct6", date: "Jul 4", source: "Data center cooling", department: "IT", amount: "3,100 kWh", co2Kg: 1520, factor: "Electricity", factorValue: "0.49 kg CO₂/kWh", linkedRecord: "DC rack cooling · Coimbatore DC" },
  { id: "ct7", date: "Jul 4", source: "Office electricity", department: "HR", amount: "890 kWh", co2Kg: 436, factor: "Electricity", factorValue: "0.49 kg CO₂/kWh", linkedRecord: "HQ office · Floor 2" },
  { id: "ct8", date: "Jul 5", source: "Office electricity", department: "Finance", amount: "410 kWh", co2Kg: 201, factor: "Electricity", factorValue: "0.49 kg CO₂/kWh", linkedRecord: "Finance wing · remote-hybrid floor" },
];

export const contributorSpotlight = [
  { id: "sp1", name: "Emily Watson", department: "HR", activity: "Tree Plantation Drive", points: 420 },
  { id: "sp2", name: "R. Iyer", department: "Manufacturing", activity: "Factory Floor Blood Donation", points: 380 },
  { id: "sp3", name: "K. Menon", department: "Operations", activity: "Beach Cleanup Campaign", points: 310 },
  { id: "sp4", name: "S. Rao", department: "IT", activity: "Coding Bootcamp for Kids", points: 240 },
];

export const diversityByDepartment = [
  { department: "HR", index: 0.81 },
  { department: "Finance", index: 0.74 },
  { department: "Operations", index: 0.68 },
  { department: "Manufacturing", index: 0.61 },
  { department: "Transport", index: 0.54 },
  { department: "IT", index: 0.42 },
];

export const csrParticipationByDept = [
  { department: "HR", percent: 94 },
  { department: "Manufacturing", percent: 88 },
  { department: "Operations", percent: 77 },
  { department: "Transport", percent: 65 },
  { department: "IT", percent: 58 },
  { department: "Finance", percent: 31 },
];

export type KanbanColumn = "open" | "review" | "resolved";

export interface GovernanceKanbanCard {
  id: string;
  title: string;
  department: string;
  severity: PillTone;
  owner: string;
  ownerInitials: string;
  dueDate: string;
  daysOverdue: number;
  column: KanbanColumn;
}

export const governanceKanbanCards: GovernanceKanbanCard[] = [
  { id: "gk1", title: "Fire exit partially blocked, Floor 3", department: "Manufacturing", severity: "critical", owner: "R. Iyer", ownerInitials: "RI", dueDate: "Jul 5", daysOverdue: 7, column: "open" },
  { id: "gk2", title: "Missing PPE compliance log", department: "Manufacturing", severity: "high", owner: "R. Iyer", ownerInitials: "RI", dueDate: "Jul 10", daysOverdue: 0, column: "open" },
  { id: "gk3", title: "Vendor data-sharing policy gap", department: "IT", severity: "medium", owner: "S. Rao", ownerInitials: "SR", dueDate: "Jul 15", daysOverdue: 0, column: "review" },
  { id: "gk4", title: "Expired fire safety certificate", department: "Operations", severity: "high", owner: "K. Menon", ownerInitials: "KM", dueDate: "Jul 8", daysOverdue: 4, column: "open" },
  { id: "gk5", title: "Late quarterly financial audit", department: "Finance", severity: "low", owner: "Michael Brown", ownerInitials: "MB", dueDate: "Jun 30", daysOverdue: 0, column: "resolved" },
];

export const policyAckProgress = [
  { department: "HR", percent: 100 },
  { department: "Finance", percent: 98 },
  { department: "Transport", percent: 95 },
  { department: "IT", percent: 93 },
  { department: "Operations", percent: 89 },
  { department: "Manufacturing", percent: 82 },
];

export const auditScoresByDepartment = [
  { department: "Finance", score: 97 },
  { department: "HR", score: 95 },
  { department: "Transport", score: 91 },
  { department: "IT", score: 89 },
  { department: "Operations", score: 79 },
  { department: "Manufacturing", score: 62 },
];

export type ChallengeLifecycle = "draft" | "active" | "review" | "completed";

export interface ChallengeKanbanCard {
  id: string;
  title: string;
  category: string;
  xp: number;
  progress: number;
  lifecycle: ChallengeLifecycle;
}

export const challengeKanbanCards: ChallengeKanbanCard[] = [
  { id: "ck1", title: "No Plastic Week", category: "Reduce Plastic", xp: 250, progress: 72, lifecycle: "active" },
  { id: "ck2", title: "Cycle to Work", category: "Cycle to Work", xp: 350, progress: 45, lifecycle: "active" },
  { id: "ck3", title: "Paperless Office", category: "Paperless", xp: 150, progress: 100, lifecycle: "completed" },
  { id: "ck4", title: "Energy Saver", category: "Energy Saving", xp: 220, progress: 60, lifecycle: "review" },
  { id: "ck5", title: "Water Conservation", category: "Water", xp: 180, progress: 0, lifecycle: "draft" },
];

export const rewardCatalog = [
  { id: "rw1", name: "Coffee Coupon", points: 500, stock: 24, icon: "☕" },
  { id: "rw2", name: "Movie Ticket", points: 1000, stock: 12, icon: "🎬" },
  { id: "rw3", name: "Amazon Gift Card", points: 2000, stock: 8, icon: "🎁" },
  { id: "rw4", name: "Wireless Earbuds", points: 5000, stock: 3, icon: "🎧" },
  { id: "rw5", name: "Extra Leave Day", points: 3000, stock: 5, icon: "🏖️" },
];

export const carbonDeptRows: CarbonDeptRow[] = [
  { id: "mfg", department: "Manufacturing", emissions: 72, vsTarget: "+22%", trend: "↑ rising", confidence: 91, risk: "high", status: "critical" },
  { id: "trn", department: "Transport", emissions: 39, vsTarget: "+18%", trend: "↑ rising", confidence: 88, risk: "high", status: "critical" },
  { id: "ops", department: "Operations", emissions: 21, vsTarget: "+6%", trend: "→ flat", confidence: 84, risk: "medium", status: "medium" },
  { id: "it", department: "IT", emissions: 15, vsTarget: "−2%", trend: "↓ falling", confidence: 86, risk: "low", status: "good" },
  { id: "hr", department: "HR", emissions: 4, vsTarget: "−8%", trend: "↓ falling", confidence: 92, risk: "low", status: "excellent" },
  { id: "fin", department: "Finance", emissions: 2, vsTarget: "−12%", trend: "↓ falling", confidence: 95, risk: "low", status: "excellent" },
];

export const socialKpis: KpiCardProps[] = [
  { label: "CSR Participation", value: "72%", subtitle: "org-wide average", icon: Users, iconColor: "green", trend: "HR leads at 94%", trendDirection: "up" },
  { label: "Active Activities", value: 6, subtitle: "this quarter", icon: Heart, iconColor: "teal", trend: "2 ending soon", trendDirection: "up" },
  { label: "Diversity Index", value: "0.63", subtitle: "org-wide · IT lowest", icon: UserCheck, iconColor: "purple", trend: "IT 0.42", trendDirection: "down" },
  { label: "Training Complete", value: "91%", subtitle: "mandatory modules", icon: GraduationCap, iconColor: "blue", trend: "on target", trendDirection: "up" },
  { label: "Engaged", value: 180, subtitle: "employees participated", icon: Users, iconColor: "teal" },
  { label: "Pending Approvals", value: 3, subtitle: "CSR submissions", icon: Clock, iconColor: "amber", trend: "Finance low uptake", trendDirection: "down" },
];

export const csrHeatmapZones: HeatmapZone[] = [
  zoneFromDistrict("Chennai", 94, "low", "<b>HR</b><br/>Participation: 94%"),
  zoneFromDistrict("Coimbatore", 88, "low", "<b>Manufacturing</b><br/>Participation: 88%"),
  zoneFromDistrict("Madurai", 77, "medium", "<b>Operations</b><br/>Participation: 77%"),
  zoneFromDistrict("Salem", 65, "medium", "<b>Transport</b><br/>Participation: 65%"),
  zoneFromDistrict("Trichy", 58, "medium", "<b>IT</b><br/>Participation: 58%"),
  zoneFromDistrict("Tirunelveli", 31, "high", "<b>Finance</b><br/>Participation: 31%"),
  zoneFromDistrict("Vellore", 72, "medium"),
  zoneFromDistrict("Kanyakumari", 68, "medium"),
];

export const environmentHeatmapZones: HeatmapZone[] = [
  zoneFromDistrict("Chennai", 88, "high", "<b>Manufacturing hub</b><br/>Carbon intensity: 88"),
  zoneFromDistrict("Coimbatore", 74, "high", "<b>Industrial belt</b><br/>Carbon intensity: 74"),
  zoneFromDistrict("Salem", 61, "medium", "<b>Transport corridor</b><br/>Carbon intensity: 61"),
  zoneFromDistrict("Madurai", 52, "medium", "<b>Operations</b><br/>Carbon intensity: 52"),
  zoneFromDistrict("Trichy", 44, "medium", "<b>Mixed facilities</b><br/>Carbon intensity: 44"),
  zoneFromDistrict("Vellore", 38, "low", "<b>Lower draw</b><br/>Carbon intensity: 38"),
  zoneFromDistrict("Tirunelveli", 29, "low", "<b>Remote sites</b><br/>Carbon intensity: 29"),
  zoneFromDistrict("Kanyakumari", 22, "low", "<b>Coastal depot</b><br/>Carbon intensity: 22"),
];

export const governanceHeatmapZones: HeatmapZone[] = [
  zoneFromDistrict("Chennai", 76, "high", "<b>HQ cluster</b><br/>Open issues: 6"),
  zoneFromDistrict("Coimbatore", 68, "medium", "<b>Plant compliance</b><br/>Open issues: 4"),
  zoneFromDistrict("Madurai", 55, "medium", "<b>Policy gaps</b><br/>Open issues: 3"),
  zoneFromDistrict("Salem", 48, "medium", "<b>Audit watch</b><br/>Open issues: 2"),
  zoneFromDistrict("Trichy", 41, "low", "<b>Stable</b><br/>Open issues: 2"),
  zoneFromDistrict("Vellore", 36, "low", "<b>Low exposure</b><br/>Open issues: 1"),
  zoneFromDistrict("Tirunelveli", 33, "low", "<b>Low exposure</b><br/>Open issues: 1"),
  zoneFromDistrict("Kanyakumari", 28, "low", "<b>Clear</b><br/>Open issues: 0"),
];

export const socialInsights: FeedInsight[] = [
  { id: "s1", timestamp: "22s ago", text: "Finance CSR participation at 31% — lowest in org; consider lighter volunteering during close periods" },
  { id: "s2", timestamp: "1m ago", text: "Manufacturing Factory Floor Blood Donation drew 61 participants — strong social turnout despite high emissions" },
  { id: "s3", timestamp: "4m ago", text: "IT diversity index 0.42 — lowest department; review hiring pipeline and campus outreach mix" },
  { id: "s4", timestamp: "8m ago", text: "HR Tree Plantation Drive: 42 participants, highest single-activity turnout this quarter" },
  { id: "s5", timestamp: "15m ago", text: "Transport Driver Safety Awareness Week enrolled 22 drivers — steady medium participation" },
];

export const csrActivityRows: CsrActivityRow[] = [
  { id: "csr1", activity: "Tree Plantation Drive", department: "HR", participants: 42, proofStatus: "excellent", approval: "excellent", points: 150, status: "excellent" },
  { id: "csr2", activity: "Factory Floor Blood Donation", department: "Manufacturing", participants: 61, proofStatus: "excellent", approval: "excellent", points: 180, status: "excellent" },
  { id: "csr3", activity: "Beach Cleanup Campaign", department: "Operations", participants: 28, proofStatus: "good", approval: "good", points: 200, status: "good" },
  { id: "csr4", activity: "Coding Bootcamp for Kids", department: "IT", participants: 19, proofStatus: "medium", approval: "good", points: 120, status: "good" },
  { id: "csr5", activity: "Driver Safety Awareness Week", department: "Transport", participants: 22, proofStatus: "good", approval: "good", points: 100, status: "good" },
  { id: "csr6", activity: "Financial Literacy Workshop", department: "Finance", participants: 8, proofStatus: "low", approval: "medium", points: 90, status: "medium" },
];

export const governanceKpis: KpiCardProps[] = [
  { label: "Compliance Score", value: "86%", subtitle: "org-wide", icon: Shield, iconColor: "teal", trend: "Mfg drags avg", trendDirection: "down" },
  { label: "Open Issues", value: 4, subtitle: "across departments", icon: FileWarning, iconColor: "red", trend: "2 critical", trendDirection: "down" },
  { label: "Overdue Issues", value: 2, subtitle: "Mfg + Operations", icon: AlertTriangle, iconColor: "amber", trend: "escalated", trendDirection: "down" },
  { label: "Policy Ack.", value: "93%", subtitle: "employees acknowledged", icon: ClipboardCheck, iconColor: "green", trend: "HR 100%", trendDirection: "up" },
  { label: "Audits (Q2)", value: 6, subtitle: "completed this quarter", icon: Calendar, iconColor: "blue" },
  { label: "Avg Audit Score", value: "86", subtitle: "Finance 97 · Mfg 62", icon: Gauge, iconColor: "purple", trend: "wide spread", trendDirection: "down" },
];

export const governanceInsights: FeedInsight[] = [
  { id: "g1", timestamp: "14s ago", text: "Manufacturing fire exit blocked Floor 3 — overdue since Jul 5, owner R. Iyer" },
  { id: "g2", timestamp: "3m ago", text: "IT vendor data-sharing policy gap under review — due Jul 15 (S. Rao)" },
  { id: "g3", timestamp: "7m ago", text: "Operations fire safety certificate expired Jul 8 — 4 days overdue" },
  { id: "g4", timestamp: "12m ago", text: "Finance audit score 97 — strictest compliance; quarterly audit closed Jun 30" },
  { id: "g5", timestamp: "20m ago", text: "Transport driver safety audits pass consistently — score 91 despite fleet emissions" },
];

export const complianceIssueRows: ComplianceIssueRow[] = [
  { id: "ci1", issue: "Fire exit partially blocked, Floor 3", department: "Manufacturing", severity: "critical", owner: "R. Iyer", dueDate: "Jul 5", daysOverdue: 7, status: "critical" },
  { id: "ci2", issue: "Missing PPE compliance log", department: "Manufacturing", severity: "high", owner: "R. Iyer", dueDate: "Jul 10", daysOverdue: 0, status: "high" },
  { id: "ci3", issue: "Vendor data-sharing policy gap", department: "IT", severity: "medium", owner: "S. Rao", dueDate: "Jul 15", daysOverdue: 0, status: "medium" },
  { id: "ci4", issue: "Expired fire safety certificate", department: "Operations", severity: "high", owner: "K. Menon", dueDate: "Jul 8", daysOverdue: 4, status: "high" },
  { id: "ci5", issue: "Late quarterly financial audit", department: "Finance", severity: "low", owner: "Michael Brown", dueDate: "Jun 30", daysOverdue: 0, status: "good" },
];

export const gamificationKpis: KpiCardProps[] = [
  { label: "Total XP Issued", value: "24.8k", subtitle: "all time", icon: Zap, iconColor: "purple", trend: "↑ 1.2k", trendDirection: "up" },
  { label: "Active Challenges", value: 18, subtitle: "6 ending soon", icon: Trophy, iconColor: "amber" },
  { label: "Badges Unlocked", value: 47, subtitle: "this month", icon: Medal, iconColor: "teal", trend: "↑ 12", trendDirection: "up" },
  { label: "Rewards Redeemed", value: 23, subtitle: "this quarter", icon: Gift, iconColor: "green" },
  { label: "Leader", value: "HR", subtitle: "Emily Watson · 3,240 XP", icon: Crown, iconColor: "amber" },
  { label: "Avg Employee XP", value: 840, subtitle: "org-wide", icon: Users, iconColor: "blue", trend: "↑ 6%", trendDirection: "up" },
];

export const leaderboardRows = [
  { id: "lb1", rank: 1, name: "Emily Watson", department: "HR", xp: 3240 },
  { id: "lb2", rank: 2, name: "R. Iyer", department: "Manufacturing", xp: 2890 },
  { id: "lb3", rank: 3, name: "Michael Brown", department: "Finance", xp: 2650 },
  { id: "lb4", rank: 4, name: "K. Menon", department: "Operations", xp: 2410 },
  { id: "lb5", rank: 5, name: "David Wilson", department: "Transport", xp: 2180 },
];

export const gamificationInsights: FeedInsight[] = [
  { id: "gm1", timestamp: "30s ago", text: "Manufacturing unlocked Green Warrior badge — strong CSR despite environmental watch status" },
  { id: "gm2", timestamp: "2m ago", text: "Finance redeemed Coffee Coupon — consider CSR-friendly rewards during close season" },
  { id: "gm3", timestamp: "5m ago", text: "No Plastic Week challenge 72% complete — 84 participants across 4 departments" },
];

export interface CsrActivityRow {
  id: string;
  activity: string;
  department: string;
  participants: number;
  proofStatus: PillTone;
  approval: PillTone;
  points: number;
  status: PillTone;
}

export interface ComplianceIssueRow {
  id: string;
  issue: string;
  department: string;
  severity: PillTone;
  owner: string;
  dueDate: string;
  daysOverdue: number;
  status: PillTone;
}

export interface ChallengeRow {
  id: string;
  title: string;
  category: string;
  xp: number;
  difficulty: PillTone;
  status: PillTone;
  participants: number;
}

export const challengeRows: ChallengeRow[] = [
  { id: "ch1", title: "No Plastic Week", category: "Reduce Plastic Usage", xp: 250, difficulty: "medium", status: "good", participants: 84 },
  { id: "ch2", title: "Cycle to Work Challenge", category: "Cycle to Work", xp: 350, difficulty: "high", status: "good", participants: 42 },
  { id: "ch3", title: "Paperless Office", category: "Paperless Office", xp: 150, difficulty: "low", status: "excellent", participants: 120 },
  { id: "ch4", title: "Energy Saver", category: "Energy Saving", xp: 220, difficulty: "medium", status: "medium", participants: 56 },
  { id: "ch5", title: "Water Conservation", category: "Water Conservation", xp: 180, difficulty: "low", status: "good", participants: 38 },
];

export const badgeItems = [
  { id: "b1", name: "Eco Starter", unlocked: true, xp: 100 },
  { id: "b2", name: "Green Warrior", unlocked: true, xp: 500 },
  { id: "b3", name: "Sustainability Champion", unlocked: true, xp: 1000 },
  { id: "b4", name: "Carbon Hero", unlocked: false, xp: 2000 },
  { id: "b5", name: "CSR Legend", unlocked: false, xp: 3000 },
];

export const commandCenterInsights: FeedInsight[] = liveInsightsSeed.map(i => ({
  id: i.id,
  timestamp: i.t,
  text: i.text,
}));

export const esgHeatmapZones: HeatmapZone[] = heatmapZones.map(z => ({
  id: z.district.toLowerCase(),
  label: z.district,
  lat: z.lat,
  lng: z.lng,
  value: z.risk,
  severity:
    z.risk > 85 ? "critical" : z.risk > 70 ? "high" : z.risk > 50 ? "medium" : "low",
  tooltip: `<b>${z.district}</b><br/>ESG exposure score: ${z.risk}`,
}));
