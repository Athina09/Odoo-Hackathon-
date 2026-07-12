import type { PillTone } from "./types";

const toneStyles: Record<PillTone, string> = {
  critical: "bg-[var(--eco-accent-red-bg)] text-[var(--eco-accent-red)]",
  high: "bg-[var(--eco-accent-red-bg)] text-[var(--eco-accent-red)]",
  medium: "bg-[var(--eco-accent-amber-bg)] text-[var(--eco-accent-amber)]",
  low: "bg-[var(--eco-accent-green-bg)] text-[var(--eco-accent-green)]",
  good: "bg-[var(--eco-accent-teal-bg)] text-[var(--eco-accent-teal)]",
  excellent: "bg-[var(--eco-accent-green-bg)] text-[var(--eco-accent-green)]",
};

export function StatusPill({ label, tone }: { label: string; tone: PillTone }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${toneStyles[tone]}`}
    >
      {label}
    </span>
  );
}
