/** EcoSphere organization & platform mock data (Odoo Hackathon) */

export interface EcoOrganization {
  name: string;
  environmentalWeight: number;
  socialWeight: number;
  governanceWeight: number;
}

export interface EcoDepartment {
  id: string;
  name: string;
  head: string;
  employeeCount: number;
}

export interface EmissionFactor {
  name: string;
  unit: string;
  factor: string;
}

export interface SustainabilityGoal {
  title: string;
  target: string;
  deadline: string;
}

export interface CsrActivity {
  title: string;
  location: string;
  xp: number;
}

export interface SustainabilityChallenge {
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  xp: number;
}

export interface EcoBadge {
  name: string;
  xpRequired: number;
}

export interface EcoReward {
  name: string;
  points: number;
}

export type EcoRole = "SUPER_ADMIN" | "ESG_MANAGER" | "DEPARTMENT_MANAGER" | "EMPLOYEE";

export interface EcoEmployee {
  id: string;
  name: string;
  email: string;
  departmentId: string;
  role: EcoRole;
}

export interface RoleAssignments {
  esgManagers: { employeeId: string; name: string }[];
  departmentManagers: { departmentId: string; employeeId: string; name: string }[];
}

export interface NotificationSettings {
  emailDigest: boolean;
  realtimeAlerts: boolean;
  enabledTypes: string[];
}

export type EsgStatusLabel =
  | "Excellent"
  | "Good"
  | "Average"
  | "Needs Improvement"
  | "Critical";

export interface EcoSphereMockData {
  organization: EcoOrganization;
  departments: EcoDepartment[];
  emissionFactors: EmissionFactor[];
  sustainabilityGoals: SustainabilityGoal[];
  csrCategories: string[];
  challengeCategories: string[];
  csrActivities: CsrActivity[];
  challenges: SustainabilityChallenge[];
  badges: EcoBadge[];
  rewards: EcoReward[];
  policies: string[];
  audits: string[];
  complianceIssueTypes: string[];
  notificationTypes: string[];
  aiInsightTypes: string[];
  roles: EcoRole[];
  esgStatus: EsgStatusLabel[];
}

