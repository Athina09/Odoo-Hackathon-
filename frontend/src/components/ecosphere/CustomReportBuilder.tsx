import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  buildReport,
  countModules,
  DEFAULT_REPORT_FILTERS,
  exportReportCsv,
  exportReportExcel,
  exportReportPdf,
  getReportFilterOptions,
  isChallengeFilterEnabled,
  isEmployeeFilterEnabled,
  type ReportFilters,
  type ReportRow,
} from "@/lib/report-builder";

type ExportFormat = "csv" | "excel" | "pdf";

const PREVIEW_COLUMNS: { key: keyof ReportRow; label: string }[] = [
  { key: "module", label: "Module" },
  { key: "department", label: "Department" },
  { key: "title", label: "Title" },
  { key: "date", label: "Date" },
  { key: "status", label: "Status" },
];

export function CustomReportBuilder() {
  const options = useMemo(() => getReportFilterOptions(), []);
  const [filters, setFilters] = useState<ReportFilters>(DEFAULT_REPORT_FILTERS);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [exporting, setExporting] = useState<ExportFormat | null>(null);

  const reportRows = useMemo(() => buildReport(filters), [filters]);
  const moduleCount = useMemo(() => countModules(reportRows), [reportRows]);
  const previewRows = reportRows.slice(0, 5);
  const hasRows = reportRows.length > 0;
  const showCustomDates = filters.dateRange === "Custom range";
  const employeeEnabled = isEmployeeFilterEnabled(filters.module);
  const challengeEnabled = isChallengeFilterEnabled(filters.module);

  function updateFilter<K extends keyof ReportFilters>(key: K, value: ReportFilters[K]) {
    setFilters(prev => {
      const next = { ...prev, [key]: value };
      if (key === "module") {
        const moduleValue = value as string;
        if (!isEmployeeFilterEnabled(moduleValue)) {
          next.employee = "All employee";
        }
        if (!isChallengeFilterEnabled(moduleValue)) {
          next.challenge = "All challenge";
        }
      }
      return next;
    });
  }

  async function handleExport(format: ExportFormat) {
    if (!hasRows || exporting) return;
    setExporting(format);
    try {
      if (format === "csv") exportReportCsv(reportRows);
      if (format === "excel") await exportReportExcel(reportRows);
      if (format === "pdf") await exportReportPdf(reportRows);
      toast.success("Report exported");
    } catch {
      toast.error("Export failed — please try again");
    } finally {
      setExporting(null);
    }
  }

  return (
    <div className="eco-card p-5">
      <h2 className="text-xs font-semibold uppercase tracking-[0.05em] text-[var(--eco-text-secondary)]">
        Custom Report Builder
      </h2>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <FilterSelect
          label="Department"
          value={filters.department}
          options={options.departmentOptions}
          onChange={v => updateFilter("department", v)}
        />
        <FilterSelect
          label="Date Range"
          value={filters.dateRange}
          options={options.dateRangeOptions}
          onChange={v => updateFilter("dateRange", v)}
        />
        <FilterSelect
          label="Module"
          value={filters.module}
          options={options.moduleOptions}
          onChange={v => updateFilter("module", v)}
        />
        <FilterSelect
          label="Employee"
          value={filters.employee}
          options={options.employeeOptions}
          disabled={!employeeEnabled}
          hint={!employeeEnabled ? "Select Social or Governance module" : undefined}
          onChange={v => updateFilter("employee", v)}
        />
        <FilterSelect
          label="Challenge"
          value={filters.challenge}
          options={options.challengeOptions}
          disabled={!challengeEnabled}
          hint={!challengeEnabled ? "Select Gamification module" : undefined}
          onChange={v => updateFilter("challenge", v)}
        />
        <FilterSelect
          label="ESG Category"
          value={filters.esgCategory}
          options={options.esgCategoryOptions}
          onChange={v => updateFilter("esgCategory", v)}
        />
      </div>

      {showCustomDates && (
        <div className="mt-3 flex flex-wrap items-end gap-3">
          <DateField
            label="From"
            value={filters.customFrom}
            onChange={v => updateFilter("customFrom", v)}
          />
          <DateField
            label="To"
            value={filters.customTo}
            onChange={v => updateFilter("customTo", v)}
          />
        </div>
      )}

      <div className="mt-5 border-t border-[var(--eco-border)] pt-4">
        {hasRows ? (
          <>
            <p className="text-[13px] text-[var(--eco-text-secondary)]">
              Showing {reportRows.length} record{reportRows.length === 1 ? "" : "s"} across{" "}
              {moduleCount} module{moduleCount === 1 ? "" : "s"}
            </p>
            <button
              type="button"
              onClick={() => setPreviewOpen(open => !open)}
              className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-[var(--eco-accent-teal)] hover:underline"
            >
              {previewOpen ? (
                <>
                  Hide preview <ChevronUp className="h-4 w-4" />
                </>
              ) : (
                <>
                  Show preview (first 5 rows) <ChevronDown className="h-4 w-4" />
                </>
              )}
            </button>
            {previewOpen && (
              <div className="mt-3 overflow-x-auto rounded-lg border border-[var(--eco-border)]">
                <table className="w-full min-w-[520px] text-left text-sm">
                  <thead className="bg-[var(--eco-accent-teal-bg)] text-[11px] font-semibold uppercase tracking-wide text-[var(--eco-text-secondary)]">
                    <tr>
                      {PREVIEW_COLUMNS.map(col => (
                        <th key={col.key} className="px-3 py-2">
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewRows.map(row => (
                      <tr key={row.id} className="border-t border-[var(--eco-border)]">
                        {PREVIEW_COLUMNS.map(col => (
                          <td key={col.key} className="px-3 py-2 text-[var(--eco-text-primary)]">
                            {String(row[col.key] ?? "—")}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        ) : (
          <p className="text-[13px] text-[var(--eco-text-muted)]">No records match these filters</p>
        )}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <ExportButton
          label="PDF"
          disabled={!hasRows}
          loading={exporting === "pdf"}
          onClick={() => handleExport("pdf")}
        />
        <ExportButton
          label="Excel"
          disabled={!hasRows}
          loading={exporting === "excel"}
          onClick={() => handleExport("excel")}
        />
        <ExportButton
          label="CSV"
          disabled={!hasRows}
          loading={exporting === "csv"}
          onClick={() => handleExport("csv")}
        />
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  options,
  disabled = false,
  hint,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  disabled?: boolean;
  hint?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-[11px] font-semibold uppercase text-[var(--eco-text-secondary)]">
        {label}
      </label>
      <select
        value={value}
        disabled={disabled}
        onChange={e => onChange(e.target.value)}
        className="h-10 w-full rounded-lg border border-[var(--eco-border)] bg-white px-3 text-sm outline-none focus:border-[var(--eco-accent-teal)] disabled:cursor-not-allowed disabled:bg-[var(--eco-border)]/30 disabled:text-[var(--eco-text-muted)]"
      >
        {options.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {hint && (
        <p className="mt-1 text-[11px] text-[var(--eco-text-muted)]">{hint}</p>
      )}
    </div>
  );
}

function DateField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-[11px] font-semibold uppercase text-[var(--eco-text-secondary)]">
        {label}
      </label>
      <input
        type="date"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="h-10 rounded-lg border border-[var(--eco-border)] bg-white px-3 text-sm outline-none focus:border-[var(--eco-accent-teal)]"
      />
    </div>
  );
}

function ExportButton({
  label,
  disabled,
  loading,
  onClick,
}: {
  label: string;
  disabled: boolean;
  loading: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled || loading}
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-full border border-[var(--eco-border)] bg-[var(--eco-accent-teal-bg)] px-4 py-2 text-sm font-medium text-[var(--eco-accent-teal)] transition hover:border-[var(--eco-accent-teal)] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
      Export {label}
    </button>
  );
}
