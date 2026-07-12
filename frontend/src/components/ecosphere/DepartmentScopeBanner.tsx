import { Lock } from "lucide-react";
import { useEcoAuth } from "@/context/EcoAuthContext";

export function DepartmentScopeBanner() {
  const { user, isDepartmentManager } = useEcoAuth();
  if (!isDepartmentManager || !user?.departmentName) return null;

  return (
    <div className="flex items-center gap-2 rounded-lg border border-[var(--accent-teal)]/30 bg-[var(--accent-teal-bg)] px-4 py-2 text-sm text-[var(--text-primary)]">
      <Lock className="h-4 w-4 shrink-0 text-[var(--accent-teal)]" />
      <span>
        Viewing <strong>{user.departmentName}</strong> only — department scope is locked and cannot be changed.
      </span>
    </div>
  );
}

export function useDepartmentFilter(): string | undefined {
  const { user, isDepartmentManager } = useEcoAuth();
  return isDepartmentManager ? user?.departmentName : undefined;
}
