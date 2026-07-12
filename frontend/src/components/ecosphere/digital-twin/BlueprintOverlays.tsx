import { FACILITY_WALLS } from "@/lib/digital-twin-blueprint";

export function BlueprintWallsOverlay({ facilityId }: { facilityId: string }) {
  const walls = FACILITY_WALLS[facilityId] ?? [];
  if (walls.length === 0) return null;

  return (
    <svg className="pointer-events-none absolute inset-0 z-[12]" aria-hidden>
      {walls.map((w, i) => (
        <line
          key={i}
          x1={`${w.x1}%`}
          y1={`${w.y1}%`}
          x2={`${w.x2}%`}
          y2={`${w.y2}%`}
          stroke="rgba(96, 165, 250, 0.28)"
          strokeWidth={w.thick ? 2.5 : 1.5}
          strokeLinecap="square"
        />
      ))}
    </svg>
  );
}

export function BlueprintCoordinateLabels({
  columns,
  rows,
}: {
  columns: number;
  rows: number;
}) {
  const colLabels = Array.from({ length: columns }, (_, i) => String.fromCharCode(65 + i));
  const rowLabels = Array.from({ length: rows }, (_, i) => String(i + 1));

  return (
    <>
      <div className="pointer-events-none absolute left-0 top-0 z-[18] flex h-full w-5 flex-col justify-around py-10 pl-0.5">
        {rowLabels.map(r => (
          <span key={r} className="font-mono text-[8px] text-[rgba(96,165,250,0.35)]">
            {r}
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute bottom-1 left-6 right-2 z-[18] flex justify-around">
        {colLabels.map(c => (
          <span key={c} className="font-mono text-[8px] text-[rgba(96,165,250,0.35)]">
            {c}
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute left-7 top-2 z-[18] font-mono text-[7px] text-[rgba(96,165,250,0.28)]">
        {colLabels[0]}
        {rowLabels[0]}
      </div>
    </>
  );
}
