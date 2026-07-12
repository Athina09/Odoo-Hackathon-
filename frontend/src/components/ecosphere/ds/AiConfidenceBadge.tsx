import { Sparkles } from "lucide-react";
import { ConfidenceBar } from "./ConfidenceBar";
import { cn } from "@/lib/utils";

export function AiConfidenceBadge({
  value,
  label = "AI confidence",
  compact = false,
  className,
}: {
  value: number;
  label?: string;
  compact?: boolean;
  className?: string;
}) {
  if (compact) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--bg-card)] px-2 py-0.5 text-[10px] font-semibold text-[var(--accent-teal)]",
          className,
        )}
      >
        <Sparkles className="h-3 w-3" />
        {value}%
      </span>
    );
  }

  return (
    <div className={cn("rounded-lg border border-[var(--border)] bg-[var(--bg-page)] px-3 py-2", className)}>
      <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
        <Sparkles className="h-3.5 w-3.5 text-[var(--accent-teal)]" />
        {label}
      </div>
      <ConfidenceBar value={value} />
    </div>
  );
}
