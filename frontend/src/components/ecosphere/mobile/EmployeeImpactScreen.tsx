import { useMemo } from "react";
import { Leaf, Zap } from "lucide-react";
import { useEcoAuth } from "@/context/EcoAuthContext";
import { useEmployeeGamification } from "@/context/EmployeeGamificationContext";
import {
  buildEmployeeChartData,
  buildEmployeeImpactView,
  buildImpactNarratives,
} from "@/lib/employee-impact";
import { EmployeeTwinPanel } from "./EmployeeTwinPanel";
import { EmployeeImpactCharts } from "./EmployeeImpactCharts";

export function EmployeeImpactScreen() {
  const { user } = useEcoAuth();
  const { state } = useEmployeeGamification();

  const view = useMemo(() => buildEmployeeImpactView(user, state), [user, state]);
  const charts = useMemo(() => buildEmployeeChartData(view, state), [view, state]);
  const narratives = useMemo(() => buildImpactNarratives(user, view), [user, view]);
  const { personal, facility, impactItems } = view;

  return (
    <div className="space-y-4 p-4 pb-6">
      <div>
        <h1 className="text-xl font-bold text-[var(--text-primary)]">Your impact</h1>
        <p className="text-sm text-[var(--text-muted)]">
          Live digital twin + the difference you make
        </p>
      </div>

      <section className="eco-card border-2 border-[var(--accent-teal)] bg-gradient-to-br from-[var(--accent-teal-bg)] to-white p-4">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--accent-teal)]">
          Live contribution
        </p>
        <div className="mt-2 grid grid-cols-2 gap-3">
          <div>
            <Zap className="h-4 w-4 text-[var(--accent-teal)]" />
            <p className="mt-1 text-[10px] text-[var(--text-secondary)]">Energy saved</p>
            <p className="text-lg font-bold text-[var(--text-primary)]">{personal.energySavedKwh} kWh</p>
          </div>
          <div>
            <Leaf className="h-4 w-4 text-[var(--accent-teal)]" />
            <p className="mt-1 text-[10px] text-[var(--text-secondary)]">CO₂ avoided</p>
            <p className="text-lg font-bold text-[var(--text-primary)]">{personal.co2AvoidedKg} kg</p>
          </div>
        </div>
        <p className="mt-2 text-[11px] text-[var(--text-secondary)]">
          <strong className="text-[var(--accent-teal)]">{facility.employeeSharePct}%</strong> of{" "}
          {facility.facility.name} reduction is linked to your actions
        </p>
      </section>

      {/* Twin + live impact charts side-by-side on wider screens */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1 space-y-2">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
            Digital twin · live floor
          </h2>
          <EmployeeTwinPanel facility={facility} narratives={narratives} />
        </div>

        <div className="w-full shrink-0 lg:w-[min(100%,340px)]">
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
            Your live impact
          </h2>
          <EmployeeImpactCharts charts={charts} />
        </div>
      </div>

      <section className="eco-card p-4">
        <h2 className="mb-3 text-sm font-semibold text-[var(--text-primary)]">What you did</h2>
        {impactItems.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)]">
            Join a challenge or CSR activity to start building your impact story.
          </p>
        ) : (
          <ul className="space-y-2">
            {impactItems.map(item => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-2 rounded-lg bg-[var(--bg-page)] px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-[var(--text-primary)]">{item.title}</p>
                  <p className="text-[11px] text-[var(--text-muted)]">{item.detail}</p>
                </div>
                <span className="shrink-0 text-sm font-bold text-[var(--accent-teal)]">+{item.kwh} kWh</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
