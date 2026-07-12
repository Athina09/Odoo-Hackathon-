import type { WeatherContext } from "@/lib/digital-twin-engine";
import { Cloud, Sun, Thermometer } from "lucide-react";

export function WeatherBanner({ weather }: { weather: WeatherContext }) {
  const Icon = weather.condition === "hot" ? Sun : weather.condition === "cloudy" ? Cloud : Sun;
  return (
    <div className="eco-card flex items-center gap-3 p-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg-page)]">
        <Icon className="h-4 w-4 text-[var(--text-secondary)]" strokeWidth={1.5} />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
          <Thermometer className="h-3.5 w-3.5 text-[var(--text-secondary)]" strokeWidth={1.5} />
          {weather.tempC}°C · {weather.humidity}% RH
        </div>
        <div className="mt-0.5 text-xs text-[var(--text-muted)]">{weather.impact}</div>
      </div>
    </div>
  );
}
