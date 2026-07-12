import { useMemo } from "react";

export function MiniSparkline({
  data,
  width = 72,
  height = 20,
  color = "#94A3B8",
  className,
}: {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}) {
  const path = useMemo(() => {
    if (data.length < 2) return "";
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const step = width / (data.length - 1);
    return data
      .map((v, i) => {
        const x = i * step;
        const y = height - ((v - min) / range) * (height - 2) - 1;
        return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");
  }, [data, width, height]);

  return (
    <svg width={width} height={height} className={className} aria-hidden>
      <path d={path} fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
