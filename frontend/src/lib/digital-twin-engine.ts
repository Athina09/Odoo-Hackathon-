import type {
  DigitalTwinFacility,
  DigitalTwinZone,
  ZoneStatus,
} from "@/data/digital-twin";
import { deriveZoneStatus } from "@/data/digital-twin";
import { getFacilityCo2History } from "@/data/digital-twin";
import { regressionConfidence, predictNext7Days } from "@/lib/digital-twin-prediction";
import { sensorBadgeFor, type SensorBadge } from "@/lib/digital-twin-industrial";

export interface TwinSimulation {
  timeOffsetHours: number;
  generatorUsagePct: number;
  solarKwh: number;
}

export interface ZoneTelemetry extends DigitalTwinZone {
  temperatureC: number;
  waterLiters: number;
  efficiencyPct: number;
  utilizationPct: number;
  co2Tonnes: number;
  workers: number;
  predictedStatus: ZoneStatus;
  carbonDeltaPct: number;
  carbonForecastDelta: number;
  sensorBadge: SensorBadge;
  sparkline: number[];
  machines: ZoneMachine[];
}

export interface ZoneMachine {
  id: string;
  name: string;
  efficiency: number;
  carbonKg: number;
  status: ZoneStatus;
  temperatureC: number;
}

export interface CarbonSource {
  name: string;
  pct: number;
  kg: number;
  color: string;
}

export interface ForecastPoint {
  label: string;
  carbonT: number;
  isNow?: boolean;
}

export interface TwinPrediction {
  currentCarbonT: number;
  predictedCarbonT: number;
  predicted2h: number;
  predicted6h: number;
  predicted24h: number;
  carbonForecastDelta: number;
  deltaPct: number;
  confidence: number;
  horizonHours: number;
  facilityHealth: number;
  forecast: ForecastPoint[];
  sources: CarbonSource[];
  esgNow: number;
  esgPredicted: number;
  esgReason: string;
  recommendation: {
    title: string;
    action: string;
    saveTco2: number;
    esgBoost: number;
    bullets: string[];
    expectedReductionPct: number;
  };
  rootCause: string[];
  factors: string[];
}

export interface TimelineEvent {
  time: string;
  label: string;
  type: "info" | "alert" | "ai" | "action";
}

export interface SensorFeedItem {
  time: string;
  source: string;
  metric: string;
  value: string;
  alert?: boolean;
}

export interface WeatherContext {
  tempC: number;
  humidity: number;
  condition: "sunny" | "cloudy" | "hot";
  impact: string;
}

export const DEFAULT_SIMULATION = (facility: DigitalTwinFacility): TwinSimulation => ({
  timeOffsetHours: 0,
  generatorUsagePct: 100,
  solarKwh: facility.solarOffsetKwh,
});

const MACHINE_TEMPLATES: Record<string, string[]> = {
  "Production Line 1": ["CNC Unit A", "CNC Unit B", "Spindle Motor C", "Conveyor D"],
  "Production Line 2": ["Press A", "Press B", "Welder C", "QC Station D"],
  "Assembly Floor": ["Pneumatic Bay A", "Pneumatic Bay B", "Assembly C"],
  "Generator Room": ["Diesel Gen #1", "Backup Gen #2"],
};

function buildSparkline(base: number): number[] {
  return [0.72, 0.78, 0.81, 0.85, 0.88, 0.92, 1.0].map(m => Math.round(base * m));
}

function buildMachines(zone: DigitalTwinZone): ZoneMachine[] {
  const names = MACHINE_TEMPLATES[zone.name];
  if (!names) return [];
  const share = zone.co2Kg / names.length;
  return names.map((name, i) => ({
    id: `${zone.zoneId}-m${i}`,
    name,
    efficiency: Math.round(68 + (zone.uptimePct % 25)),
    carbonKg: Math.round(Math.max(0, share)),
    status: i === 0 && zone.status === "critical" ? "critical" : zone.status,
    temperatureC: Math.round(28 + zone.energyKwh / 200 + i * 2),
  }));
}

export function getWeather(facilityId: string): WeatherContext {
  const hot = facilityId === "FAC001" || facilityId === "FAC004";
  return {
    tempC: hot ? 36 : 31,
    humidity: hot ? 68 : 55,
    condition: hot ? "hot" : "sunny",
    impact: hot
      ? "High temperature → cooling demand ↑ → carbon ↑"
      : "Moderate conditions — HVAC within normal band",
  };
}

