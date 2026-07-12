import type { EcoSessionUser } from "@/lib/ecosphere-auth";
import type { EmployeeGamificationState } from "@/lib/ecosphere-employee-store";
import {
  DEPARTMENT_FACILITY_MAP,
  getFacilityById,
  getFacilityEnergyHistory,
  getZonesForFacility,
  type DigitalTwinFacility,
  type DigitalTwinZone,
} from "@/data/digital-twin";
import { zoneEnergyDeltaPct } from "@/lib/digital-twin-blueprint";

export interface EmployeePersonalImpact {
  challengesCompleted: number;
  csrApproved: number;
  energySavedKwh: number;
  co2AvoidedKg: number;
  treesEquivalent: number;
  participationScore: number;
}

export interface FacilityEnergySnapshot {
  facility: DigitalTwinFacility;
  zones: DigitalTwinZone[];
  totalDrawKwh: number;
  totalBaselineKwh: number;
  facilityReductionKwh: number;
  facilityReductionPct: number;
  solarSupplyKwh: number;
  gridSupplyKwh: number;
  employeeAttributedKwh: number;
  employeeSharePct: number;
  netCo2Tonnes: number;
  energyHistory14d: number[];
  historyReductionPct: number;
}

export interface EmployeeImpactViewModel {
  personal: EmployeePersonalImpact;
  facility: FacilityEnergySnapshot;
  impactItems: Array<{
    id: string;
    title: string;
    detail: string;
    kwh: number;
    icon: "challenge" | "csr" | "badge";
  }>;
}

function facilityIdForUser(user: EcoSessionUser | null): string {
  if (!user) return "FAC001";
  if (user.factoryId) return user.factoryId;
  if (user.departmentId && DEPARTMENT_FACILITY_MAP[user.departmentId]) {
    return DEPARTMENT_FACILITY_MAP[user.departmentId];
  }
  return "FAC002";
}

export function computePersonalImpact(state: EmployeeGamificationState): EmployeePersonalImpact {
  const challengesCompleted = state.challenges.filter(c => c.status === "approved").length;
  const challengesInFlight = state.challenges.filter(
    c => c.status === "in_progress" || c.status === "pending_review",
  ).length;
  const csrApproved = state.csrActivities.filter(a => a.status === "approved").length;
  const csrPending = state.csrActivities.filter(a => a.status === "pending_review").length;

  const energySavedKwh = Math.round(
    challengesCompleted * 28 +
      challengesInFlight * 6 +
      csrApproved * 45 +
      csrPending * 12 +
      state.badges.length * 18 +
      Math.floor(state.xp / 100),
  );

  const co2AvoidedKg = Math.round(energySavedKwh * 0.49);
  const treesEquivalent = Math.max(1, Math.round(co2AvoidedKg / 21));

  return {
    challengesCompleted,
    csrApproved,
    energySavedKwh,
    co2AvoidedKg,
    treesEquivalent,
    participationScore: Math.min(100, Math.round((state.xp / 2000) * 100)),
  };
}

export function computeFacilityEnergy(
  facilityId: string,
  employeeEnergyKwh: number,
): FacilityEnergySnapshot | null {
  const facility = getFacilityById(facilityId);
  if (!facility) return null;

  const zones = getZonesForFacility(facilityId);
  const totalDrawKwh = zones.reduce((s, z) => s + Math.max(0, z.energyKwh), 0);
  const totalBaselineKwh = zones.reduce((s, z) => s + Math.max(0, z.energyBaselineKwh), 0);
  const facilityReductionKwh = Math.max(0, totalBaselineKwh - totalDrawKwh);
  const facilityReductionPct =
    totalBaselineKwh > 0 ? Math.round((facilityReductionKwh / totalBaselineKwh) * 100) : 0;

  const solarSupplyKwh = facility.solarOffsetKwh;
  const gridSupplyKwh = Math.max(0, totalDrawKwh - solarSupplyKwh);
  const employeeAttributedKwh = Math.min(employeeEnergyKwh, facilityReductionKwh);
  const employeeSharePct =
    facilityReductionKwh > 0
      ? Math.round((employeeAttributedKwh / facilityReductionKwh) * 100)
      : 0;

  const grossCo2 = zones.reduce((s, z) => s + Math.max(0, z.co2Kg), 0);
  const netCo2Tonnes = (grossCo2 - solarSupplyKwh * 0.49) / 1000;

  const energyHistory14d = getFacilityEnergyHistory(facilityId);
  const first = energyHistory14d[0] ?? totalDrawKwh;
  const last = energyHistory14d[energyHistory14d.length - 1] ?? totalDrawKwh;
  const historyReductionPct = first > 0 ? Math.round(((first - last) / first) * 100) : 0;

  return {
    facility,
    zones,
    totalDrawKwh,
    totalBaselineKwh,
    facilityReductionKwh,
    facilityReductionPct,
    solarSupplyKwh,
    gridSupplyKwh,
    employeeAttributedKwh,
    employeeSharePct,
    netCo2Tonnes,
    energyHistory14d,
    historyReductionPct,
  };
}

