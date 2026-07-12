import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { MapPin, TrendingUp } from "lucide-react";
import { HeatmapPanel } from "@/components/ecosphere/ds/HeatmapPanel";
import { csrHeatmapZones } from "@/data/ecosphere-modules";
import type { EmployeeGamificationState } from "@/lib/ecosphere-employee-store";

const DEPT_DISTRICT: Record<string, string> = {
  HR: "Chennai",
  Manufacturing: "Coimbatore",
  Finance: "Tirunelveli",
  Operations: "Madurai",
  Transport: "Salem",
  IT: "Trichy",
};

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

const HERO_ROW_HEIGHT = 420;

function WebChartCard({
  title,
  icon: Icon,
  children,
  className,
}: {
  title: string;
  icon?: typeof TrendingUp;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex h-full flex-col bg-[var(--bg-card)] ${className ?? ""}`}>
      <div className="mb-3 flex shrink-0 items-center gap-2 px-4 pt-4">
        {Icon && <Icon className="h-4 w-4 text-[oklch(0.50_0.13_230)]" strokeWidth={2} />}
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
          {title}
        </h2>
      </div>
      <div className="min-h-0 flex-1 px-2 pb-3">{children}</div>
    </div>
  );
}

export function EmployeeDashboardViz({
  departmentName,
  state,
}: {
  departmentName?: string;
  state: EmployeeGamificationState;
}) {
  const district = departmentName ? DEPT_DISTRICT[departmentName] ?? "Chennai" : "Chennai";

  const mapZones = useMemo(
    () =>
      csrHeatmapZones.slice(0, 6).map(z => ({
        ...z,
        severity: z.label === district ? ("low" as const) : z.severity,
        value: z.label === district ? Math.max(z.value, 85) : z.value,
      })),
    [district],
  );

  const weeklyXp = useMemo(
    () => [
      { day: "Mon", xp: Math.round(state.xp * 0.08) },
      { day: "Tue", xp: Math.round(state.xp * 0.1) },
      { day: "Wed", xp: Math.round(state.xp * 0.12) },
      { day: "Thu", xp: Math.round(state.xp * 0.09) },
      { day: "Fri", xp: Math.round(state.xp * 0.14) },
      { day: "Sat", xp: Math.round(state.xp * 0.06) },
      { day: "Sun", xp: Math.round(state.xp * 0.05) },
    ],
    [state.xp],
  );

  const activityMix = useMemo(() => {
    const challengeCount = state.challenges.length;
    const csrCount = state.csrActivities.length;
    const other = Math.max(1, Math.round(state.points / 200));
    return [
      { name: "Challenges", value: challengeCount || 2, fill: PIE_COLORS[0] },
      { name: "CSR", value: csrCount || 1, fill: PIE_COLORS[1] },
      { name: "Rewards", value: other, fill: PIE_COLORS[2] },
    ];
  }, [state.challenges.length, state.csrActivities.length, state.points]);

  const deptCompare = useMemo(
    () => [
      { label: "You", xp: state.xp },
      { label: "Dept", xp: Math.round(state.xp * 0.72) },
      { label: "Org", xp: 840 },
    ],
    [state.xp],
  );

  const chartHeight = HERO_ROW_HEIGHT - 56;

  return (
    <div className="space-y-4">
      <section className="eco-card overflow-hidden p-0 shadow-sm">
        <div className="flex items-center gap-2 border-b border-[var(--border)] bg-[var(--bg-card-alt)] px-4 py-3">
          <MapPin className="h-4 w-4 text-[var(--accent-teal)]" />
          <div>
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">CSR & activity map</h2>
            <p className="text-[11px] text-[var(--text-muted)]">
              Tamil Nadu · {departmentName ?? "—"} ({district})
            </p>
          </div>
        </div>

        <div
          className="grid grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]"
          style={{ minHeight: HERO_ROW_HEIGHT }}
        >
          <div className="min-w-0 border-r border-[var(--border)] [&_.eco-heatmap]:rounded-none [&_.eco-heatmap]:border-0">
            <HeatmapPanel
              label="CSR MAP"
              zones={mapZones}
              compact
              height={HERO_ROW_HEIGHT}
              highlightDistrict={district}
              subtitle="CSR participation by district"
            />
          </div>

          <WebChartCard title="Weekly XP" icon={TrendingUp} className="border-l-0">
            <div style={{ height: chartHeight }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyXp} margin={{ top: 8, right: 12, left: 0, bottom: 4 }} barCategoryGap="18%">
                  <CartesianGrid stroke={GRID_STROKE} strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" tick={TICK} axisLine={false} tickLine={false} />
                  <YAxis tick={TICK} axisLine={false} tickLine={false} width={36} />
                  <Tooltip
                    contentStyle={TOOLTIP_STYLE}
                    cursor={{ fill: "oklch(0.50 0.13 230 / 0.06)" }}
                    formatter={(v: number) => [`${v} XP`, "Weekly"]}
                  />
                  <Bar
                    dataKey="xp"
                    fill="oklch(0.48 0.13 155)"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={32}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </WebChartCard>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3">
        <section className="eco-card overflow-hidden p-0">
          <WebChartCard title="Activity mix">
            <div className="h-[148px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={activityMix}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={36}
                    outerRadius={58}
                    paddingAngle={3}
                    stroke="#fff"
                    strokeWidth={2}
                  >
                    {activityMix.map((entry, i) => (
                      <Cell key={entry.name} fill={entry.fill ?? PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </WebChartCard>
        </section>

        <section className="eco-card overflow-hidden p-0">
          <WebChartCard title="XP vs benchmarks">
            <div className="h-[148px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={deptCompare}
                  layout="vertical"
                  margin={{ top: 4, right: 16, left: 4, bottom: 4 }}
                  barCategoryGap="22%"
                >
                  <CartesianGrid stroke={GRID_STROKE} strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tick={TICK} axisLine={false} tickLine={false} />
                  <YAxis
                    type="category"
                    dataKey="label"
                    tick={TICK}
                    width={36}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [`${v} XP`, ""]} />
                  <Bar
                    dataKey="xp"
                    fill="oklch(0.48 0.15 280)"
                    radius={[0, 4, 4, 0]}
                    maxBarSize={22}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </WebChartCard>
        </section>
      </div>
    </div>
  );
}
