import { createFileRoute, redirect } from "@tanstack/react-router";
import { DepartmentManagerConsole } from "@/components/ecosphere/manager/DepartmentManagerConsole";
import { EcoPage } from "@/components/ecosphere/EcoPage";
import { getEcoSession } from "@/lib/ecosphere-auth";

export const Route = createFileRoute("/department")({
  beforeLoad: () => {
    const session = getEcoSession();
    if (!session || session.role !== "DEPARTMENT_MANAGER") {
      throw redirect({ to: "/login", search: { redirect: "/department" } });
    }
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