export function buildEmployeeImpactView(
  user: EcoSessionUser | null,
  state: EmployeeGamificationState,
): EmployeeImpactViewModel {
  const personal = computePersonalImpact(state);
  const facilityId = facilityIdForUser(user);
  const facility =
    computeFacilityEnergy(facilityId, personal.energySavedKwh) ??
    computeFacilityEnergy("FAC001", personal.energySavedKwh)!;

  const impactItems: EmployeeImpactViewModel["impactItems"] = [];

  state.challenges
    .filter(c => c.status === "approved" || c.status === "pending_review")
    .forEach(c => {
      impactItems.push({
        id: c.id,
        title: c.title,
        detail: c.status === "approved" ? "Challenge completed" : "Awaiting approval",
        kwh: c.status === "approved" ? 28 : 6,
        icon: "challenge",
      });
    });

  state.csrActivities
    .filter(a => a.status === "approved" || a.status === "pending_review")
    .forEach(a => {
      impactItems.push({
        id: a.id,
        title: a.title,
        detail: a.status === "approved" ? "CSR approved" : "Proof submitted",
        kwh: a.status === "approved" ? 45 : 12,
        icon: "csr",
      });
    });

  state.badges.forEach((badgeId, i) => {
    impactItems.push({
      id: `badge-${badgeId}-${i}`,
      title: badgeId.replace(/-/g, " "),
      detail: "Sustainability badge earned",
      kwh: 18,
      icon: "badge",
    });
  });

  return { personal, facility, impactItems };
}

export function zoneReductionLabel(zone: DigitalTwinZone) {
  const delta = zoneEnergyDeltaPct(zone.energyKwh, zone.energyBaselineKwh);
  if (delta < 0) return { text: `${Math.abs(delta)}% below baseline`, good: true };
  if (delta > 0) return { text: `${delta}% above baseline`, good: false };
  return { text: "On baseline", good: true };
}

export interface EmployeeChartData {
  esgRadar: Array<{ axis: string; score: number }>;
  energyTrend: Array<{ label: string; kwh: number; yours: number }>;
  contributionMix: Array<{ name: string; value: number }>;
  zoneEnergy: Array<{ site: string; kwh: number }>;
  health: {
    score: number;
    label: string;
    risk: string;
    confidence: number;
    prediction: number;
  };
  recommendations: Array<{ id: string; title: string; impact: string; esgBoost: string }>;
}

export function buildEmployeeChartData(
  view: EmployeeImpactViewModel,
  state: EmployeeGamificationState,
): EmployeeChartData {
  const { personal, facility } = view;

  const esgRadar = [
    { axis: "Energy", score: Math.min(100, 40 + personal.participationScore * 0.5) },
    { axis: "CSR", score: Math.min(100, 35 + personal.csrApproved * 22) },
    { axis: "Challenges", score: Math.min(100, 30 + personal.challengesCompleted * 18) },
    { axis: "Badges", score: Math.min(100, 45 + state.badges.length * 12) },
    { axis: "Facility", score: Math.min(100, 50 + facility.facilityReductionPct) },
  ];

  const history = facility.energyHistory14d;
  const step = Math.max(1, Math.floor(history.length / 6));
  const energyTrend = history
    .filter((_, i) => i % step === 0 || i === history.length - 1)
    .slice(-6)
    .map((kwh, i) => ({
      label: `W${i + 1}`,
      kwh,
      yours: Math.round((personal.energySavedKwh / 6) * (0.7 + i * 0.05)),
    }));

  const contributionMix = [
    { name: "Challenges", value: personal.challengesCompleted || 1 },
    { name: "CSR", value: personal.csrApproved || 1 },
    { name: "Badges", value: state.badges.length || 1 },
  ];

  const zoneEnergy = facility.zones
    .slice()
    .sort((a, b) => b.energyKwh - a.energyKwh)
    .slice(0, 4)
    .map(z => ({
      site: z.name.length > 14 ? `${z.name.slice(0, 12)}…` : z.name,
      kwh: z.energyKwh,
    }));

  const healthScore = Math.min(
    99,
    Math.round(personal.participationScore * 0.55 + facility.employeeSharePct * 0.35 + 12),
  );
  const healthLabel =
    healthScore >= 85 ? "Excellent" : healthScore >= 70 ? "Good" : healthScore >= 55 ? "Growing" : "Starter";

  const recommendations: EmployeeChartData["recommendations"] = [];
  if (personal.challengesCompleted < 2) {
    recommendations.push({
      id: "join-challenge",
      title: "Complete your next green challenge",
      impact: `+${28} kWh saved`,
      esgBoost: "+120 XP",
    });
  }
  if (personal.csrApproved < 1) {
    recommendations.push({
      id: "csr",
      title: "Submit a CSR activity proof",
      impact: "Save 45 kWh",
      esgBoost: "+CSR score",
    });
  }
  if (facility.facilityReductionPct < 15) {
    recommendations.push({
      id: "hvac",
      title: `Help reduce load at ${facility.facility.name.split(" ")[0]}`,
      impact: "−8% zone energy",
      esgBoost: "+5 ESG",
    });
  }
  if (recommendations.length < 2) {
    recommendations.push({
      id: "badge",
      title: "Earn Green Champion badge",
      impact: `${Math.max(0, 2000 - state.xp)} XP to go`,
      esgBoost: "+18 kWh",
    });
  }

  return {
    esgRadar,
    energyTrend,
    contributionMix,
    zoneEnergy,
    health: {
      score: healthScore,
      label: healthLabel,
      risk: healthScore >= 70 ? "Low" : "Medium",
      confidence: Math.min(98, 72 + state.challenges.length * 4),
      prediction: Math.min(99, healthScore + 3),
    },
    recommendations: recommendations.slice(0, 2),
  };
}

