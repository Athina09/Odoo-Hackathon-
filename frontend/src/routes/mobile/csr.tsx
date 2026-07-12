import { createFileRoute } from "@tanstack/react-router";
import { EmployeeCsrScreen } from "@/components/ecosphere/mobile/EmployeeCsrScreen";

export const Route = createFileRoute("/mobile/csr")({
  head: () => ({ meta: [{ title: "CSR — EcoSphere" }] }),
  component: EmployeeCsrScreen,
});
