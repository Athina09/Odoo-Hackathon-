import {
  ecoSphereMockData,
  type EcoSphereMockData,
  type EcoEmployee,
  type RoleAssignments,
  type NotificationSettings,
} from "@/data/ecosphere-mock";

const CONFIG_KEY = "ecosphere-admin-config";

export interface EcoAdminConfig extends EcoSphereMockData {
  employees: EcoEmployee[];
  roleAssignments: RoleAssignments;
  notificationSettings: NotificationSettings;
}

const defaultEmployees: EcoEmployee[] = [
  { id: "EMP001", name: "John Carter", email: "john.carter@ecosphere.in", departmentId: "DEP001", role: "DEPARTMENT_MANAGER" },
  { id: "EMP002", name: "Emily Watson", email: "emily.watson@ecosphere.in", departmentId: "DEP002", role: "DEPARTMENT_MANAGER" },
  { id: "EMP003", name: "Michael Brown", email: "michael.brown@ecosphere.in", departmentId: "DEP003", role: "DEPARTMENT_MANAGER" },
  { id: "EMP004", name: "Alex Morgan", email: "alex.morgan@ecosphere.in", departmentId: "DEP007", role: "ESG_MANAGER" },
  { id: "EMP005", name: "Sarah Johnson", email: "sarah.j@ecosphere.in", departmentId: "DEP006", role: "EMPLOYEE" },
  { id: "EMP006", name: "David Wilson", email: "david.w@ecosphere.in", departmentId: "DEP005", role: "EMPLOYEE" },
];

const defaultRoleAssignments: RoleAssignments = {
  esgManagers: [{ employeeId: "EMP004", name: "Alex Morgan" }],
  departmentManagers: [
    { departmentId: "DEP001", employeeId: "EMP001", name: "John Carter" },
    { departmentId: "DEP002", employeeId: "EMP002", name: "Emily Watson" },
    { departmentId: "DEP003", employeeId: "EMP003", name: "Michael Brown" },
  ],
};

const defaultNotificationSettings: NotificationSettings = {
  emailDigest: true,
  realtimeAlerts: true,
  enabledTypes: [
    "CSR Approved",
    "Challenge Approved",
    "Badge Unlocked",
    "Compliance Issue Assigned",
    "Audit Scheduled",
  ],
};

export function getDefaultEcoAdminConfig(): EcoAdminConfig {
  return {
    ...structuredClone(ecoSphereMockData),
    employees: defaultEmployees,
    roleAssignments: defaultRoleAssignments,
    notificationSettings: defaultNotificationSettings,
  };
}

export function loadEcoAdminConfig(): EcoAdminConfig {
  if (typeof window === "undefined") return getDefaultEcoAdminConfig();
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (!raw) return getDefaultEcoAdminConfig();
    return { ...getDefaultEcoAdminConfig(), ...JSON.parse(raw) } as EcoAdminConfig;
  } catch {
    return getDefaultEcoAdminConfig();
  }
}

export function saveEcoAdminConfig(config: EcoAdminConfig) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
}

export function resetEcoAdminConfig() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CONFIG_KEY);
}
