import { cn } from "@/lib/utils";
import { badgeStyles, type SensorBadge as BadgeType } from "@/lib/digital-twin-industrial";

export function SensorBadge({
  badge,
  pulse = false,
  className,
}: {
  badge: BadgeType;
  pulse?: boolean;
  className?: string;
}) {
  const { color, bg } = badgeStyles(badge);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-mono text-[7px] font-semibold uppercase tracking-wider",
        pulse && badge === "ONLINE" && "dt-sensor-pulse",
        className,
      )}
      style={{ color, background: bg, border: `1px solid ${color}33` }}
    >
      {pulse && badge === "ONLINE" && (
        <span className="dt-online-dot h-1 w-1 rounded-full" style={{ background: color }} />
      )}
      {badge}
    </span>
  );
}
