import type { EcoAdminConfig } from "@/lib/ecosphere-config-store";

const STORE_KEY = "ecosphere-employee-data";

export type SubmissionStatus = "in_progress" | "pending_review" | "approved" | "rejected";

export interface ChallengeEnrollment {
  id: string;
  challengeId: string;
  title: string;
  category: string;
  xpReward: number;
  difficulty: string;
  deadline: string;
  evidenceRequired: boolean;
  status: SubmissionStatus;
  progress: number;
  progressTarget: number;
  evidenceUrl?: string;
  submittedAt?: string;
  approvedAt?: string;
}

export interface CsrRegistration {
  id: string;
  activityId: string;
  title: string;
  location: string;
  date: string;
  points: number;
  status: SubmissionStatus;
  proofUrl?: string;
  submittedAt?: string;
  approvedAt?: string;
}

export interface RewardRedemption {
  id: string;
  rewardId: string;
  rewardName: string;
  pointsCost: number;
  redeemedAt: string;
}

export interface EmployeeGamificationState {
  employeeId: string;
  xp: number;
  points: number;
  badges: string[];
  challenges: ChallengeEnrollment[];
  csrActivities: CsrRegistration[];
  redemptions: RewardRedemption[];
  rank: number;
}

const defaultChallenges: Omit<ChallengeEnrollment, "id" | "status" | "progress">[] = [
  {
    challengeId: "ch-cycle",
    title: "Cycle to Office 5 Times",
    category: "Cycle to Work",
    xpReward: 250,
    difficulty: "Medium",
    deadline: "Jul 31",
    evidenceRequired: true,
    progressTarget: 5,
  },
  {
    challengeId: "ch-plastic",
    title: "No Plastic Week",
    category: "Reduce Plastic Usage",
    xpReward: 200,
    difficulty: "Easy",
    deadline: "Jul 20",
    evidenceRequired: true,
    progressTarget: 7,
  },
  {
    challengeId: "ch-energy",
    title: "Energy Saving Sprint",
    category: "Energy Saving",
    xpReward: 180,
    difficulty: "Easy",
    deadline: "Aug 5",
    evidenceRequired: false,
    progressTarget: 10,
  },
];

const defaultCsr: Omit<CsrRegistration, "id" | "status">[] = [
  {
    activityId: "csr-tree",
    title: "Tree Plantation Drive",
    location: "City Park",
    date: "Jul 18",
    points: 150,
  },
  {
    activityId: "csr-blood",
    title: "Blood Donation Camp",
    location: "Community Hall",
    date: "Jul 25",
    points: 180,
  },
  {
    activityId: "csr-beach",
    title: "Beach Cleanup Campaign",
    location: "Marina Beach",
    date: "Aug 2",
    points: 200,
  },
];

function defaultState(employeeId: string): EmployeeGamificationState {
  return {
    employeeId,
    xp: 1240,
    points: 680,
    badges: ["eco-starter"],
    challenges: [],
    csrActivities: [],
    redemptions: [],
    rank: 12,
  };
}

export function loadEmployeeState(employeeId: string): EmployeeGamificationState {
  if (typeof window === "undefined") return defaultState(employeeId);
  try {
    const raw = localStorage.getItem(STORE_KEY);
    const all = raw ? (JSON.parse(raw) as Record<string, EmployeeGamificationState>) : {};
    return all[employeeId] ?? defaultState(employeeId);
  } catch {
    return defaultState(employeeId);
  }
}

export function saveEmployeeState(state: EmployeeGamificationState) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(STORE_KEY);
    const all = raw ? (JSON.parse(raw) as Record<string, EmployeeGamificationState>) : {};
    all[state.employeeId] = state;
    localStorage.setItem(STORE_KEY, JSON.stringify(all));
  } catch {
    /* ignore */
  }
}

export function getActiveChallengesCatalog() {
  return defaultChallenges;
}

export function getActiveCsrCatalog() {
  return defaultCsr;
}

export function joinChallenge(state: EmployeeGamificationState, challengeId: string): EmployeeGamificationState {
  const catalog = defaultChallenges.find(c => c.challengeId === challengeId);
  if (!catalog) return state;
  if (state.challenges.some(c => c.challengeId === challengeId)) return state;
  const enrollment: ChallengeEnrollment = {
    ...catalog,
    id: `enr-${challengeId}-${Date.now()}`,
    status: "in_progress",
    progress: 0,
  };
  return { ...state, challenges: [...state.challenges, enrollment] };
}

export function updateChallengeProgress(
  state: EmployeeGamificationState,
  enrollmentId: string,
  progress: number,
): EmployeeGamificationState {
  return {
    ...state,
    challenges: state.challenges.map(c =>
      c.id === enrollmentId ? { ...c, progress: Math.min(progress, c.progressTarget) } : c,
    ),
  };
}

export function attachChallengeEvidence(
  state: EmployeeGamificationState,
  enrollmentId: string,
  evidenceUrl: string,
): EmployeeGamificationState {
  return {
    ...state,
    challenges: state.challenges.map(c => {
      if (c.id !== enrollmentId) return c;
      const progress = Math.min(c.progress + 1, c.progressTarget);
      return { ...c, evidenceUrl, progress };
    }),
  };
}

export function canSubmitChallenge(enrollment: ChallengeEnrollment): boolean {
  if (enrollment.status !== "in_progress") return false;
  if (enrollment.evidenceRequired) return Boolean(enrollment.evidenceUrl);
  return enrollment.progress >= enrollment.progressTarget;
}

