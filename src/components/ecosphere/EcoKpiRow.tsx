import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { ESG_KPIS } from "@/data/ecosphere";
import {
  Gauge,
  Cloud,
  Sparkles,
  AlertTriangle,
  Users,
  Trophy,
} from "lucide-react";

function KpiCard({
  label,
  value,
  sub,
  trend,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string | number;
  sub?: string;
  trend?: string;
  icon: LucideIcon;
  accent: "green" | "cyan" | "amber" | "red";
}) {
  const colors = {
    green: "border-l-[#22C55E] text-[#22C55E]",
    cyan: "border-l-[#06B6D4] text-[#06B6D4]",
    amber: "border-l-[#F59E0B] text-[#F59E0B]",
    red: "border-l-[#EF4444] text-[#EF4444]",
  };

  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: "0 8px 32px rgba(34,197,94,0.08)" }}
      className={`rounded-2xl border border-[rgba(59,130,246,0.25)] border-l-4 bg-[#111827] p-4 ${colors[accent].split(" ")[0]}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-slate-500">{label}</div>
          <div className="mt-2 font-mono text-2xl font-semibold text-white">{value}</div>
          {sub && <div className="mt-0.5 text-[11px] text-slate-400">{sub}</div>}
          {trend && <div className={`mt-1 text-[11px] font-medium ${colors[accent].split(" ")[1]}`}>{trend}</div>}
        </div>
        <div className={`grid h-9 w-9 place-items-center rounded-xl border border-[rgba(59,130,246,0.2)] bg-[#0B1120] ${colors[accent].split(" ")[1]}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </motion.div>
  );
}

export function EcoKpiRow() {
  const k = ESG_KPIS;
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">
      <KpiCard label="Overall ESG Score" value={k.overallScore.value} sub={k.overallScore.label} trend={k.overallScore.trend} icon={Gauge} accent="green" />
      <KpiCard label="Carbon Emissions" value={k.carbon.value} trend={k.carbon.trend} icon={Cloud} accent="cyan" />
      <KpiCard label="AI Confidence" value={k.aiConfidence.value} sub={k.aiConfidence.sub} icon={Sparkles} accent="green" />
      <KpiCard label="Compliance Issues" value={k.complianceIssues.value} sub={k.complianceIssues.sub} icon={AlertTriangle} accent="red" />
      <KpiCard label="CSR Participation" value={k.csrParticipation.value} trend={k.csrParticipation.trend} icon={Users} accent="cyan" />
      <KpiCard label="Challenges Active" value={k.challengesActive.value} sub={k.challengesActive.sub} icon={Trophy} accent="amber" />
    </div>
  );
}
