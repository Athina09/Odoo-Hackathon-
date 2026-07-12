import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import type { TwinPrediction } from "@/lib/digital-twin-engine";

export function CarbonForecastChart({ prediction }: { prediction: TwinPrediction }) {
  return (
    <div className="eco-card p-4">
      <div className="mb-2 text-xs font-semibold uppercase tracking-[0.05em] text-[var(--text-secondary)]">
        Carbon Forecast Model
      </div>
      <div className="h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={prediction.forecast}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: "var(--text-secondary)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "var(--text-secondary)" }}
              axisLine={false}
              tickLine={false}
              width={32}
              domain={["auto", "auto"]}
            />
            <Tooltip
              contentStyle={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                fontSize: 12,
              }}
            />
            <ReferenceLine y={prediction.currentCarbonT} stroke="var(--accent-teal)" strokeDasharray="3 3" strokeOpacity={0.6} />
            <Line
              type="monotone"
              dataKey="carbonT"
              stroke="var(--text-secondary)"
              strokeWidth={1.5}
              dot={{ r: 3, fill: "var(--text-secondary)", strokeWidth: 0 }}
              activeDot={{ r: 4, fill: "var(--accent-teal)" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-1 flex items-center justify-between text-xs text-[var(--text-muted)]">
        <span>Confidence {prediction.confidence}%</span>
        <span style={{ color: prediction.carbonForecastDelta > 0 ? "var(--accent-amber)" : "var(--accent-green)" }}>
          Forecast {prediction.carbonForecastDelta >= 0 ? "▲" : "▼"} {Math.abs(prediction.carbonForecastDelta)}%
        </span>
      </div>
    </div>
  );
}
