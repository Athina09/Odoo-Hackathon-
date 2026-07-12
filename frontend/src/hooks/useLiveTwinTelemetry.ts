import { useCallback, useEffect, useRef, useState } from "react";
import type { ZoneTelemetry } from "@/lib/digital-twin-engine";
import { regressionConfidence, predictNext7Days } from "@/lib/digital-twin-prediction";

const TICK_MS = 5000;
const SPARKLINE_LEN = 7;

export interface LiveZoneState extends ZoneTelemetry {
  forecastConfidence: number;
  pulsing: { pwr: boolean; co2: boolean };
}

function forecastFromHistory(history: number[]): { deltaPct: number; confidence: number } {
  if (history.length < 2) return { deltaPct: 0, confidence: 82 };
  const predicted = predictNext7Days(history);
  const last = history[history.length - 1];
  const lastPred = predicted[predicted.length - 1] ?? last;
  const deltaPct = last > 0 ? Math.round(((lastPred - last) / last) * 100) : 0;
  return { deltaPct, confidence: regressionConfidence(history) };
}

function initLiveZone(zone: ZoneTelemetry): LiveZoneState {
  const { deltaPct, confidence } = forecastFromHistory(zone.sparkline);
  return {
    ...zone,
    carbonForecastDelta: deltaPct,
    forecastConfidence: confidence,
    pulsing: { pwr: false, co2: false },
  };
}

function tickZone(prev: LiveZoneState): LiveZoneState {
  const pwrDelta = (Math.random() - 0.5) * 0.04;
  const co2Delta = (Math.random() - 0.5) * 0.04;
  const newPwr = Math.max(0, Math.round(prev.energyKwh * (1 + pwrDelta)));
  const newCo2Kg = Math.max(0, Math.round(prev.co2Kg * (1 + co2Delta)));
  const sparkline = [...prev.sparkline.slice(-(SPARKLINE_LEN - 1)), newPwr];
  const { deltaPct, confidence } = forecastFromHistory(sparkline);

  return {
    ...prev,
    energyKwh: newPwr,
    co2Kg: newCo2Kg,
    co2Tonnes: newCo2Kg / 1000,
    sparkline,
    carbonForecastDelta: deltaPct,
    forecastConfidence: confidence,
    pulsing: { pwr: true, co2: true },
  };
}

/** Batched live telemetry tick — pauses during time-travel simulation */
export function useLiveTwinTelemetry(
  baseZones: ZoneTelemetry[],
  paused: boolean,
): LiveZoneState[] {
  const zonesKey = baseZones.map(z => `${z.zoneId}:${z.energyKwh}:${z.co2Kg}:${z.status}`).join("|");
  const [liveZones, setLiveZones] = useState<LiveZoneState[]>(() => baseZones.map(initLiveZone));
  const pulseTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  useEffect(() => {
    setLiveZones(baseZones.map(initLiveZone));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset only when zone telemetry identity changes
  }, [zonesKey]);

  const clearPulse = useCallback((zoneId: string) => {
    const t = pulseTimers.current.get(zoneId);
    if (t) clearTimeout(t);
    pulseTimers.current.set(
      zoneId,
      setTimeout(() => {
        setLiveZones(prev =>
          prev.map(z => (z.zoneId === zoneId ? { ...z, pulsing: { pwr: false, co2: false } } : z)),
        );
        pulseTimers.current.delete(zoneId);
      }, 200),
    );
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setLiveZones(prev => {
        const next = prev.map(tickZone);
        next.forEach(z => clearPulse(z.zoneId));
        return next;
      });
    }, TICK_MS);
    return () => clearInterval(id);
  }, [paused, clearPulse]);

  useEffect(() => {
    return () => {
      pulseTimers.current.forEach(t => clearTimeout(t));
      pulseTimers.current.clear();
    };
  }, []);

  return liveZones;
}

export function computeSparklineForecast(history: number[]) {
  return forecastFromHistory(history);
}
