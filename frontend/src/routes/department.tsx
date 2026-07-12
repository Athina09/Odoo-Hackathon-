import { createFileRoute } from "@tanstack/react-router";
import { DepartmentManagerConsole } from "@/components/ecosphere/manager/DepartmentManagerConsole";
import { EcoPage } from "@/components/ecosphere/EcoPage";
import { requireRole } from "@/lib/ecosphere-route-guards";

export const Route = createFileRoute("/department")({
  beforeLoad: () => {
    requireRole("DEPARTMENT_MANAGER", "/department");
  },
  head: () => ({
    meta: [{ title: "Department — EcoSphere" }],
  }),
  component: DepartmentManagerPage,
});

function DepartmentManagerPage() {
  return (
    <EcoPage>
      <DepartmentManagerConsole />
    </EcoPage>
  );
}
