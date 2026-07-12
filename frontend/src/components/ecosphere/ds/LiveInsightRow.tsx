import { ChevronRight } from "lucide-react";

export function LiveInsightRow({ timestamp, text }: { timestamp: string; text: string }) {
  return (
    <div className="flex items-start gap-2 border-b border-[var(--eco-border)] py-2 last:border-0">
      <span className="w-14 shrink-0 text-xs text-[var(--eco-text-muted)]">{timestamp}</span>
      <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--eco-accent-teal)]" />
      <span className="text-[13px] text-[var(--eco-text-primary)]">{text}</span>
    </div>
  );
}
