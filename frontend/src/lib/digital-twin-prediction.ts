/** Linear-regression carbon/energy prediction for Digital Twin demos */

export interface TrendSeries {
  labels: string[];
  actual: (number | null)[];
  predicted: (number | null)[];
  confidence: number;
  projectedDeltaPct: number;
}

export function predictNext7Days(values: number[], allowNegative = false): number[] {
  const n = values.length;
  if (n === 0) return Array(7).fill(0);
  const xs = values.map((_, i) => i);
  const xMean = xs.reduce((a, b) => a + b, 0) / n;
  const yMean = values.reduce((a, b) => a + b, 0) / n;
  const denom = xs.reduce((sum, x) => sum + (x - xMean) ** 2, 0);
  const slope =
    denom === 0
      ? 0
      : xs.reduce((sum, x, i) => sum + (x - xMean) * (values[i] - yMean), 0) / denom;
  const intercept = yMean - slope * xMean;
  return Array.from({ length: 7 }, (_, i) => {
    const v = Math.round(intercept + slope * (n + i));
    return allowNegative ? v : Math.max(0, v);
  });
}

/** R² converted to 0–99% confidence for display */
export function regressionConfidence(values: number[]): number {
  const n = values.length;
  if (n < 2) return 50;
  const xs = values.map((_, i) => i);
  const xMean = xs.reduce((a, b) => a + b, 0) / n;
  const yMean = values.reduce((a, b) => a + b, 0) / n;
  const denom = xs.reduce((sum, x) => sum + (x - xMean) ** 2, 0);
  const slope =
    denom === 0
      ? 0
      : xs.reduce((sum, x, i) => sum + (x - xMean) * (values[i] - yMean), 0) / denom;
  const intercept = yMean - slope * xMean;
  const fitted = xs.map(x => intercept + slope * x);
  const ssRes = values.reduce((sum, y, i) => sum + (y - fitted[i]) ** 2, 0);
  const ssTot = values.reduce((sum, y) => sum + (y - yMean) ** 2, 0);
  const r2 = ssTot === 0 ? 1 : 1 - ssRes / ssTot;
  return Math.round(Math.max(55, Math.min(99, r2 * 100)));
}

function dateLabels(): string[] {
  const today = new Date();
  const labels: string[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    labels.push(d.toLocaleDateString("en-US", { month: "short", day: "numeric" }));
  }
  for (let i = 1; i <= 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    labels.push(d.toLocaleDateString("en-US", { month: "short", day: "numeric" }));
  }
  return labels;
}

export function buildTrendSeries(
  historyValues: number[],
  allowNegative = false,
): TrendSeries {
  const labels = dateLabels();
  const predicted = predictNext7Days(historyValues, allowNegative);
  const lastActual = historyValues[historyValues.length - 1] ?? 0;
  const lastPredicted = predicted[predicted.length - 1] ?? lastActual;
  const projectedDeltaPct =
    lastActual > 0 ? Math.round(((lastPredicted - lastActual) / lastActual) * 100) : 0;

  const actual: (number | null)[] = [
    ...historyValues,
    ...Array(7).fill(null),
  ];
  const predictedLine: (number | null)[] = [
    ...Array(14).fill(null),
    ...predicted,
  ];
  // Bridge: last actual point connects to first predicted
  if (actual.length >= 14) {
    predictedLine[13] = lastActual;
  }

  return {
    labels,
    actual,
    predicted: predictedLine,
    confidence: regressionConfidence(historyValues),
    projectedDeltaPct,
  };
}

export function sumSeries(series: number[][]): number[] {
  if (series.length === 0) return [];
  const len = series[0].length;
  return Array.from({ length: len }, (_, i) =>
    series.reduce((sum, s) => sum + (s[i] ?? 0), 0),
  );
}

export function generateFacilityCarbonAiNote(opts: {
  topZoneName: string;
  projectedRisePct: number;
  offsetZoneName: string;
  offsetPct: number;
}): string {
  const { topZoneName, projectedRisePct, offsetZoneName, offsetPct } = opts;
  const direction = projectedRisePct >= 0 ? "rise" : "fall";
  const mag = Math.abs(projectedRisePct);
  return `Facility carbon projected to ${direction} ${mag}% next week, driven by ${topZoneName}'s current trend. Optimization at ${offsetZoneName} could offset roughly ${offsetPct}% of that ${direction === "rise" ? "increase" : "decrease"}.`;
}

export function findTopTrendZone(
  zones: { zoneId: string; name: string; co2Kg: number }[],
  history: Record<string, { co2KgLast14Days: number[] }>,
): { zoneId: string; name: string; slope: number } {
  let best = { zoneId: zones[0]?.zoneId ?? "", name: zones[0]?.name ?? "", slope: 0 };
  for (const z of zones) {
    const series = history[z.zoneId]?.co2KgLast14Days;
    if (!series || series.length < 2) continue;
    const n = series.length;
    const xs = series.map((_, i) => i);
    const xMean = xs.reduce((a, b) => a + b, 0) / n;
    const yMean = series.reduce((a, b) => a + b, 0) / n;
    const denom = xs.reduce((sum, x) => sum + (x - xMean) ** 2, 0);
    const slope =
      denom === 0
        ? 0
        : xs.reduce((sum, x, i) => sum + (x - xMean) * (series[i] - yMean), 0) / denom;
    if (slope > best.slope) best = { zoneId: z.zoneId, name: z.name, slope };
  }
  return best;
}
