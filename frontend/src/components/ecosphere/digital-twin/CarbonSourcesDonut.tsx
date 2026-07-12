import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import type { TwinPrediction } from "@/lib/digital-twin-engine";

const INDUSTRIAL_COLORS = ["#64748B", "#94A3B8", "#475569", "#CBD5E1", "#334155"];

export function CarbonSourcesDonut({ prediction }: { prediction: TwinPrediction }) {
  return (
    <div className="eco-card p-4">
      <div className="mb-2 text-xs font-semibold uppercase tracking-[0.05em] text-[var(--text-secondary)]">
        Emission Sources
      </div>
      <div className="h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={prediction.sources}
              dataKey="pct"
              nameKey="name"
              innerRadius={48}
              outerRadius={72}
              paddingAngle={1}
              stroke="var(--bg-card)"
              strokeWidth={2}
            >
              {prediction.sources.map((s, i) => (
                <Cell key={s.name} fill={INDUSTRIAL_COLORS[i % INDUSTRIAL_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(v: number) => `${v}%`}
              contentStyle={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                fontSize: 12,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-1">
        {prediction.sources.map((s, i) => (
          <div key={s.name} className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: INDUSTRIAL_COLORS[i % INDUSTRIAL_COLORS.length] }}
            />
            <span>{s.name}</span>
            <span className="ml-auto text-[var(--text-muted)]">{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
