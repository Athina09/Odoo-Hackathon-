import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { EcoShell } from "@/components/ecosphere/EcoShell";
import { EcoAuthProvider } from "@/context/EcoAuthContext";

export const Route = createFileRoute("/ecosphere")({
  component: EcoSphereLayout,
});

function EcoSphereLayout() {
  const path = useRouterState({ select: s => s.location.pathname });
  const isLogin = path === "/ecosphere/login";

  return (
    <EcoAuthProvider>
      {isLogin ? (
        <div className="eco-light min-h-screen">
          <Outlet />
        </div>
      ) : (
        <EcoShell>
          <Outlet />
        </EcoShell>
      )}
    </EcoAuthProvider>
  );
}
