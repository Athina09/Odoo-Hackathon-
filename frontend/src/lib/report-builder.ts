import {
  carbonTransactions,
  challengeRows,
  complianceIssueRows,
  contributorSpotlight,
  csrActivityRows,
  environmentalKpis,
  governanceKpis,
  socialKpis,
} from "@/data/ecosphere-modules";
import type { KpiCardProps } from "@/components/ecosphere/ds";
import { ecoSphereMockData } from "@/data/ecosphere-mock";
import {
  endOfYear,
  isValid,
  isWithinInterval,
  parse,
  startOfQuarter,
  startOfYear,
  subDays,
} from "date-fns";

export type ReportModule = "Environmental" | "Social" | "Governance" | "Gamification";

export interface ReportFilters {
  department: string;
  module: string;
  employee: string;
  challenge: string;
  esgCategory: string;
  dateRange: string;
  customFrom: string;
  customTo: string;
}

export interface ReportRow {
  id: string;
  module: ReportModule;
  department: string;
  title: string;
  date: string;
  employee?: string;
  owner?: string;
  source?: string;
  amount?: string;
  co2Kg?: number;
  participants?: number;
  points?: number;
  severity?: string;
  status?: string;
  xp?: number;
  category?: string;
}

export type ReportTypeId = "env" | "social" | "gov" | "summary";

export interface ReportKpi {
  label: string;
  value: string | number;
  subtitle?: string;
}

export interface ReportPreviewData {
  title: string;
  kpis: ReportKpi[];
  rows: ReportRow[];
}

export const DEFAULT_REPORT_FILTERS: ReportFilters = {
  department: "All department",
  module: "All module",
  employee: "All employee",
  challenge: "All challenge",
  esgCategory: "All esg category",
  dateRange: "All date range",
  customFrom: "",
  customTo: "",
};

const REFERENCE_DATE = new Date(2026, 6, 12);

const CSR_DATES: Record<string, string> = {
  csr1: "Jun 15",
  csr2: "Jun 22",
  csr3: "Jul 3",
  csr4: "Jul 8",
  csr5: "Jun 28",
  csr6: "Jul 10",
};

const CHALLENGE_DEPARTMENTS: Record<string, string> = {
  ch1: "HR",
  ch2: "Transport",
  ch3: "IT",
  ch4: "Manufacturing",
  ch5: "Operations",
};

const CHALLENGE_DATES: Record<string, string> = {
  ch1: "Jul 1",
  ch2: "Jun 20",
  ch3: "May 15",
  ch4: "Jul 5",
  ch5: "Jun 10",
};

function uniqueSorted(values: string[]) {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

export function getAllRows(): ReportRow[] {
  return buildBaseRows();
}

function rowHasEmployeeField(r: ReportRow) {
  return r.employee != null || r.owner != null;
}

function rowHasChallengeField(r: ReportRow) {
  return r.module === "Gamification";
}

export function isEmployeeFilterEnabled(module: string) {
  return module === "Social" || module === "Governance";
}

export function isChallengeFilterEnabled(module: string) {
  return module === "Gamification";
}

export function getReportFilterOptions() {
  const rows = buildBaseRows();
  const rowDepartments = uniqueSorted(rows.map(r => r.department));
  const mockDepartments = ecoSphereMockData.departments.map(d => d.name);
  const departments = uniqueSorted([...rowDepartments, ...mockDepartments]);

  const employeeNames = uniqueSorted(
    rows.flatMap(r => [r.employee, r.owner].filter((name): name is string => Boolean(name))),
  );

  const challengeTitles = uniqueSorted(
    rows.filter(r => r.module === "Gamification").map(r => r.title),
  );

  return {
    departmentOptions: ["All department", ...departments],
    moduleOptions: ["All module", "Environmental", "Social", "Governance", "Gamification"],
    employeeOptions: ["All employee", ...employeeNames],
    challengeOptions: ["All challenge", ...challengeTitles],
    esgCategoryOptions: ["All esg category", "Environmental", "Social", "Governance"],
    dateRangeOptions: [
      "All date range",
      "Last 7 days",
      "Last 30 days",
      "This quarter",
      "This year",
      "Custom range",
    ],
  };
}

export function parseRowDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  const withYear = parse(`${dateStr} 2026`, "MMM d yyyy", REFERENCE_DATE);
  if (isValid(withYear)) return withYear;
  const iso = parse(dateStr, "yyyy-MM-dd", REFERENCE_DATE);
  return isValid(iso) ? iso : null;
}

export function resolveDateRange(filters: ReportFilters): { from: Date; to: Date } | null {
  if (filters.dateRange === "All date range") return null;

  if (filters.dateRange === "Custom range") {
    if (!filters.customFrom || !filters.customTo) return null;
    const from = parse(filters.customFrom, "yyyy-MM-dd", REFERENCE_DATE);
    const to = parse(filters.customTo, "yyyy-MM-dd", REFERENCE_DATE);
    if (!isValid(from) || !isValid(to)) return null;
    return { from, to };
  }

  const to = REFERENCE_DATE;
  switch (filters.dateRange) {
    case "Last 7 days":
      return { from: subDays(to, 7), to };
    case "Last 30 days":
      return { from: subDays(to, 30), to };
    case "This quarter":
      return { from: startOfQuarter(to), to };
    case "This year":
      return { from: startOfYear(to), to: endOfYear(to) };
    default:
      return null;
  }
}

function csrEmployee(activity: string) {
  return contributorSpotlight.find(c => c.activity === activity)?.name;
}

