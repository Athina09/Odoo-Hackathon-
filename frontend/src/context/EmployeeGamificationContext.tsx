import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  loadEmployeeState,
  saveEmployeeState,
  type EmployeeGamificationState,
} from "@/lib/ecosphere-employee-store";

interface EmployeeGamificationContextValue {
  state: EmployeeGamificationState;
  refresh: () => void;
  update: (next: EmployeeGamificationState) => void;
  celebrating: boolean;
  triggerCelebration: () => void;
}

const EmployeeGamificationContext = createContext<EmployeeGamificationContextValue | null>(null);

export function EmployeeGamificationProvider({
  employeeId,
  children,
}: {
  employeeId: string;
  children: ReactNode;
}) {
  const [state, setState] = useState(() => loadEmployeeState(employeeId));
  const [celebrating, setCelebrating] = useState(false);

  useEffect(() => {
    setState(loadEmployeeState(employeeId));
  }, [employeeId]);

  const refresh = useCallback(() => {
    setState(loadEmployeeState(employeeId));
  }, [employeeId]);

  const update = useCallback(
    (next: EmployeeGamificationState) => {
      saveEmployeeState(next);
      setState(next);
    },
    [],
  );

  const triggerCelebration = useCallback(() => {
    setCelebrating(true);
    window.setTimeout(() => setCelebrating(false), 2400);
  }, []);

  const value = useMemo(
    () => ({ state, refresh, update, celebrating, triggerCelebration }),
    [state, refresh, update, celebrating, triggerCelebration],
  );

  return (
    <EmployeeGamificationContext.Provider value={value}>{children}</EmployeeGamificationContext.Provider>
  );
}

export function useEmployeeGamification() {
  const ctx = useContext(EmployeeGamificationContext);
  if (!ctx) throw new Error("useEmployeeGamification must be used within EmployeeGamificationProvider");
  return ctx;
}
