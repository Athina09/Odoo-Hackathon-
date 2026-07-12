import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Shared chrome for geographic heatmap + plant blueprint dark panels */
export function DarkMapShell({
  label,
  subtitle,
  actions,
  children,
  className,
  compact = false,
}: {
  label: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "eco-dark-surface relative overflow-hidden rounded-2xl border border-white/10",
        className,
      )}
    >
      <div
        className={cn(
          "eco-dark-surface-bg relative",
          compact ? "min-h-[160px]" : "min-h-[360px]",
        )}
      >
        <div className="relative z-20 flex flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-[#010d18]/95 px-3 py-2 backdrop-blur-sm">
          <div className="min-w-0">
            <div className="eco-dark-surface-label inline-block rounded-md border border-white/12 bg-black/55 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-white/85">
              {label}
            </div>
            {subtitle && (
              <p className="mt-1 font-mono text-[9px] text-white/45">{subtitle}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
        {children}
      </div>
    </div>
  );
}