function buildBaseRows(): ReportRow[] {
  const environmental: ReportRow[] = carbonTransactions.map(r => ({
    id: r.id,
    module: "Environmental",
    department: r.department,
    title: r.source,
    date: r.date,
    source: r.source,
    amount: r.amount,
    co2Kg: r.co2Kg,
    status: r.factor,
  }));

  const social: ReportRow[] = csrActivityRows.map(r => ({
    id: r.id,
    module: "Social",
    department: r.department,
    title: r.activity,
    date: CSR_DATES[r.id] ?? "Jul 1",
    employee: csrEmployee(r.activity),
    participants: r.participants,
    points: r.points,
    status: r.status,
  }));

  const governance: ReportRow[] = complianceIssueRows.map(r => ({
    id: r.id,
    module: "Governance",
    department: r.department,
    title: r.issue,
    date: r.dueDate,
    owner: r.owner,
    severity: r.severity,
    status: r.status,
  }));

  const gamification: ReportRow[] = challengeRows.map(r => ({
    id: r.id,
    module: "Gamification",
    department: CHALLENGE_DEPARTMENTS[r.id] ?? "HR",
    title: r.title,
    date: CHALLENGE_DATES[r.id] ?? "Jul 1",
    category: r.category,
    xp: r.xp,
    participants: r.participants,
    status: r.difficulty,
  }));

  return [...environmental, ...social, ...governance, ...gamification];
}

export function buildReport(filters: ReportFilters): ReportRow[] {
  let rows = buildBaseRows();

  if (filters.department !== "All department") {
    rows = rows.filter(r => r.department === filters.department);
  }
  if (filters.module !== "All module") {
    rows = rows.filter(r => r.module === filters.module);
  }
  if (filters.employee !== "All employee") {
    rows = rows.filter(
      r =>
        !rowHasEmployeeField(r) ||
        r.employee === filters.employee ||
        r.owner === filters.employee,
    );
  }
  if (filters.challenge !== "All challenge") {
    rows = rows.filter(r => !rowHasChallengeField(r) || r.title === filters.challenge);
  }
  if (filters.esgCategory !== "All esg category") {
    rows = rows.filter(r => r.module === filters.esgCategory);
  }

  const range = resolveDateRange(filters);
  if (range) {
    rows = rows.filter(r => {
      const parsed = parseRowDate(r.date);
      if (!parsed) return true;
      return isWithinInterval(parsed, { start: range.from, end: range.to });
    });
  }

  return rows;
}

export function countModules(rows: ReportRow[]) {
  return new Set(rows.map(r => r.module)).size;
}

function kpiFromCards(cards: KpiCardProps[]): ReportKpi[] {
  return cards.map(k => ({ label: k.label, value: k.value, subtitle: k.subtitle }));
}

export function compileTypedReport(id: ReportTypeId): ReportPreviewData {
  const allRows = buildBaseRows();

  switch (id) {
    case "env":
      return {
        title: "Environmental Report",
        kpis: kpiFromCards(environmentalKpis.slice(0, 4)),
        rows: allRows.filter(r => r.module === "Environmental"),
      };
    case "social":
      return {
        title: "Social Report",
        kpis: kpiFromCards(socialKpis.slice(0, 4)),
        rows: allRows.filter(r => r.module === "Social"),
      };
    case "gov":
      return {
        title: "Governance Report",
        kpis: kpiFromCards(governanceKpis.slice(0, 4)),
        rows: allRows.filter(r => r.module === "Governance"),
      };
    case "summary":
      return {
        title: "ESG Summary",
        kpis: [
          ...kpiFromCards(environmentalKpis.slice(0, 2)),
          ...kpiFromCards(socialKpis.slice(0, 2)),
          ...kpiFromCards(governanceKpis.slice(0, 2)),
        ],
        rows: allRows.filter(r => r.module !== "Gamification"),
      };
  }
}

function reportFilename(ext: string, title?: string) {
  const stamp = new Date().toISOString().slice(0, 10);
  const slug = title
    ? title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
    : "ecosphere-report";
  return `${slug}-${stamp}.${ext}`;
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function escapeCsvCell(value: unknown) {
  const text = value == null ? "" : String(value);
  if (/[",\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

export function exportReportCsv(rows: ReportRow[], title?: string) {
  if (rows.length === 0) return;
  const keys = [
    "id",
    "module",
    "department",
    "title",
    "date",
    "employee",
    "owner",
    "source",
    "amount",
    "co2Kg",
    "participants",
    "points",
    "severity",
    "status",
    "xp",
    "category",
  ];
  const header = keys.join(",");
  const body = rows
    .map(row => keys.map(key => escapeCsvCell(row[key as keyof ReportRow])).join(","))
    .join("\n");
  const blob = new Blob([`${header}\n${body}`], { type: "text/csv;charset=utf-8;" });
  triggerDownload(blob, reportFilename("csv", title));
}

export async function exportReportExcel(rows: ReportRow[], title?: string) {
  if (rows.length === 0) return;
  const XLSX = await import("xlsx");
  const sheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, "Report");
  XLSX.writeFile(workbook, reportFilename("xlsx", title));
}

export async function exportReportPdf(rows: ReportRow[], title?: string) {
  if (rows.length === 0) return;
  const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);

  const doc = new jsPDF({ orientation: rows.length > 6 ? "landscape" : "portrait" });
  doc.setFontSize(14);
  doc.text(title ?? "EcoSphere Custom Report", 14, 16);
  doc.setFontSize(10);
  doc.text(`Generated ${new Date().toLocaleString()} · ${rows.length} records`, 14, 22);

  autoTable(doc, {
    startY: 28,
    head: [["Module", "Department", "Title", "Date", "Status"]],
    body: rows.map(r => [
      r.module,
      r.department,
      r.title,
      r.date,
      r.status ?? r.severity ?? "",
    ]),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [13, 148, 136] },
  });

  doc.save(reportFilename("pdf", title));
}
