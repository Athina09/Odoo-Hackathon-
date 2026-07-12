import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useEmployeeGamification } from "@/context/EmployeeGamificationContext";

export function CelebrationOverlay() {
  const { celebrating } = useEmployeeGamification();

  return (
    <AnimatePresence>
      {celebrating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-black/20"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className="rounded-2xl border border-[var(--accent-teal)] bg-white px-8 py-6 text-center shadow-xl"
          >
            <motion.div
              animate={{ rotate: [0, 12, -12, 0], scale: [1, 1.15, 1] }}
              transition={{ duration: 0.6, repeat: 2 }}
            >
              <Sparkles className="mx-auto h-12 w-12 text-[var(--accent-teal)]" />
            </motion.div>
            <p className="mt-3 text-xl font-bold text-[var(--text-primary)]">XP Awarded!</p>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">Badge unlocked if you hit the next milestone</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
