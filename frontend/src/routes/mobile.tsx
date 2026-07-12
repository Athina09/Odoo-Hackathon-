import { createFileRoute, Outlet } from "@tanstack/react-router";
import { EcoPage } from "@/components/ecosphere/EcoPage";
import { MobileShell } from "@/components/ecosphere/mobile/MobileShell";
import { EmployeeGamificationProvider } from "@/context/EmployeeGamificationContext";
import { requireEmployee } from "@/lib/ecosphere-route-guards";
import { getEcoSession } from "@/lib/ecosphere-auth";

export const Route = createFileRoute("/mobile")({
  beforeLoad: ({ location }) => {
    requireEmployee(location.pathname);
  },
  component: MobileLayout,
});

function MobileLayout() {
  const session = getEcoSession();
  if (!session) return null;

  return (
    <EcoPage bare>
      <EmployeeGamificationProvider employeeId={session.id}>
        <MobileShell>
          <Outlet />
        </MobileShell>
      </EmployeeGamificationProvider>
    </EcoPage>
  );
}
