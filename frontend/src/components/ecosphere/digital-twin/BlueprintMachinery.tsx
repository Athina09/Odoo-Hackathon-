import type { ZoneArchetype } from "@/lib/digital-twin-blueprint";

const STROKE = "rgba(96, 165, 250, 0.42)";
const FILL = "rgba(59, 130, 246, 0.12)";

export function BlueprintMachinery({ archetype }: { archetype: ZoneArchetype }) {
  switch (archetype) {
    case "production":
      return (
        <svg viewBox="0 0 120 48" className="h-full w-full opacity-80" aria-hidden>
          <rect x="4" y="8" width="28" height="18" fill={FILL} stroke={STROKE} strokeWidth="0.6" />
          <rect x="38" y="8" width="28" height="18" fill={FILL} stroke={STROKE} strokeWidth="0.6" />
          <rect x="72" y="8" width="28" height="18" fill={FILL} stroke={STROKE} strokeWidth="0.6" />
          <line x1="2" y1="34" x2="118" y2="34" stroke={STROKE} strokeWidth="0.8" strokeDasharray="3 2" />
          <text x="60" y="44" textAnchor="middle" fill="rgba(148,163,184,0.5)" fontSize="5" fontFamily="monospace">
            CONVEYOR
          </text>
        </svg>
      );
    case "assembly":
      return (
        <svg viewBox="0 0 100 40" className="h-full w-full opacity-80" aria-hidden>
          <rect x="8" y="6" width="22" height="22" fill={FILL} stroke={STROKE} strokeWidth="0.6" />
          <rect x="38" y="10" width="18" height="18" fill={FILL} stroke={STROKE} strokeWidth="0.6" />
          <rect x="62" y="6" width="22" height="22" fill={FILL} stroke={STROKE} strokeWidth="0.6" />
          <line x1="4" y1="32" x2="96" y2="32" stroke={STROKE} strokeWidth="0.6" />
        </svg>
      );
    case "warehouse":
    case "cold":
      return (
        <svg viewBox="0 0 80 56" className="h-full w-full opacity-75" aria-hidden>
          {Array.from({ length: 12 }).map((_, i) => {
            const col = i % 4;
            const row = Math.floor(i / 4);
            return (
              <rect
                key={i}
                x={6 + col * 18}
                y={6 + row * 16}
                width="14"
                height="12"
                fill={FILL}
                stroke={STROKE}
                strokeWidth="0.5"
              />
            );
          })}
        </svg>
      );
    case "office":
      return (
        <svg viewBox="0 0 72 40" className="h-full w-full opacity-75" aria-hidden>
          {Array.from({ length: 6 }).map((_, i) => {
            const col = i % 3;
            const row = Math.floor(i / 3);
            return (
              <rect
                key={i}
                x={8 + col * 20}
                y={6 + row * 16}
                width="14"
                height="10"
                fill="none"
                stroke={STROKE}
                strokeWidth="0.6"
              />
            );
          })}
        </svg>
      );
    case "generator":
    case "electrical":
      return (
        <svg viewBox="0 0 48 56" className="h-full w-full opacity-85" aria-hidden>
          <rect x="10" y="6" width="28" height="40" fill={FILL} stroke={STROKE} strokeWidth="0.8" />
          <line x1="14" y1="14" x2="34" y2="14" stroke={STROKE} strokeWidth="0.5" />
          <line x1="14" y1="22" x2="34" y2="22" stroke={STROKE} strokeWidth="0.5" />
          <line x1="14" y1="30" x2="34" y2="30" stroke={STROKE} strokeWidth="0.5" />
          <circle cx="24" cy="42" r="3" fill="none" stroke={STROKE} strokeWidth="0.6" />
        </svg>
      );
    case "server":
      return (
        <svg viewBox="0 0 80 48" className="h-full w-full opacity-80" aria-hidden>
          {Array.from({ length: 5 }).map((_, i) => (
            <rect
              key={i}
              x="8"
              y={6 + i * 8}
              width="64"
              height="6"
              fill={FILL}
              stroke={STROKE}
              strokeWidth="0.5"
            />
          ))}
        </svg>
      );
    case "loading":
    case "fleet":
      return (
        <svg viewBox="0 0 100 40" className="h-full w-full opacity-80" aria-hidden>
          <rect x="6" y="14" width="36" height="16" fill={FILL} stroke={STROKE} strokeWidth="0.6" />
          <rect x="48" y="14" width="36" height="16" fill={FILL} stroke={STROKE} strokeWidth="0.6" />
          <line x1="4" y1="34" x2="96" y2="34" stroke={STROKE} strokeWidth="0.6" strokeDasharray="4 2" />
        </svg>
      );
    case "solar":
      return (
        <svg viewBox="0 0 80 40" className="h-full w-full opacity-70" aria-hidden>
          {Array.from({ length: 4 }).map((_, i) => (
            <rect
              key={i}
              x={6 + i * 18}
              y="10"
              width="14"
              height="20"
              fill="rgba(59, 130, 246, 0.12)"
              stroke="rgba(96, 165, 250, 0.4)"
              strokeWidth="0.5"
            />
          ))}
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 60 32" className="h-full w-full opacity-60" aria-hidden>
          <rect x="8" y="8" width="44" height="16" fill="none" stroke={STROKE} strokeWidth="0.6" strokeDasharray="2 2" />
        </svg>
      );
  }
}