export interface ImpactNarrative {
  id: string;
  headline: string;
  body: string;
}

export function buildImpactNarratives(
  user: EcoSessionUser | null,
  view: EmployeeImpactViewModel,
): ImpactNarrative[] {
  const { personal, facility, impactItems } = view;
  const firstName = user?.name?.split(" ")[0] ?? "You";
  const facilityName = facility.facility.name;
  const narratives: ImpactNarrative[] = [];

  narratives.push({
    id: "headline",
    headline: `${firstName}, here is the difference you made`,
    body:
      personal.energySavedKwh > 0
        ? `Your green actions saved an estimated ${personal.energySavedKwh.toLocaleString()} kWh and avoided ${personal.co2AvoidedKg.toLocaleString()} kg of CO₂ — about the same as ${personal.treesEquivalent} tree${personal.treesEquivalent === 1 ? "" : "s"} absorbing carbon for a year.`
        : "Join a challenge or CSR activity to start building a measurable impact story on your facility twin.",
  });

  if (facility.employeeAttributedKwh > 0) {
    narratives.push({
      id: "facility-share",
      headline: `Your share at ${facilityName}`,
      body: `You are linked to ${facility.employeeAttributedKwh.toLocaleString()} kWh of the ${facility.facilityReductionKwh.toLocaleString()} kWh total reduction here — that is ${facility.employeeSharePct}% of what the building saved versus baseline.`,
    });
  }

  const improvingZones = facility.zones
    .filter(z => z.energyKwh < z.energyBaselineKwh)
    .sort((a, b) => b.energyBaselineKwh - b.energyKwh - (a.energyBaselineKwh - a.energyKwh))
    .slice(0, 2);

  improvingZones.forEach(zone => {
    const saved = zone.energyBaselineKwh - zone.energyKwh;
    const label = zoneReductionLabel(zone);
    narratives.push({
      id: `zone-${zone.zoneId}`,
      headline: `${zone.name} · live on twin`,
      body: `This zone is drawing ${zone.energyKwh.toLocaleString()} kWh (${label.text}). Your participation helps hold ${saved > 0 ? `${saved.toLocaleString()} kWh` : "load"} below baseline alongside teams like ${zone.topContributor}.`,
    });
  });

  if (facility.solarSupplyKwh > 0) {
    narratives.push({
      id: "solar",
      headline: "Solar is covering part of your floor",
      body: `${facility.solarSupplyKwh.toLocaleString()} kWh came from on-site solar in the last 24 h. Every kWh you save lets that solar stretch further across zones like Network Ops and Solar Array.`,
    });
  }

  impactItems.slice(0, 3).forEach(item => {
    const verb =
      item.icon === "challenge"
        ? "Completing"
        : item.icon === "csr"
          ? "Your CSR work on"
          : "Earning";
    narratives.push({
      id: `action-${item.id}`,
      headline: item.title,
      body: `${verb} "${item.title}" ${item.detail.toLowerCase()} — credited with ~${item.kwh} kWh toward your personal impact.`,
    });
  });

  if (personal.challengesCompleted > 0 || personal.csrApproved > 0) {
    narratives.push({
      id: "period",
      headline: "This period in plain words",
      body: `You completed ${personal.challengesCompleted} challenge${personal.challengesCompleted === 1 ? "" : "s"} and ${personal.csrApproved} approved CSR activit${personal.csrApproved === 1 ? "y" : "ies"}. The live twin reflects that as lower draw and cleaner zones across ${facilityName}.`,
    });
  }

  return narratives.slice(0, 6);
}
