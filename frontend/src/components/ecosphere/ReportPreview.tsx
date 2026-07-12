import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  exportReportCsv,
  exportReportExcel,
  exportReportPdf,
  type ReportPreviewData,
  type ReportRow,
} from "@/lib/report-builder";

type ExportFormat = "csv" | "excel" | "pdf";

const TABLE_COLUMNS: { key: keyof ReportRow; label: string }[] = [
  { key: "module", label: "Module" },
  { key: "department", label: "Department" },
  { key: "title", label: "Title" },
  { key: "date", label: "Date" },
  { key: "status", label: "Status" },
];

export function ReportPreview({
  report,
  open,
  onOpenChange,
}: {
  report: ReportPreviewData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [exporting, setExporting] = useState<ExportFormat | null>(null);

  if (!report) return null;

  async function handleExport(format: ExportFormat) {
    if (exporting || report!.rows.length === 0) return;
    setExporting(format);
    try {
      const title = report!.title;
      if (format === "csv") exportReportCsv(report!.rows, title);
      if (format === "excel") await exportReportExcel(report!.rows, title);
      if (format === "pdf") await exportReportPdf(report!.rows, title);
      toast.success("Report exported");
    } catch {
      toast.error("Export failed — please try again");
    } finally {
      setExporting(null);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle className="text-[var(--eco-text-primary)]">{report.title}</SheetTitle>
          <SheetDescription>
            Generated {new Date().toLocaleDateString()} · {report.rows.length} records
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {report.kpis.map(kpi => (
            <div
              key={kpi.label}
              className="rounded-lg border border-[var(--eco-border)] bg-[var(--eco-accent-teal-bg)]/40 p-3"
            >
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--eco-text-secondary)]">
                {kpi.label}
              </p>
              <p className="mt-1 text-xl font-bold text-[var(--eco-text-primary)]">{kpi.value}</p>
              {kpi.subtitle && (
                <p className="mt-0.5 text-[12px] text-[var(--eco-text-muted)]">{kpi.subtitle}</p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 overflow-x-auto rounded-lg border border-[var(--eco-border)]">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="bg-[var(--eco-accent-teal-bg)] text-[11px] font-semibold uppercase tracking-wide text-[var(--eco-text-secondary)]">
              <tr>
                {TABLE_COLUMNS.map(col => (
                  <th key={col.key} className="px-3 py-2">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {report.rows.map(row => (
                <tr key={row.id} className="border-t border-[var(--eco-border)]">
                  {TABLE_COLUMNS.map(col => (
                    <td key={col.key} className="px-3 py-2 text-[var(--eco-text-primary)]">
                      {String(row[col.key] ?? "—")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {(["pdf", "excel", "csv"] as const).map(format => (
            <button
              key={format}
              type="button"
              disabled={exporting !== null}
              onClick={() => handleExport(format)}
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--eco-border)] bg-[var(--eco-accent-teal-bg)] px-4 py-2 text-sm font-medium text-[var(--eco-accent-teal)] transition hover:border-[var(--eco-accent-teal)] disabled:opacity-50"
            >
              {exporting === format ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              Export {format.toUpperCase()}
            </button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
