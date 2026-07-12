import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Crown, Leaf, LogIn, Shield, Users, Smartphone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EcoPage } from "@/components/ecosphere/EcoPage";
import { useEcoAuth } from "@/context/EcoAuthContext";
import {
  getEcoSession,
  getHomeRouteForRole,
  PORTAL_ROLE_PASSWORDS,
  type PortalLoginAccount,
  type PortalRole,
} from "@/lib/ecosphere-auth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>) => ({
    redirect: typeof s.redirect === "string" ? s.redirect : undefined,
  }),
  beforeLoad: ({ search }) => {
    const session = getEcoSession();
    if (!session) return;
    const destination =
      search.redirect && session.role === "SUPER_ADMIN"
        ? search.redirect
        : getHomeRouteForRole(session.role);
    throw redirect({ to: destination });
  },
  component: EcoLoginPage,
});

const ROLE_OPTIONS: {
  role: PortalRole;
  label: string;
  description: string;
  icon: typeof Crown;
}[] = [
  {
    role: "SUPER_ADMIN",
    label: "Super Admin",
    description: "Organization setup, assignments, and system configuration",
    icon: Crown,
  },
  {
    role: "ESG_MANAGER",
    label: "ESG Manager",
    description: "Monitor ESG performance, CSR, audits, and AI insights",
    icon: Shield,
  },
  {
    role: "DEPARTMENT_MANAGER",
    label: "Department Manager",
    description: "Department dashboard, emissions, and team participation",
    icon: Users,
  },
  {
    role: "EMPLOYEE",
    label: "Employee",
    description: "Mobile app — XP, challenges, CSR volunteering, rewards",
    icon: Smartphone,
  },
];

function EcoLoginPage() {
  return (
    <EcoPage bare>
      <LoginForm />
    </EcoPage>
  );
}

function LoginForm() {
  const { login, getAccountsForRole, ready, user } = useEcoAuth();
  const navigate = useNavigate();
  const { redirect } = Route.useSearch();
  const [selectedRole, setSelectedRole] = useState<PortalRole>("SUPER_ADMIN");
  const [accountId, setAccountId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const accounts = useMemo(
    () => (ready ? getAccountsForRole(selectedRole) : []),
    [ready, getAccountsForRole, selectedRole],
  );

  const selectedAccount = useMemo(
    () => accounts.find(a => a.id === accountId) ?? accounts[0] ?? null,
    [accounts, accountId],
  );

  useEffect(() => {
    if (user) {
      navigate({ to: redirect ?? getHomeRouteForRole(user.role) });
    }
  }, [user, navigate, redirect]);

  useEffect(() => {
    if (accounts[0]) setAccountId(accounts[0].id);
    else setAccountId("");
    setPassword(PORTAL_ROLE_PASSWORDS[selectedRole]);
    setError("");
  }, [selectedRole, accounts]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!selectedAccount) {
      setError("No account available for this role. Ask Super Admin to assign one.");
      return;
    }
    const session = login(selectedAccount.email, password, selectedRole);
    if (!session) {
      setError("Invalid credentials or account is not assigned to this role.");
      return;
    }
    const destination =
      redirect && session.role === "SUPER_ADMIN" ? redirect : getHomeRouteForRole(session.role);
    navigate({ to: destination });
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-xl border border-primary/25 bg-primary/10">
            <Leaf className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground">Sign in to EcoSphere</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            For leadership dashboards and the employee mobile app — select your role below.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Managers use the web console; employees sign in to open challenges, CSR, impact & rewards on mobile.
          </p>
        </div>

        <div className="mb-5 grid gap-2">
          {ROLE_OPTIONS.map(({ role, label, description, icon: Icon }) => (
            <button
              key={role}
              type="button"
              onClick={() => setSelectedRole(role)}
              className={cn(
                "flex items-start gap-3 rounded-xl border p-3 text-left transition",
                selectedRole === role
                  ? "border-primary/40 bg-primary/8 shadow-sm"
                  : "border-border bg-white hover:border-primary/25",
              )}
            >
              <div
                className={cn(
                  "mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg",
                  selectedRole === role ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <div className="font-medium text-foreground">{label}</div>
                <div className="text-sm text-muted-foreground">{description}</div>
              </div>
            </button>
          ))}
        </div>

        <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-border bg-white p-6 shadow-sm">
          <div className="space-y-2">
            <label htmlFor="account" className="text-sm text-muted-foreground">
              Who is signing in?
            </label>
            {accounts.length === 0 ? (
              <p className="rounded-lg border border-warn/30 bg-warn/8 px-3 py-2 text-sm text-warn">
                {!ready
                  ? "Loading accounts…"
                  : `No ${ROLE_OPTIONS.find(r => r.role === selectedRole)?.label} accounts assigned yet. Super Admin can assign people in Administration → People.`}
              </p>
            ) : (
              <select
                id="account"
                className="h-10 w-full rounded-lg border border-border bg-white px-3 text-base outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
                value={accountId}
                onChange={e => setAccountId(e.target.value)}
              >
                {accounts.map((a: PortalLoginAccount) => (
                  <option key={a.id} value={a.id}>
                    {a.name} · {a.email}
                    {a.departmentName ? ` · ${a.departmentName}` : ""}
                  </option>
                ))}
              </select>
            )}
          </div>

          {selectedAccount && (
            <p className="text-sm text-muted-foreground">
              Signing in as <span className="font-medium text-foreground">{selectedAccount.name}</span>
              {selectedAccount.departmentName ? ` (${selectedAccount.departmentName})` : ""}
            </p>
          )}

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm text-muted-foreground">
              Password
            </label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Demo password for {ROLE_OPTIONS.find(r => r.role === selectedRole)?.label}:{" "}
              <code className="rounded bg-secondary px-1">{PORTAL_ROLE_PASSWORDS[selectedRole]}</code>
            </p>
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}
          <Button type="submit" className="w-full gap-2" disabled={!selectedAccount}>
            <LogIn className="h-4 w-4" /> Sign in
          </Button>
        </form>

      </div>
    </div>
  );
}
