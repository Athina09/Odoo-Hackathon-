import type { EcoRole } from "@/data/ecosphere-mock";
import { regressionConfidence } from "@/lib/digital-twin-prediction";

const ROLE_BASE_CONFIDENCE: Record<EcoRole, number> = {
  SUPER_ADMIN: 96,
  ESG_MANAGER: 94,
  DEPARTMENT_MANAGER: 91,
  EMPLOYEE: 88,
};

export function aiConfidenceForRole(role: EcoRole | undefined): number {
  if (!role) return 90;
  return ROLE_BASE_CONFIDENCE[role] ?? 90;
}

export function zoneAiConfidence(sparkline?: number[]): number {
  if (!sparkline?.length) return 82;
  return regressionConfidence(sparkline);
}

export function blendConfidence(base: number, zoneConfidences: number[]): number {
  if (zoneConfidences.length === 0) return base;
  const avg = zoneConfidences.reduce((a, b) => a + b, 0) / zoneConfidences.length;
  return Math.round(base * 0.35 + avg * 0.65);
}
