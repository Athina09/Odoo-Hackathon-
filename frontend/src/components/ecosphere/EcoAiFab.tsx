import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouterState } from "@tanstack/react-router";
import { Bot, X, Sparkles } from "lucide-react";
import { useEcoAuth } from "@/context/EcoAuthContext";
import { ConfidenceBar } from "@/components/ecosphere/ds/ConfidenceBar";
import { aiConfidenceForRole } from "@/lib/eco-ai-confidence";
import type { EcoRole } from "@/data/ecosphere-mock";
import { cn } from "@/lib/utils";

const ROLE_PROMPTS: Record<EcoRole, string[]> = {
  SUPER_ADMIN: [
    "Which departments need immediate ESG intervention?",
    "Summarize org-wide carbon trend this quarter",
    "Generate executive sustainability briefing",
  ],
  ESG_MANAGER: [
    "Why did ESG score decrease?",
    "Show departments with highest carbon",
    "Draft Q2 sustainability report outline",
  ],
  DEPARTMENT_MANAGER: [
    "How is my team performing on CSR?",
    "Which challenges should I approve first?",
    "Compare my department vs org average",
  ],
  EMPLOYEE: [
    "How much energy did I save this month?",
    "What challenge should I join next?",
    "Explain my digital twin impact",
  ],
};

export function EcoAiFab({ mobile = false }: { mobile?: boolean }) {
  const [open, setOpen] = useState(false);
  const { user, ready } = useEcoAuth();
  const path = useRouterState({ select: s => s.location.pathname });

  const confidence = useMemo(() => aiConfidenceForRole(user?.role), [user?.role]);
  const prompts = useMemo(
    () => ROLE_PROMPTS[user?.role ?? "EMPLOYEE"] ?? ROLE_PROMPTS.EMPLOYEE,
    [user?.role],
  );
  const firstName = user?.name?.split(" ")[0] ?? "there";

  if (!ready || !user || path.startsWith("/login")) return null;

  return (
    <>
      <motion.button
        type="button"
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => setOpen(true)}
        className={cn(
          "fixed z-50 flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-white",
          "bg-blue-600 shadow-md shadow-blue-600/30 hover:bg-blue-700",
          mobile ? "bottom-[5.5rem] right-4" : "bottom-6 right-6",
        )}
      >
        <span className="grid h-7 w-7 place-items-center rounded-full bg-blue-500/40">
          <Bot className="h-4 w-4" />
        </span>
        EcoSphere AI
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-end justify-end bg-black/20 p-4 backdrop-blur-[2px] sm:p-6"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ y: 24, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 24, opacity: 0, scale: 0.98 }}
              onClick={e => e.stopPropagation()}
              className="glass w-full max-w-md overflow-hidden rounded-xl shadow-2xl"
            >
              <div className="border-b border-blue-100 bg-blue-50 px-5 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-blue-700">
                    <Sparkles className="h-4 w-4" />
                    <span className="font-semibold">EcoSphere AI</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-3 rounded-lg border border-border bg-white/80 px-3 py-2">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    AI confidence
                  </div>
                  <div className="mt-1">
                    <ConfidenceBar value={confidence} />
                  </div>
                </div>
              </div>

              <div className="p-5">
                <p className="text-base font-semibold text-foreground">Hello {firstName} 👋</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {user.role === "EMPLOYEE"
                    ? "Ask about your impact, challenges, or facility twin."
                    : "Need help with ESG insights?"}
                </p>

                <div className="mt-4 space-y-2">
                  {prompts.map(p => (
                    <button
                      key={p}
                      type="button"
                      className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-left text-sm text-muted-foreground transition hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
