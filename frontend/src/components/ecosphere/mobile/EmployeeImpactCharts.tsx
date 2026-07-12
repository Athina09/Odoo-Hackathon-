import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { EmployeeChartData } from "@/lib/employee-impact";

const PIE_COLORS = [
  "oklch(0.48 0.13 155)",
  "oklch(0.48 0.15 280)",
  "oklch(0.62 0.15 75)",
];
const TICK = { fill: "oklch(0.50 0.02 250)", fontSize: 11 };
const GRID_STROKE = "oklch(0.90 0.01 240)";
const TOOLTIP_STYLE = {
  background: "#ffffff",
  border: "1px solid oklch(0.90 0.01 240)",
  borderRadius: "8px",
  fontSize: "12px",
  color: "oklch(0.22 0.025 260)",
  boxShadow: "0 2px 8px oklch(0.22 0.03 260 / 0.08)",
};

function ChartCard({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`eco-card p-3 ${className ?? ""}`}>
      <div className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
        {title}
      </div>
      {children}
    </div>
  );
}

export function EmployeeImpactCharts({ charts }: { charts: EmployeeChartData }) {
  return (
    <aside className="space-y-2">
      <ChartCard title="Your ESG footprint">
        <div className="h-[130px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={charts.esgRadar}>
              <PolarGrid stroke={GRID_STROKE} />
              <PolarAngleAxis dataKey="axis" tick={TICK} />
              <Radar
                dataKey="score"
                stroke="oklch(0.50 0.13 230)"
                fill="oklch(0.50 0.13 230)"
                fillOpacity={0.25}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <ChartCard title="Energy trend · your share">
        <div className="h-[110px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={charts.energyTrend} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
              <CartesianGrid stroke={GRID_STROKE} strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" tick={TICK} axisLine={false} tickLine={false} />
              <YAxis tick={TICK} axisLine={false} tickLine={false} width={36} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Line
                type="monotone"
                dataKey="kwh"
                stroke="oklch(0.50 0.13 230)"
                strokeWidth={2}
                dot={{ fill: "oklch(0.50 0.13 230)", r: 3 }}
                name="Facility kWh"
              />
              <Line
                type="monotone"
                dataKey="yours"
                stroke="oklch(0.48 0.13 155)"
                strokeWidth={2}
                dot={{ fill: "oklch(0.48 0.13 155)", r: 3 }}
                name="Your kWh"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <div className="grid grid-cols-2 gap-2">
        <ChartCard title="Contribution">
          <div className="h-[100px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts.contributionMix}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={22}
                  outerRadius={40}
                  paddingAngle={2}
                >
                  {charts.contributionMix.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={TOOLTIP_STYLE} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Impact health">
          <div className="flex h-[100px] flex-col justify-center">
            <div className="flex items-end gap-1">
              <span className="text-3xl font-bold text-[#2563eb]">{charts.health.score}</span>
              <span className="mb-1 text-[11px] text-[var(--text-muted)]">{charts.health.label}</span>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-1 text-[10px]">
              <div>
                <span className="text-[var(--text-muted)]">Risk </span>
                <span className={charts.health.risk === "Low" ? "font-semibold text-[var(--accent-teal)]" : "font-semibold text-amber-600"}>
                  {charts.health.risk}
                </span>
              </div>
              <div>
                <span className="text-[var(--text-muted)]">Conf </span>
                <span className="font-semibold text-[#2563eb]">{charts.health.confidence}%</span>
              </div>
            </div>
            <p className="mt-1 text-[9px] text-[var(--text-muted)]">
              Next month: {charts.health.prediction}
            </p>
          </div>
        </ChartCard>
      </div>

      <ChartCard title="Facility zones · energy">
        <div className="h-[110px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={charts.zoneEnergy} layout="vertical" margin={{ top: 4, right: 12, left: 4, bottom: 4 }}>
              <CartesianGrid stroke={GRID_STROKE} strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tick={TICK} axisLine={false} tickLine={false} />
              <YAxis
                type="category"
                dataKey="site"
                tick={TICK}
                width={72}
                axisLine={false}
                tickLine={false}
              />
              <Bar dataKey="kwh" fill="oklch(0.66 0.25 25)" radius={[0, 4, 4, 0]} maxBarSize={18} />
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [`${v} kWh`, ""]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <ChartCard title="AI tips for you">
        <div className="space-y-2">
          {charts.recommendations.map(r => (
            <div key={r.id} className="rounded-lg border border-[var(--border)] bg-[var(--bg-page)] p-2.5">
              <p className="text-[11px] font-medium leading-snug text-[var(--text-primary)]">{r.title}</p>
              <div className="mt-1.5 flex flex-wrap gap-1">
                <span className="rounded-md bg-blue-50 px-1.5 py-0.5 text-[9px] font-medium text-blue-700">
                  {r.impact}
                </span>
                <span className="rounded-md bg-[var(--accent-teal-bg)] px-1.5 py-0.5 text-[9px] font-medium text-[var(--accent-teal)]">
                  {r.esgBoost}
                </span>
              </div>
            </div>
          ))}
        </div>
      </ChartCard>
    </aside>
  );
}
