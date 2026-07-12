import { departments } from "@/data/ecosphere";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChevronRight } from "lucide-react";

const riskBadge = (risk: string) => {
  if (risk === "high") return "🔴";
  if (risk === "medium") return "🟡";
  return "🟢";
};

const statusTone: Record<string, string> = {
  excellent: "bg-[#22C55E]/15 text-[#22C55E] border-[#22C55E]/30",
  good: "bg-[#06B6D4]/15 text-[#06B6D4] border-[#06B6D4]/30",
  watch: "bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30",
  critical: "bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30",
};

export function DepartmentTable() {
  return (
    <div className="overflow-hidden rounded-2xl border border-[rgba(59,130,246,0.25)] bg-[#111827]">
      <div className="border-b border-[rgba(59,130,246,0.15)] px-4 py-3">
        <h2 className="text-sm font-semibold text-white">Department Performance</h2>
        <p className="text-[11px] text-slate-500">ESG · Carbon · CSR · Governance · AI confidence</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-[rgba(59,130,246,0.15)] text-[10px] uppercase tracking-widest text-slate-500">
              <th className="px-4 py-3 font-medium">Department</th>
              <th className="px-4 py-3 font-medium">ESG</th>
              <th className="px-4 py-3 font-medium">Carbon</th>
              <th className="px-4 py-3 font-medium">CSR</th>
              <th className="px-4 py-3 font-medium">Governance</th>
              <th className="px-4 py-3 font-medium">AI Conf.</th>
              <th className="px-4 py-3 font-medium">Risk</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {departments.map(row => (
              <tr
                key={row.id}
                className="border-b border-[rgba(59,130,246,0.08)] transition hover:bg-[#0B1120]/60"
              >
                <td className="px-4 py-3 font-medium text-slate-100">{row.department}</td>
                <td className="px-4 py-3 font-mono text-[#22C55E]">{row.esg}</td>
                <td className="px-4 py-3 capitalize text-slate-300">{row.carbon}</td>
                <td className="px-4 py-3 font-mono text-slate-300">{row.csr}%</td>
                <td className="px-4 py-3 font-mono text-slate-300">{row.governance}%</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Progress value={row.confidence} className="h-1.5 w-16 bg-[#0B1120]" />
                    <span className="font-mono text-xs text-slate-400">{row.confidence}%</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-lg">{riskBadge(row.risk)}</td>
                <td className="px-4 py-3">
                  <Badge variant="outline" className={`text-[10px] uppercase ${statusTone[row.status]}`}>
                    {row.status}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <button type="button" className="flex items-center gap-0.5 text-xs text-[#06B6D4] hover:text-[#22C55E]">
                    Open <ChevronRight className="h-3 w-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
