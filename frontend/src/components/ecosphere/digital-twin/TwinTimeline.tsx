import { AlertCircle, Bot, CheckCircle2, Info } from "lucide-react";
import type { TimelineEvent } from "@/lib/digital-twin-engine";

const typeConfig: Record<
  TimelineEvent["type"],
  { border: string; bg: string; Icon: typeof Info }
> = {
  info: { border: "var(--border)", bg: "var(--bg-page)", Icon: Info },
  alert: { border: "color-mix(in srgb, var(--accent-red) 30%, transparent)", bg: "var(--accent-red-bg)", Icon: AlertCircle },
  ai: { border: "color-mix(in srgb, var(--accent-teal) 30%, transparent)", bg: "var(--accent-teal-bg)", Icon: Bot },
  action: { border: "color-mix(in srgb, var(--accent-green) 30%, transparent)", bg: "var(--accent-green-bg)", Icon: CheckCircle2 },
};

export function TwinTimeline({ events }: { events: TimelineEvent[] }) {
  return (
    <div className="eco-card p-4">
      <div className="mb-3 text-xs font-semibold uppercase tracking-[0.05em] text-[var(--text-secondary)]">
        Operations Event Log
      </div>
      <div className="space-y-0">
        {events.map((ev, i) => {
          const cfg = typeConfig[ev.type];
          const Icon = cfg.Icon;
          return (
            <div key={ev.time} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-mono font-semibold text-[var(--text-muted)]">{ev.time}</span>
                {i < events.length - 1 && <div className="my-1 w-px flex-1 bg-[var(--border)]" />}
              </div>
              <div
                className="mb-2 flex flex-1 items-start gap-2 rounded-lg border px-2.5 py-1.5"
                style={{ borderColor: cfg.border, background: cfg.bg }}
              >
                <Icon className="mt-0.5 h-3 w-3 shrink-0 text-[var(--text-secondary)]" strokeWidth={1.5} />
                <span className="text-xs leading-relaxed text-[var(--text-secondary)]">{ev.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
