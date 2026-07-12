import { createFileRoute } from "@tanstack/react-router";
import { EmployeeHomeScreen } from "@/components/ecosphere/mobile/EmployeeHomeScreen";

export const Route = createFileRoute("/mobile/")({
  head: () => ({ meta: [{ title: "Home — EcoSphere" }] }),
  component: EmployeeHomeScreen,
});
