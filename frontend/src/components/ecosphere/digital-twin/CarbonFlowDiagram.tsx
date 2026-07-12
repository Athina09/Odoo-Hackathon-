export function CarbonFlowDiagram({ nodes }: { nodes: string[] }) {
  return (
    <div className="eco-card overflow-hidden p-4">
      <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
        Carbon Flow
      </div>
      <div className="flex flex-wrap items-center justify-center gap-1 py-2">
        {nodes.map((node, i) => (
          <div key={node} className="flex items-center">
            <div
              className={`rounded-lg px-3 py-2 text-center text-xs font-semibold ${
                node === "Carbon Out"
                  ? "bg-red-500/15 text-[var(--accent-red)]"
                  : node === "Solar"
                    ? "bg-teal-500/15 text-[var(--accent-teal)]"
                    : "bg-[var(--bg-page)] text-[var(--text-primary)]"
              }`}
            >
              {node}
            </div>
            {i < nodes.length - 1 && (
              <div className="dt-flow-arrow mx-1 text-[var(--accent-teal)]">↓</div>
            )}
          </div>
        ))}
      </div>
      <svg className="mx-auto mt-2 h-8 w-full max-w-lg" viewBox="0 0 400 20">
        <line x1="20" y1="10" x2="380" y2="10" stroke="#14B8A6" strokeWidth="2" strokeDasharray="6 4" className="dt-flow-line" />
      </svg>
    </div>
  );
}
