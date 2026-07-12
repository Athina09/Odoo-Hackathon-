import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { liveInsightsSeed, type FeedItem } from "@/data/ecosphere";

const tagColor: Record<string, string> = {
  environment: "text-success",
  carbon: "text-primary",
  social: "text-neon-2",
  governance: "text-warn",
  ai: "text-primary",
};

const EXTRA_FEED: Omit<FeedItem, "id">[] = [
  { t: "just now", text: "Scope 2 emissions spike detected — Manufacturing", tag: "carbon" },
  { t: "22s ago", text: "Supplier audit passed — Tier 2 logistics", tag: "governance" },
  { t: "45s ago", text: "Employee wellness challenge +12 signups", tag: "social" },
];

export function AiLiveFeed() {
  const [items, setItems] = useState<FeedItem[]>(liveInsightsSeed);

  useEffect(() => {
    const interval = setInterval(() => {
      const extra = EXTRA_FEED[Math.floor(Math.random() * EXTRA_FEED.length)];
      setItems(prev => [{ ...extra, id: `live-${Date.now()}` }, ...prev.slice(0, 12)]);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass relative h-[360px] overflow-hidden rounded-xl p-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">AI Live Insights</div>
        <span className="flex items-center gap-1 text-xs text-success">
          <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-ring" /> live
        </span>
      </div>
      <div className="scanline pointer-events-none absolute inset-0 opacity-40" />
      <div className="space-y-1.5 overflow-y-auto pr-1 font-mono text-sm" style={{ height: "calc(100% - 28px)" }}>
        <AnimatePresence initial={false}>
          {items.map(item => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex gap-2 border-l-2 border-border/60 py-0.5 pl-2 hover:border-primary/60"
            >
              <span className="w-14 shrink-0 text-muted-foreground">{item.t}</span>
              <span className={tagColor[item.tag] ?? "text-muted-foreground"}>›</span>
              <span className="text-foreground/90">{item.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
