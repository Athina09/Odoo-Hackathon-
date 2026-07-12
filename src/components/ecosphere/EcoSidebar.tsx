import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Leaf,
  Users,
  Shield,
  Sparkles,
  FileBarChart,
  Settings,
  Trophy,
  ClipboardCheck,
} from "lucide-react";
import { motion } from "framer-motion";

const items = [
  { to: "/ecosphere", label: "Dashboard", icon: LayoutDashboard },
  { to: "/ecosphere", label: "Environment", icon: Leaf, hash: "environment" },
  { to: "/ecosphere", label: "Social", icon: Users, hash: "social" },
  { to: "/ecosphere", label: "Governance", icon: Shield, hash: "governance" },
  { to: "/ecosphere", label: "Challenges", icon: Trophy, hash: "challenges" },
  { to: "/ecosphere", label: "AI Insights", icon: Sparkles, hash: "insights" },
  { to: "/ecosphere", label: "Reports", icon: FileBarChart, hash: "reports" },
  { to: "/ecosphere", label: "Audits", icon: ClipboardCheck, hash: "audits" },
  { to: "/ecosphere", label: "Settings", icon: Settings, hash: "settings" },
] as const;

export function EcoSidebar() {
  const path = useRouterState({ select: s => s.location.pathname });

  return (
    <aside className="z-20 flex w-[68px] shrink-0 flex-col items-center justify-between border-r border-[rgba(59,130,246,0.25)] bg-[#0B1120]/95 py-4 backdrop-blur-xl">
      <div className="flex flex-col items-center gap-2">
        <Link to="/ecosphere" className="group relative mb-3 grid h-10 w-10 place-items-center rounded-xl border border-[#22C55E]/40 bg-[#22C55E]/10">
          <Leaf className="h-5 w-5 text-[#22C55E]" />
          <span className="absolute -inset-1 rounded-xl opacity-0 transition group-hover:opacity-100 shadow-[0_0_20px_rgba(34,197,94,0.25)]" />
        </Link>

        {items.map(({ to, label, icon: Icon }) => {
          const active = path.startsWith("/ecosphere") && label === "Dashboard" ? path === "/ecosphere" : false;
          return (
            <Link key={label} to={to} className="group relative">
              <motion.div
                whileHover={{ scale: 1.06 }}
                className={[
                  "grid h-10 w-10 place-items-center rounded-lg border transition-colors",
                  active
                    ? "border-[#22C55E]/50 bg-[#22C55E]/15 text-[#22C55E]"
                    : "border-transparent text-slate-500 hover:border-[#06B6D4]/35 hover:bg-[#111827] hover:text-slate-200",
                ].join(" ")}
              >
                <Icon className="h-[18px] w-[18px]" />
              </motion.div>
              <span className="pointer-events-none absolute left-12 top-1/2 z-50 -translate-y-1/2 whitespace-nowrap rounded-md border border-[rgba(59,130,246,0.25)] bg-[#111827] px-2 py-1 text-xs opacity-0 shadow-lg transition group-hover:opacity-100">
                {label}
              </span>
            </Link>
          );
        })}
      </div>

      <Link to="/" className="mb-1 text-[9px] uppercase tracking-widest text-slate-600 hover:text-[#06B6D4]">
        AEGIS
      </Link>
    </aside>
  );
}
