import { useEffect, useRef, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { cn } from "@/lib/utils";
import type { TrendSeries } from "@/lib/digital-twin-prediction";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

const TEAL = "#14B8A6";
const AMBER = "#F59E0B";

export type TrendMetric = "energy" | "carbon";

export function TwinTrendChart({
  series,
  metric,
  onMetricChange,
  compact = false,
  className,
}: {
  series: TrendSeries;
  metric: TrendMetric;
  onMetricChange?: (m: TrendMetric) => void;
  compact?: boolean;
  className?: string;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const unit = metric === "energy" ? "kWh" : "kg CO₂";

  const data = {
    labels: series.labels,
    datasets: [
      {
        label: "Actual",
        data: series.actual,
        borderColor: TEAL,
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.3,
        spanGaps: false,
      },
      {
        label: "Predicted",
        data: series.predicted,
        borderColor: AMBER,
        borderDash: [4, 4],
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.3,
        spanGaps: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index" as const, intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border)",
        borderWidth: 1,
        titleColor: "var(--text-primary)",
        bodyColor: "var(--text-secondary)",
        titleFont: { size: 11 },
        bodyFont: { size: 11 },
        callbacks: {
          label: (ctx: { dataset: { label?: string }; parsed: { y: number | null } }) => {
            if (ctx.parsed.y === null) return "";
            return `${ctx.dataset.label}: ${ctx.parsed.y?.toLocaleString()} ${unit}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          font: { size: compact ? 9 : 10 },
          color: "#6B7280",
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: compact ? 6 : 10,
        },
        border: { display: false },
      },
      y: {
        grid: { color: "#E8EAED" },
        ticks: {
          font: { size: compact ? 9 : 10 },
          color: "#6B7280",
        },
        border: { display: false },
      },
    },
  };

  return (
    <div className={cn("flex flex-col", className)}>
      {onMetricChange && (
        <div className="mb-2 flex gap-1">
          {(["energy", "carbon"] as const).map(m => (
            <button
              key={m}
              type="button"
              onClick={() => onMetricChange(m)}
              className={cn(
                "rounded border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider transition",
                metric === m
                  ? "border-[var(--accent-teal)] bg-[var(--accent-teal-bg)] text-[var(--accent-teal)]"
                  : "border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-secondary)]",
              )}
            >
              {m === "energy" ? "Energy" : "Carbon"}
            </button>
          ))}
        </div>
      )}
      <div style={{ height: compact ? 120 : 160, minWidth: 0 }}>
        {mounted ? <Line data={data} options={options} /> : null}
      </div>
      <div className="mt-1.5 flex items-center justify-between text-[10px] text-[var(--text-muted)]">
        <span className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="inline-block h-px w-4 bg-[#14B8A6]" />
            Actual
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-px w-4 border-t border-dashed border-[#F59E0B]" />
            Predicted
          </span>
        </span>
        <span>{unit} / day</span>
      </div>
    </div>
  );
}

/** Hook to keep Chart.js responsive on container resize */
export function useChartResize(ref: React.RefObject<HTMLElement | null>) {
  const [, setTick] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setTick(t => t + 1));
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
}