function applySimulationToZone(
  zone: DigitalTwinZone,
  sim: TwinSimulation,
  weather: WeatherContext,
): DigitalTwinZone {
  let energy = zone.energyKwh;
  let co2 = zone.co2Kg;

  if (zone.name.includes("Generator")) {
    const factor = sim.generatorUsagePct / 100;
    energy = zone.energyBaselineKwh + (zone.energyKwh - zone.energyBaselineKwh) * factor;
    co2 = zone.co2Kg * factor;
  }

  if (zone.name.includes("Solar") || zone.co2Kg < 0) {
    co2 = -(sim.solarKwh * 0.49);
    energy = -sim.solarKwh;
  }

  const timeFactor = 1 + sim.timeOffsetHours * 0.012;
  const heatFactor = 1 + (weather.tempC - 30) * 0.008;
  energy *= timeFactor * heatFactor;
  co2 = Math.max(-500, co2 * timeFactor * heatFactor);

  if (sim.solarKwh > 120 && zone.co2Kg > 0) {
    co2 -= (sim.solarKwh - 120) * 0.004;
  }

  return {
    ...zone,
    energyKwh: Math.round(energy),
    co2Kg: Math.round(co2),
    status: deriveZoneStatus(energy, zone.energyBaselineKwh),
  };
}

export function enrichZoneTelemetry(
  zone: DigitalTwinZone,
  sim: TwinSimulation,
  weather: WeatherContext,
): ZoneTelemetry {
  const adjusted = applySimulationToZone(zone, sim, weather);
  const ratio = adjusted.energyBaselineKwh > 0 ? adjusted.energyKwh / adjusted.energyBaselineKwh : 1;
  const futureRatio = ratio * (1 + sim.timeOffsetHours * 0.015);
  const predictedStatus = deriveZoneStatus(
    adjusted.energyBaselineKwh * futureRatio,
    adjusted.energyBaselineKwh,
  );
  const carbonDeltaPct = Math.round((futureRatio - 1) * 100);
  const utilizationPct = Math.round(Math.min(99, Math.max(35, 72 + (ratio - 1) * 40)));
  const carbonForecastDelta = Math.round(carbonDeltaPct * 0.85 + sim.timeOffsetHours * 2);

  return {
    ...adjusted,
    temperatureC: Math.round(24 + weather.tempC * 0.15 + adjusted.energyKwh / 180),
    waterLiters: Math.round(80 + adjusted.energyKwh / 14 + (zone.name.includes("Production") ? 60 : 0)),
    efficiencyPct: Math.round(Math.min(98, Math.max(42, 100 - (ratio - 1) * 80))),
    utilizationPct,
    co2Tonnes: adjusted.co2Kg / 1000,
    workers: adjusted.occupancy,
    predictedStatus,
    carbonDeltaPct,
    carbonForecastDelta,
    sensorBadge: sensorBadgeFor(adjusted.status, adjusted.uptimePct),
    sparkline: buildSparkline(adjusted.energyKwh),
    machines: buildMachines(adjusted),
  };
}

