import { createFileRoute } from "@tanstack/react-router";
import { EmployeeImpactScreen } from "@/components/ecosphere/mobile/EmployeeImpactScreen";

export const Route = createFileRoute("/mobile/impact")({
  head: () => ({ meta: [{ title: "Your Impact — EcoSphere" }] }),
  component: EmployeeImpactScreen,
});
