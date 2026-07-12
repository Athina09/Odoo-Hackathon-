import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

export interface DataTableColumn<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  align?: "left" | "right";
}

export function DataTable<T extends { id: string }>({
  title,
  subtitle,
  columns,
  rows,
  onOpen,
}: {
  title: string;
  subtitle?: string;
  columns: DataTableColumn<T>[];
  rows: T[];
  onOpen?: (row: T) => void;
}) {
  return (
    <div className="eco-card overflow-hidden">
      <div className="eco-card-header flex items-center justify-between px-4 py-3">
        <div className="text-xs font-semibold uppercase tracking-[0.05em] text-[var(--eco-text-secondary)]">
          {title}
        </div>
        {subtitle && <div className="text-xs text-[var(--eco-text-muted)]">{subtitle}</div>}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--eco-border)] bg-[var(--eco-bg-card-alt)] text-left">
              {columns.map(col => (
                <th
                  key={col.key}
                  className={`px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.05em] text-[var(--eco-text-secondary)] ${
                    col.align === "right" ? "text-right" : ""
                  }`}
                >
                  {col.header}
                </th>
              ))}
              {onOpen && <th className="px-4 py-2.5" />}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--eco-border)]">
            {rows.map(row => (
              <tr key={row.id} className="group transition hover:bg-[var(--eco-accent-teal-bg)]/40">
                {columns.map(col => (
                  <td
                    key={col.key}
                    className={`px-4 py-3 text-sm font-medium text-[var(--eco-text-primary)] ${
                      col.align === "right" ? "text-right" : ""
                    }`}
                  >
                    {col.render(row)}
                  </td>
                ))}
                {onOpen && (
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => onOpen(row)}
                      className="inline-flex items-center gap-1 rounded-full border border-[var(--eco-border)] bg-[var(--eco-bg-page)] px-2.5 py-1 text-xs font-medium text-[var(--eco-text-secondary)] transition group-hover:border-[var(--eco-accent-teal)] group-hover:text-[var(--eco-accent-teal)]"
                    >
                      Open <ChevronRight className="h-3 w-3" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