export function submitChallenge(
  state: EmployeeGamificationState,
  enrollmentId: string,
  evidenceUrl?: string,
): EmployeeGamificationState {
  return {
    ...state,
    challenges: state.challenges.map(c => {
      if (c.id !== enrollmentId) return c;
      if (c.evidenceRequired && !evidenceUrl) return c;
      return {
        ...c,
        status: "pending_review" as const,
        evidenceUrl,
        submittedAt: new Date().toISOString(),
      };
    }),
  };
}

export function registerCsr(state: EmployeeGamificationState, activityId: string): EmployeeGamificationState {
  const catalog = defaultCsr.find(a => a.activityId === activityId);
  if (!catalog) return state;
  if (state.csrActivities.some(a => a.activityId === activityId)) return state;
  return {
    ...state,
    csrActivities: [
      ...state.csrActivities,
      { ...catalog, id: `csr-${activityId}-${Date.now()}`, status: "in_progress" },
    ],
  };
}

export function submitCsrProof(
  state: EmployeeGamificationState,
  registrationId: string,
  proofUrl: string,
): EmployeeGamificationState {
  return {
    ...state,
    csrActivities: state.csrActivities.map(a =>
      a.id === registrationId
        ? { ...a, status: "pending_review" as const, proofUrl, submittedAt: new Date().toISOString() }
        : a,
    ),
  };
}

export function approveChallengeSubmission(
  state: EmployeeGamificationState,
  enrollmentId: string,
): EmployeeGamificationState {
  const enrollment = state.challenges.find(c => c.id === enrollmentId);
  if (!enrollment || enrollment.status !== "pending_review") return state;
  const newXp = state.xp + enrollment.xpReward;
  const newBadges = [...state.badges];
  if (newXp >= 1500 && !newBadges.includes("green-champion")) {
    newBadges.push("green-champion");
  }
  return {
    ...state,
    xp: newXp,
    points: state.points + Math.round(enrollment.xpReward * 0.5),
    badges: newBadges,
    rank: Math.max(1, state.rank - 1),
    challenges: state.challenges.map(c =>
      c.id === enrollmentId
        ? { ...c, status: "approved" as const, approvedAt: new Date().toISOString() }
        : c,
    ),
  };
}

export function approveCsrSubmission(
  state: EmployeeGamificationState,
  registrationId: string,
): EmployeeGamificationState {
  const reg = state.csrActivities.find(a => a.id === registrationId);
  if (!reg || reg.status !== "pending_review") return state;
  const newXp = state.xp + reg.points;
  return {
    ...state,
    xp: newXp,
    points: state.points + reg.points,
    csrActivities: state.csrActivities.map(a =>
      a.id === registrationId
        ? { ...a, status: "approved" as const, approvedAt: new Date().toISOString() }
        : a,
    ),
  };
}

export function redeemReward(
  state: EmployeeGamificationState,
  rewardId: string,
  rewardName: string,
  pointsCost: number,
  stock: number,
): { state: EmployeeGamificationState; ok: boolean; message: string } {
  if (stock <= 0) return { state, ok: false, message: "Out of stock" };
  if (state.points < pointsCost) return { state, ok: false, message: "Not enough points" };
  const redemption: RewardRedemption = {
    id: `rdm-${Date.now()}`,
    rewardId,
    rewardName,
    pointsCost,
    redeemedAt: new Date().toISOString(),
  };
  return {
    ok: true,
    message: "Redeemed",
    state: {
      ...state,
      points: state.points - pointsCost,
      redemptions: [...state.redemptions, redemption],
    },
  };
}

/** Pending submissions across all employees — for manager approval queues */
export function getAllPendingSubmissions(config: EcoAdminConfig) {
  if (typeof window === "undefined") return { challenges: [], csr: [] };
  try {
    const raw = localStorage.getItem(STORE_KEY);
    const all = raw ? (JSON.parse(raw) as Record<string, EmployeeGamificationState>) : {};
    const challenges: (ChallengeEnrollment & { employeeId: string; employeeName: string; departmentId: string })[] = [];
    const csr: (CsrRegistration & { employeeId: string; employeeName: string; departmentId: string })[] = [];

    for (const [employeeId, state] of Object.entries(all)) {
      const emp = config.employees.find(e => e.id === employeeId);
      if (!emp) continue;
      for (const c of state.challenges.filter(x => x.status === "pending_review")) {
        challenges.push({
          ...c,
          employeeId,
          employeeName: emp.name,
          departmentId: emp.departmentId,
        });
      }
      for (const a of state.csrActivities.filter(x => x.status === "pending_review")) {
        csr.push({
          ...a,
          employeeId,
          employeeName: emp.name,
          departmentId: emp.departmentId,
        });
      }
    }
    return { challenges, csr };
  } catch {
    return { challenges: [], csr: [] };
  }
}

export function approveSubmissionForEmployee(
  employeeId: string,
  type: "challenge" | "csr",
  submissionId: string,
): void {
  const state = loadEmployeeState(employeeId);
  const next =
    type === "challenge"
      ? approveChallengeSubmission(state, submissionId)
      : approveCsrSubmission(state, submissionId);
  saveEmployeeState(next);
}

export const BADGE_RULES = [
  { id: "eco-starter", name: "Eco Starter", xpRequired: 0 },
  { id: "green-champion", name: "Green Champion", xpRequired: 1500 },
  { id: "planet-guardian", name: "Planet Guardian", xpRequired: 3000 },
];

export function nextBadgeProgress(xp: number) {
  const next = BADGE_RULES.find(b => xp < b.xpRequired) ?? BADGE_RULES[BADGE_RULES.length - 1];
  const prev = BADGE_RULES.filter(b => b.xpRequired <= xp).pop() ?? BADGE_RULES[0];
  const range = next.xpRequired - prev.xpRequired;
  const progress = range > 0 ? ((xp - prev.xpRequired) / range) * 100 : 100;
  return { next, progress: Math.min(100, Math.max(0, progress)) };
}
