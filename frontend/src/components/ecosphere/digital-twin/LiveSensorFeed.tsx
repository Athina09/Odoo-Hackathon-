import type { SensorFeedItem } from "@/lib/digital-twin-engine";

export function LiveSensorFeed({ items }: { items: SensorFeedItem[] }) {
  return (
    <div className="eco-card flex max-h-[320px] flex-col p-4">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
        Live Sensor Feed
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto">
        {items.map((item, i) => (
          <div
            key={`${item.time}-${i}`}
            className={`flex items-start gap-2 border-b border-[var(--border)] pb-2 text-xs last:border-0 ${
              item.alert ? "text-[var(--accent-red)]" : "text-[var(--text-primary)]"
            }`}
          >
            <span className="w-10 shrink-0 font-mono text-[var(--text-muted)]">{item.time}</span>
            <div>
              <span className="font-semibold">{item.source}</span>
              <span className="text-[var(--text-muted)]"> · {item.metric}</span>
              <div className="font-medium">{item.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
