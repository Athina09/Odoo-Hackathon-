import { ESG_KPIS } from "@/data/ecosphere";
import { StatCard } from "@/components/aegis/StatCard";
import { Gauge, Cloud, Sparkles, AlertTriangle, Users, Trophy } from "lucide-react";

export function EcoKpiRow() {
  const k = ESG_KPIS;
  return (
    <div className="eco-kpis grid grid-cols-2 gap-4 lg:grid-cols-6">
      <StatCard label="Overall ESG Score" value={k.overallScore.value} icon={Gauge} tone="success" sub={k.overallScore.label} trend={k.overallScore.trend} />
      <StatCard label="Carbon Emissions" value={124} icon={Cloud} tone="neon-2" sub="tCO₂ this quarter" trend={k.carbon.trend} />
      <StatCard label="AI Confidence" value={94} icon={Sparkles} tone="primary" sub={k.aiConfidence.sub} trend="verified insights" />
      <StatCard label="Compliance Issues" value={k.complianceIssues.value} icon={AlertTriangle} tone="danger" sub={k.complianceIssues.sub} trend="2 overdue" />
      <StatCard label="CSR Participation" value={87} icon={Users} tone="success" sub="active employees" trend={k.csrParticipation.trend} />
      <StatCard label="Challenges Active" value={k.challengesActive.value} icon={Trophy} tone="warn" sub={k.challengesActive.sub} trend="gamification live" />
    </div>
  );
}