export function computeTwinState(
  facility: DigitalTwinFacility,
  zones: DigitalTwinZone[],
  sim: TwinSimulation,
) {
  const weather = getWeather(facility.id);
  const telemetry = zones.map(z => enrichZoneTelemetry(z, sim, weather));

  const grossCo2Kg = telemetry.reduce((s, z) => s + Math.max(0, z.co2Kg), 0);
  const solarOffset = sim.solarKwh * 0.49;
  const currentCarbonT = (grossCo2Kg - solarOffset) / 1000;
  const horizon = Math.max(1, 4 - sim.timeOffsetHours * 0.1);
  const predictedCarbonT = currentCarbonT * (1 + sim.timeOffsetHours * 0.018 + (100 - sim.generatorUsagePct) * -0.002);
  const deltaPct = currentCarbonT > 0 ? Math.round(((predictedCarbonT - currentCarbonT) / currentCarbonT) * 100) : 0;
  const facilityHealth = Math.round(Math.min(99, Math.max(58, 92 - Math.max(0, deltaPct) * 0.8 - (100 - sim.generatorUsagePct) * 0.05)));

  const genZone = telemetry.find(z => z.name.includes("Generator"));
  const genShare = genZone ? genZone.co2Kg / grossCo2Kg : 0;

  const sources: CarbonSource[] = [
    { name: "Generator", pct: 42, kg: grossCo2Kg * 0.42, color: "#EF4444" },
    { name: "Production", pct: 33, kg: grossCo2Kg * 0.33, color: "#8B5CF6" },
    { name: "Warehouse", pct: 12, kg: grossCo2Kg * 0.12, color: "#F59E0B" },
    { name: "Office", pct: 7, kg: grossCo2Kg * 0.07, color: "#14B8A6" },
    { name: "Transport", pct: 6, kg: grossCo2Kg * 0.06, color: "#3B82F6" },
  ];

  const forecast: ForecastPoint[] = [
    { label: "Now", carbonT: currentCarbonT, isNow: true },
    { label: "2PM", carbonT: currentCarbonT * 1.04 },
    { label: "4PM", carbonT: currentCarbonT * 1.12 },
    { label: "6PM", carbonT: currentCarbonT * 1.18 },
    { label: "Tomorrow", carbonT: currentCarbonT * 1.22 },
  ].map(p => ({ ...p, carbonT: Math.round(p.carbonT * 100) / 100 }));

  const esgNow = Math.round(89 - (currentCarbonT - 3) * 4);
  const esgPredicted = Math.round(esgNow - Math.max(0, deltaPct) * 0.15);

  const facilityCo2History = getFacilityCo2History(facility.id);
  const regressionConf = regressionConfidence(facilityCo2History);
  const predicted7d = predictNext7Days(facilityCo2History);
  const lastHist = facilityCo2History[facilityCo2History.length - 1] ?? 0;
  const lastPred = predicted7d[predicted7d.length - 1] ?? lastHist;
  const regressionDeltaPct =
    lastHist > 0 ? Math.round(((lastPred - lastHist) / lastHist) * 100) : 0;

  const prediction: TwinPrediction = {
    currentCarbonT: Math.round(currentCarbonT * 100) / 100,
    predictedCarbonT: Math.round(predictedCarbonT * 100) / 100,
    predicted2h: Math.round(currentCarbonT * (1 + 0.04 + sim.timeOffsetHours * 0.006) * 100) / 100,
    predicted6h: Math.round(currentCarbonT * (1 + 0.12 + sim.timeOffsetHours * 0.01) * 100) / 100,
    predicted24h: Math.round((lastPred / 1000) * 100) / 100,
    carbonForecastDelta: regressionDeltaPct,
    deltaPct,
    confidence: regressionConf,
    horizonHours: 4,
    facilityHealth,
    forecast,
    sources,
    esgNow: Math.min(99, Math.max(62, esgNow)),
    esgPredicted: Math.min(99, Math.max(60, esgPredicted)),
    esgReason: genShare > 0.35 ? "Generator + Transport load" : "Production + cooling demand",
    recommendation: {
      title: "Switch Generator to Grid",
      action: "Generator emits 62% of today's carbon — shift load to grid during solar peak",
      saveTco2: Math.round((genZone?.co2Kg ?? 800) * (1 - sim.generatorUsagePct / 100) / 1000 * 10) / 10,
      esgBoost: 5,
      bullets: [
        "Reduce Generator Runtime to 60%",
        "Shift Heavy Production to Solar Peak (11:00–14:00)",
        "Delay Batch B by 45 minutes",
      ],
      expectedReductionPct: Math.round(18 * (sim.generatorUsagePct / 100)),
    },
    rootCause: ["Generator", "Diesel", "Backup", "Power Failure", "Emission"],
    factors: ["Production Line 1", "Generator", "High Cooling Load"],
  };

  const timeline: TimelineEvent[] = [
    { time: "08:00", label: "Generator Started", type: "alert" },
    { time: "09:10", label: "Power Spike — Line 1", type: "alert" },
    { time: "10:15", label: "Carbon Increased +12%", type: "info" },
    { time: "11:20", label: "AI: Switch to grid recommended", type: "ai" },
    { time: "12:00", label: "Operator Accepted — partial", type: "action" },
  ];

  const feed: SensorFeedItem[] = [
    { time: "11:41", source: "Machine 2", metric: "Temperature", value: "34°C" },
    { time: "11:42", source: "Generator", metric: "Fuel", value: "42 L", alert: true },
    { time: "11:43", source: "Facility", metric: "CO₂", value: "+18 kg", alert: true },
    { time: "11:45", source: "AI", metric: "Spike Detected", value: "Line 1", alert: true },
    { time: "11:48", source: "Solar", metric: "Generation", value: `${sim.solarKwh} kWh` },
    { time: "11:50", source: "Office", metric: "HVAC", value: "Low load" },
  ];

  const flowNodes = ["Solar", "Battery", "Production", "Warehouse", "Shipping", "Carbon Out"];

  return { weather, telemetry, prediction, timeline, feed, flowNodes, currentCarbonT, predictedCarbonT };
}

export function timeLabel(hours: number): string {
  if (hours === 0) return "Now";
  if (hours < 0) return `${Math.abs(hours)}h ago`;
  if (hours <= 24) return `+${hours}h`;
  return "Tomorrow";
}

export function predictedStatusAtOffset(
  current: ZoneStatus,
  offsetHours: number,
): ZoneStatus {
  if (offsetHours <= 0) return current;
  if (offsetHours >= 4 && current === "watch") return "critical";
  if (offsetHours >= 2 && current === "normal") return "watch";
  if (offsetHours >= 4 && current === "watch") return "critical";
  return current;
}