export const ecoSphereMockData: EcoSphereMockData = {
  organization: {
    name: "EcoSphere Industries Pvt. Ltd.",
    environmentalWeight: 40,
    socialWeight: 30,
    governanceWeight: 30,
  },

  departments: [
    { id: "DEP001", name: "Manufacturing", head: "John Carter", employeeCount: 42 },
    { id: "DEP002", name: "Human Resources", head: "Emily Watson", employeeCount: 18 },
    { id: "DEP003", name: "Finance", head: "Michael Brown", employeeCount: 15 },
    { id: "DEP004", name: "Operations", head: "Sophia Davis", employeeCount: 30 },
    { id: "DEP005", name: "Fleet & Logistics", head: "David Wilson", employeeCount: 25 },
    { id: "DEP006", name: "Sales & Marketing", head: "Sarah Johnson", employeeCount: 28 },
    { id: "DEP007", name: "IT", head: "Alex Morgan", employeeCount: 20 },
  ],

  emissionFactors: [
    { name: "Diesel", unit: "Liter", factor: "2.68 kg CO₂/L" },
    { name: "Petrol", unit: "Liter", factor: "2.31 kg CO₂/L" },
    { name: "Electricity", unit: "kWh", factor: "0.82 kg CO₂/kWh" },
    { name: "Natural Gas", unit: "m³", factor: "1.90 kg CO₂/m³" },
    { name: "Business Flight", unit: "km", factor: "0.15 kg CO₂/km" },
  ],

  sustainabilityGoals: [
    { title: "Reduce Carbon Emissions", target: "20%", deadline: "31 Dec 2026" },
    { title: "Increase CSR Participation", target: "85%", deadline: "31 Dec 2026" },
    { title: "100% Policy Compliance", target: "100%", deadline: "30 Sep 2026" },
  ],

  csrCategories: [
    "Tree Plantation",
    "Blood Donation",
    "Beach Cleanup",
    "Food Donation",
    "Women Empowerment",
    "Animal Welfare",
    "Community Service",
    "Education Support",
  ],

  challengeCategories: [
    "Reduce Plastic Usage",
    "Cycle to Work",
    "Public Transport Week",
    "Paperless Office",
    "Energy Saving",
    "Water Conservation",
    "Waste Segregation",
  ],

  csrActivities: [
    { title: "Tree Plantation Drive", location: "City Park", xp: 150 },
    { title: "Beach Cleanup Campaign", location: "Ocean Beach", xp: 200 },
    { title: "Blood Donation Camp", location: "Community Hall", xp: 180 },
    { title: "Food Distribution", location: "NGO Center", xp: 170 },
  ],

  challenges: [
    { title: "No Plastic Week", difficulty: "Medium", xp: 250 },
    { title: "Cycle to Work Challenge", difficulty: "Hard", xp: 350 },
    { title: "Paperless Office", difficulty: "Easy", xp: 150 },
    { title: "Energy Saver", difficulty: "Medium", xp: 220 },
  ],

  badges: [
    { name: "Eco Starter", xpRequired: 100 },
    { name: "Green Warrior", xpRequired: 500 },
    { name: "Sustainability Champion", xpRequired: 1000 },
    { name: "Carbon Hero", xpRequired: 2000 },
    { name: "CSR Legend", xpRequired: 3000 },
  ],

  rewards: [
    { name: "Coffee Coupon", points: 500 },
    { name: "Movie Ticket", points: 1000 },
    { name: "Amazon Gift Card", points: 2000 },
    { name: "Wireless Earbuds", points: 5000 },
    { name: "Extra Leave Day", points: 3000 },
  ],

  policies: [
    "Code of Conduct",
    "Environmental Policy",
    "Data Privacy Policy",
    "Cyber Security Policy",
    "Workplace Safety Policy",
    "Waste Management Policy",
    "Anti-Harassment Policy",
  ],

  audits: [
    "Environmental Audit",
    "Safety Audit",
    "Energy Audit",
    "Internal Compliance Audit",
    "Waste Management Audit",
  ],

  complianceIssueTypes: [
    "High Carbon Emission",
    "Waste Disposal Violation",
    "Policy Not Acknowledged",
    "Energy Consumption Exceeded",
    "CSR Participation Below Target",
    "Late Audit Submission",
  ],

  notificationTypes: [
    "CSR Approved",
    "Challenge Approved",
    "Badge Unlocked",
    "Reward Redeemed",
    "New CSR Activity",
    "New Sustainability Challenge",
    "Policy Reminder",
    "Compliance Issue Assigned",
    "Audit Scheduled",
  ],

  aiInsightTypes: [
    "Carbon Hotspot Detection",
    "Department ESG Heatmap",
    "Monthly ESG Summary",
    "Carbon Trend Analysis",
    "Department Risk Analysis",
    "Sustainability Recommendation",
    "ESG Forecast",
    "Executive Summary",
  ],

  roles: ["SUPER_ADMIN", "ESG_MANAGER", "DEPARTMENT_MANAGER", "EMPLOYEE"],

  esgStatus: ["Excellent", "Good", "Average", "Needs Improvement", "Critical"],
};

/** Convenience re-exports */
export const organization = ecoSphereMockData.organization;
export const orgDepartments = ecoSphereMockData.departments;
export const emissionFactors = ecoSphereMockData.emissionFactors;
export const sustainabilityGoals = ecoSphereMockData.sustainabilityGoals;
export const csrCategories = ecoSphereMockData.csrCategories;
export const challengeCategories = ecoSphereMockData.challengeCategories;
export const csrActivities = ecoSphereMockData.csrActivities;
export const sustainabilityChallenges = ecoSphereMockData.challenges;
export const ecoBadges = ecoSphereMockData.badges;
export const ecoRewards = ecoSphereMockData.rewards;
export const ecoPolicies = ecoSphereMockData.policies;
export const ecoAudits = ecoSphereMockData.audits;
export const complianceIssueTypes = ecoSphereMockData.complianceIssueTypes;
export const notificationTypes = ecoSphereMockData.notificationTypes;
export const aiInsightTypes = ecoSphereMockData.aiInsightTypes;
export const ecoRoles = ecoSphereMockData.roles;
export const esgStatusLabels = ecoSphereMockData.esgStatus;
