import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Sparkles } from "lucide-react";

const PROMPTS = [
  "Why did ESG score decrease?",
  "Show departments with highest carbon",
  "Generate Q2 sustainability report",
];

export function EcoAiFab() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.button
        type="button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full border border-[#22C55E]/50 bg-[#111827] px-4 py-3 text-sm font-semibold text-[#22C55E] shadow-[0_0_24px_rgba(34,197,94,0.25)]"
      >
        <Bot className="h-5 w-5" />
        EcoSphere AI
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-end justify-end bg-black/50 p-4 sm:p-6"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl border border-[rgba(59,130,246,0.25)] bg-[#111827] p-5 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#22C55E]">
                  <Sparkles className="h-4 w-4" />
                  <span className="font-semibold">EcoSphere AI</span>
                </div>
                <button type="button" onClick={() => setOpen(false)} className="text-slate-500 hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-4 text-sm text-slate-300">Hello Athina 👋</p>
              <p className="mt-1 text-sm text-slate-500">Need help with ESG?</p>
              <div className="mt-4 space-y-2">
                {PROMPTS.map(p => (
                  <button
                    key={p}
                    type="button"
                    className="w-full rounded-lg border border-[rgba(59,130,246,0.2)] bg-[#0B1120] px-3 py-2 text-left text-xs text-slate-300 transition hover:border-[#22C55E]/40 hover:text-[#22C55E]"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
