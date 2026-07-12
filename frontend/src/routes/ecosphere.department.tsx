import { createFileRoute, redirect } from "@tanstack/react-router";
import { DepartmentManagerConsole } from "@/components/ecosphere/manager/DepartmentManagerConsole";
import { getEcoSession } from "@/lib/ecosphere-auth";

export const Route = createFileRoute("/ecosphere/department")({
  beforeLoad: () => {
    const session = getEcoSession();
    if (!session || session.role !== "DEPARTMENT_MANAGER") {
      throw redirect({ to: "/ecosphere/login", search: { redirect: "/ecosphere/department" } });
    }
  },
  head: () => ({
    meta: [{ title: "Department — EcoSphere" }],
  }),
  component: DepartmentManagerPage,
});

function DepartmentManagerPage() {
  return <DepartmentManagerConsole />;
}
