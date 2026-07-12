import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {
  carbonTrend,
  departmentScores,
  esgRadar,
  topEmitters,
  aiRecommendations,
} from "@/data/ecosphere";

const PIE_COLORS = ["#22C55E", "#06B6D4", "#F59E0B", "#EF4444", "#A78BFA"];

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[rgba(59,130,246,0.25)] bg-[#111827] p-4">
      <div className="mb-3 text-[10px] uppercase tracking-widest text-slate-500">{title}</div>
      <div className="h-[200px]">{children}</div>
    </div>
  );
}

export function EcoChartsGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      <ChartCard title="ESG Breakdown">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={esgRadar}>
            <PolarGrid stroke="rgba(59,130,246,0.2)" />
            <PolarAngleAxis dataKey="axis" tick={{ fill: "#94a3b8", fontSize: 10 }} />
            <Radar dataKey="score" stroke="#22C55E" fill="#22C55E" fillOpacity={0.35} />
          </RadarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Carbon Trend">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={carbonTrend}>
            <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} width={32} />
            <Tooltip contentStyle={{ background: "#111827", border: "1px solid rgba(59,130,246,0.25)" }} />
            <Line type="monotone" dataKey="tco2" stroke="#06B6D4" strokeWidth={2} dot={{ fill: "#06B6D4", r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Department Score">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={departmentScores} dataKey="value" nameKey="name" innerRadius={50} outerRadius={75} paddingAngle={2}>
              {departmentScores.map((_, i) => (
                <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ background: "#111827", border: "1px solid rgba(59,130,246,0.25)" }} />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Top Carbon Emitters">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={topEmitters} layout="vertical" margin={{ left: 8 }}>
            <XAxis type="number" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="site" tick={{ fill: "#94a3b8", fontSize: 9 }} width={90} axisLine={false} tickLine={false} />
            <Bar dataKey="tco2" fill="#EF4444" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="rounded-2xl border border-[rgba(59,130,246,0.25)] bg-[#111827] p-4 md:col-span-1 xl:col-span-2">
        <div className="mb-3 text-[10px] uppercase tracking-widest text-slate-500">AI Recommendations</div>
        <div className="grid gap-3 sm:grid-cols-2">
          {aiRecommendations.map(r => (
            <div
              key={r.id}
              className="rounded-xl border border-[#22C55E]/25 bg-[#0B1120] p-4 transition hover:border-[#22C55E]/50"
            >
              <div className="text-sm font-medium text-slate-100">{r.title}</div>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                <span className="rounded-md bg-[#06B6D4]/15 px-2 py-0.5 text-[#06B6D4]">{r.impact}</span>
                <span className="rounded-md bg-[#22C55E]/15 px-2 py-0.5 text-[#22C55E]">{r.esgBoost}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function EsgHealthCard() {
  return (
    <div className="rounded-2xl border border-[rgba(59,130,246,0.25)] bg-gradient-to-br from-[#111827] to-[#0B1120] p-5">
      <div className="text-[10px] uppercase tracking-widest text-slate-500">ESG Health</div>
      <div className="mt-2 flex items-end gap-2">
        <span className="text-4xl font-bold text-[#22C55E]">91</span>
        <span className="mb-1 text-sm text-slate-400">Excellent</span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
        <div>
          <div className="text-slate-500">Risk</div>
          <div className="font-semibold text-[#22C55E]">Low</div>
        </div>
        <div>
          <div className="text-slate-500">Confidence</div>
          <div className="font-semibold text-[#06B6D4]">95%</div>
        </div>
        <div className="col-span-2 border-t border-[rgba(59,130,246,0.15)] pt-3">
          <div className="text-slate-500">Prediction next month</div>
          <div className="font-mono text-lg text-white">94</div>
        </div>
      </div>
    </div>
  );
}
