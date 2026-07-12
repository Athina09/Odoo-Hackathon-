import { useEffect, useState } from "react";
import { LiveInsightRow } from "./LiveInsightRow";
import type { FeedInsight } from "./types";

export function AiInsightsCard({ insights, title = "AI LIVE INSIGHTS" }: { insights: FeedInsight[]; title?: string }) {
  const [items, setItems] = useState(insights);

  useEffect(() => {
    setItems(insights);
  }, [insights]);

  return (
    <div className="eco-card flex h-[360px] flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-[var(--eco-border)] px-4 py-3">
        <div className="text-xs font-semibold uppercase tracking-[0.05em] text-[var(--eco-text-secondary)]">
          {title}
        </div>
        <span className="flex items-center gap-1.5 text-xs text-[var(--eco-accent-green)]">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--eco-accent-green)]" />
          live
        </span>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-2">
        {items.map(item => (
          <LiveInsightRow key={item.id} timestamp={item.timestamp} text={item.text} />
        ))}
      </div>
    </div>
  );
}
