import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  authenticateEcoUser,
  getEcoSession,
  getHomeRouteForRole,
  getPortalAccounts,
  setEcoSession,
  type EcoSessionUser,
  type PortalLoginAccount,
  type PortalRole,
} from "@/lib/ecosphere-auth";
import {
  loadEcoAdminConfig,
  saveEcoAdminConfig,
  resetEcoAdminConfig,
  type EcoAdminConfig,
} from "@/lib/ecosphere-config-store";

interface EcoAuthContextValue {
  user: EcoSessionUser | null;
  isSuperAdmin: boolean;
  isEsgManager: boolean;
  isDepartmentManager: boolean;
  config: EcoAdminConfig;
  login: (email: string, password: string, role: PortalRole) => EcoSessionUser | null;
  logout: () => void;
  getAccountsForRole: (role: PortalRole) => PortalLoginAccount[];
  getHomeRoute: () => string;
  updateConfig: (patch: Partial<EcoAdminConfig> | ((prev: EcoAdminConfig) => EcoAdminConfig)) => void;
  resetConfig: () => void;
  ready: boolean;
}

const EcoAuthContext = createContext<EcoAuthContextValue | null>(null);

export function EcoAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<EcoSessionUser | null>(null);
  const [config, setConfig] = useState<EcoAdminConfig>(() => loadEcoAdminConfig());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUser(getEcoSession());
    setConfig(loadEcoAdminConfig());
    setReady(true);
  }, []);

  const login = useCallback(
    (email: string, password: string, role: PortalRole) => {
      const session = authenticateEcoUser(email, password, role, config);
      if (!session) return null;
      setEcoSession(session);
      setUser(session);
      return session;
    },
    [config],
  );

  const getAccountsForRole = useCallback(
    (role: PortalRole) => getPortalAccounts(config, role),
    [config],
  );

  const getHomeRoute = useCallback(
    () => (user ? getHomeRouteForRole(user.role) : "/ecosphere/login"),
    [user],
  );

  const logout = useCallback(() => {
    setEcoSession(null);
    setUser(null);
  }, []);

  const updateConfig = useCallback(
    (patch: Partial<EcoAdminConfig> | ((prev: EcoAdminConfig) => EcoAdminConfig)) => {
      setConfig(prev => {
        const next = typeof patch === "function" ? patch(prev) : { ...prev, ...patch };
        saveEcoAdminConfig(next);
        return next;
      });
    },
    [],
  );

  const resetConfig = useCallback(() => {
    resetEcoAdminConfig();
    setConfig(loadEcoAdminConfig());
  }, []);

  const value = useMemo(
    () => ({
      user,
      isSuperAdmin: user?.role === "SUPER_ADMIN",
      isEsgManager: user?.role === "ESG_MANAGER",
      isDepartmentManager: user?.role === "DEPARTMENT_MANAGER",
      config,
      login,
      logout,
      getAccountsForRole,
      getHomeRoute,
      updateConfig,
      resetConfig,
      ready,
    }),
    [user, config, login, logout, getAccountsForRole, getHomeRoute, updateConfig, resetConfig, ready],
  );

  return <EcoAuthContext.Provider value={value}>{children}</EcoAuthContext.Provider>;
}

export function useEcoAuth() {
  const ctx = useContext(EcoAuthContext);
  if (!ctx) throw new Error("useEcoAuth must be used within EcoAuthProvider");
  return ctx;
}
