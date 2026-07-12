import { TrendingDown, TrendingUp } from "lucide-react";
import type { IconColor, KpiCardProps } from "./types";

const iconStyles: Record<IconColor, string> = {
  teal: "bg-[var(--eco-accent-teal-bg)] text-[var(--eco-accent-teal)]",
  purple: "bg-[var(--eco-accent-purple-bg)] text-[var(--eco-accent-purple)]",
  green: "bg-[var(--eco-accent-green-bg)] text-[var(--eco-accent-green)]",
  amber: "bg-[var(--eco-accent-amber-bg)] text-[var(--eco-accent-amber)]",
  red: "bg-[var(--eco-accent-red-bg)] text-[var(--eco-accent-red)]",
  blue: "bg-[var(--eco-accent-blue-bg)] text-[var(--eco-accent-blue)]",
};

export function KpiCard({
  label,
  value,
  subtitle,
  icon: Icon,
  iconColor,
  trend,
  trendDirection = "up",
}: KpiCardProps) {
  const trendColor =
    trendDirection === "up" ? "text-[var(--eco-accent-blue)]" : "text-[var(--eco-accent-red)]";

  return (
    <div className="eco-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[var(--eco-text-secondary)]">
            {label}
          </div>
          <div className="mt-1 text-[28px] font-bold leading-none text-[var(--eco-text-primary)]">{value}</div>
          {subtitle && (
            <div className="mt-1 text-[13px] text-[var(--eco-text-muted)]">{subtitle}</div>
          )}
        </div>
        <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${iconStyles[iconColor]}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      {trend && (
        <div className={`mt-3 flex items-center gap-1.5 text-[13px] ${trendColor}`}>
          <span className="h-1 w-12 overflow-hidden rounded bg-[var(--eco-bg-page)]">
            <span
              className="block h-full bg-[var(--eco-accent-blue)]"
              style={{ width: trendDirection === "up" ? "72%" : "45%" }}
            />
          </span>
          {trendDirection === "up" ? (
            <TrendingUp className="h-3.5 w-3.5" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5" />
          )}
          <span>{trend}</span>
        </div>
      )}
    </div>
  );
}
