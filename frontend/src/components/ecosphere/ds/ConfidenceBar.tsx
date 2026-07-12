export function ConfidenceBar({ value }: { value: number }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="flex items-center gap-2">
      <div className="h-1 w-20 overflow-hidden rounded bg-[var(--eco-bg-page)]">
        <div
          className="h-full rounded bg-[var(--eco-accent-teal)]"
          style={{ width: `${clamped}%` }}
        />
      </div>
      <span className="text-sm font-medium text-[var(--eco-text-primary)]">{clamped}%</span>
    </div>
  );
}
