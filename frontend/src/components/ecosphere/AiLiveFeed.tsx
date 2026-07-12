import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { liveInsightsSeed, type FeedItem } from "@/data/ecosphere";

const tagColor: Record<string, string> = {
  environment: "text-[#22C55E]",
  carbon: "text-[#06B6D4]",
  social: "text-[#A78BFA]",
  governance: "text-[#F59E0B]",
  ai: "text-[#22C55E]",
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
      setItems(prev => [
        { ...extra, id: `live-${Date.now()}` },
        ...prev.slice(0, 12),
      ]);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-[380px] flex-col overflow-hidden rounded-2xl border border-[rgba(59,130,246,0.25)] bg-[#111827] p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-[10px] uppercase tracking-widest text-slate-500">AI Live Insights</div>
        <span className="flex items-center gap-1 text-[10px] text-[#22C55E]">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#22C55E]" />
          live
        </span>
      </div>
      <div className="flex-1 space-y-1 overflow-y-auto pr-1 font-mono text-[12px]">
        <AnimatePresence initial={false}>
          {items.map(item => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex gap-2 border-l-2 border-[rgba(59,130,246,0.2)] py-1 pl-2 hover:border-[#22C55E]/50"
            >
              <span className="w-16 shrink-0 text-slate-500">{item.t}</span>
              <span className={tagColor[item.tag] ?? "text-slate-400"}>›</span>
              <span className="text-slate-200">{item.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
