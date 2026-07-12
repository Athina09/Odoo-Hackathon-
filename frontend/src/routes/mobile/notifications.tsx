import { createFileRoute } from "@tanstack/react-router";
import { EmployeeNotificationsScreen } from "@/components/ecosphere/mobile/EmployeeNotificationsScreen";

export const Route = createFileRoute("/mobile/notifications")({
  head: () => ({ meta: [{ title: "Notifications — EcoSphere" }] }),
  component: EmployeeNotificationsScreen,
});
