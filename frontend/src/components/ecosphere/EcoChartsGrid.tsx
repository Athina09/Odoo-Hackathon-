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

const PIE_COLORS = ["oklch(0.50 0.13 230)", "oklch(0.48 0.15 280)", "oklch(0.62 0.15 75)", "oklch(0.55 0.22 25)", "oklch(0.48 0.13 155)"];

const tickFill = "oklch(0.50 0.02 250)";

const tooltipStyle = {
  background: "#ffffff",
  border: "1px solid oklch(0.90 0.01 240)",
  borderRadius: "8px",
  fontSize: "12px",
  color: "oklch(0.22 0.025 260)",
  boxShadow: "0 2px 8px oklch(0.22 0.03 260 / 0.08)",
};

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-xl p-4">
      <div className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">{title}</div>
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
            <PolarGrid stroke="oklch(0.90 0.01 240)" />
            <PolarAngleAxis dataKey="axis" tick={{ fill: tickFill, fontSize: 11 }} />
            <Radar dataKey="score" stroke="oklch(0.50 0.13 230)" fill="oklch(0.50 0.13 230)" fillOpacity={0.25} />
          </RadarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Carbon Trend">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={carbonTrend}>
            <XAxis dataKey="month" tick={{ fill: tickFill, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: tickFill, fontSize: 11 }} axisLine={false} tickLine={false} width={32} />
            <Tooltip contentStyle={tooltipStyle} />
            <Line type="monotone" dataKey="tco2" stroke="oklch(0.50 0.13 230)" strokeWidth={2} dot={{ fill: "oklch(0.50 0.13 230)", r: 3 }} />
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
            <Tooltip contentStyle={tooltipStyle} />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Top Carbon Emitters">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={topEmitters} layout="vertical" margin={{ left: 8 }}>
            <XAxis type="number" tick={{ fill: tickFill, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="site" tick={{ fill: tickFill, fontSize: 10 }} width={90} axisLine={false} tickLine={false} />
            <Bar dataKey="tco2" fill="oklch(0.66 0.25 25)" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="glass rounded-xl p-4 md:col-span-1 xl:col-span-2">
        <div className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">AI Recommendations</div>
        <div className="grid gap-3 sm:grid-cols-2">
          {aiRecommendations.map(r => (
            <div
              key={r.id}
              className="rounded-lg border border-border bg-white p-4 transition hover:border-primary/30 hover:bg-primary/5"
            >
              <div className="text-base font-medium">{r.title}</div>
              <div className="mt-2 flex flex-wrap gap-2 text-sm">
                <span className="rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 text-primary">{r.impact}</span>
                <span className="rounded-md border border-success/30 bg-success/10 px-2 py-0.5 text-success">{r.esgBoost}</span>
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
    <div className="glass rounded-xl p-5">
      <div className="text-xs uppercase tracking-widest text-muted-foreground">ESG Health</div>
      <div className="mt-2 flex items-end gap-2">
        <span className="font-mono text-5xl font-semibold text-primary">91</span>
        <span className="mb-1 text-base text-muted-foreground">Excellent</span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <div className="text-muted-foreground">Risk</div>
          <div className="font-semibold text-success">Low</div>
        </div>
        <div>
          <div className="text-muted-foreground">Confidence</div>
          <div className="font-semibold text-neon-2">95%</div>
        </div>
        <div className="col-span-2 border-t border-border/40 pt-3">
          <div className="text-muted-foreground">Prediction next month</div>
          <div className="font-mono text-lg">94</div>
        </div>
      </div>
    </div>
  );
}
