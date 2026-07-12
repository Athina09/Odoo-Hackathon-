import { Gauge, Cloud, Sparkles, AlertTriangle, Users, Trophy } from "lucide-react";
import { ESG_KPIS } from "@/data/ecosphere";
import { KpiCard } from "@/components/ecosphere/ds";

export function EcoKpiRow() {
  const k = ESG_KPIS;
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
      <KpiCard label="Overall ESG Score" value={k.overallScore.value} subtitle={k.overallScore.label} icon={Gauge} iconColor="blue" trend={k.overallScore.trend} trendDirection="up" />
      <KpiCard label="Carbon Emissions" value={124} subtitle="tCO₂ this quarter" icon={Cloud} iconColor="blue" trend={k.carbon.trend} trendDirection="down" />
      <KpiCard label="AI Confidence" value="94%" subtitle={k.aiConfidence.sub} icon={Sparkles} iconColor="blue" trend="verified insights" trendDirection="up" />
      <KpiCard label="Compliance Issues" value={k.complianceIssues.value} subtitle={k.complianceIssues.sub} icon={AlertTriangle} iconColor="red" trend="2 overdue" trendDirection="down" />
      <KpiCard label="CSR Participation" value="87%" subtitle="active employees" icon={Users} iconColor="green" trend={k.csrParticipation.trend} trendDirection="up" />
      <KpiCard label="Challenges Active" value={k.challengesActive.value} subtitle={k.challengesActive.sub} icon={Trophy} iconColor="amber" trend="gamification live" trendDirection="up" />
    </div>
  );
}
