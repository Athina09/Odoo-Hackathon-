import type { LucideIcon } from "lucide-react";

export type IconColor = "teal" | "purple" | "green" | "amber" | "red" | "blue";

export type PillTone = "critical" | "high" | "medium" | "low" | "good" | "excellent";

export interface KpiCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor: IconColor;
  trend?: string;
  trendDirection?: "up" | "down";
}

export interface FeedInsight {
  id: string;
  timestamp: string;
  text: string;
  category?: string;
}
