import { Cloud, Users, Shield, FileBarChart, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CustomReportBuilder } from "@/components/ecosphere/CustomReportBuilder";
import { ReportPreview } from "@/components/ecosphere/ReportPreview";
import { DepartmentScopeBanner } from "@/components/ecosphere/DepartmentScopeBanner";
import {
  compileTypedReport,
  type ReportPreviewData,
  type ReportTypeId,
} from "@/lib/report-builder";

const REPORT_TYPES: {
  id: ReportTypeId;
  title: string;
  icon: typeof Cloud;
  color: "teal" | "green" | "purple" | "blue";
}[] = [
  { id: "env", title: "Environmental Report", icon: Cloud, color: "teal" },
  { id: "social", title: "Social Report", icon: Users, color: "green" },
  { id: "gov", title: "Governance Report", icon: Shield, color: "purple" },
  { id: "summary", title: "ESG Summary", icon: FileBarChart, color: "blue" },
];

const colorMap = {
  teal: "bg-[var(--eco-accent-teal-bg)] text-[var(--eco-accent-teal)]",
  green: "bg-[var(--eco-accent-green-bg)] text-[var(--eco-accent-green)]",
  purple: "bg-[var(--eco-accent-purple-bg)] text-[var(--eco-accent-purple)]",
  blue: "bg-[var(--eco-accent-blue-bg)] text-[var(--eco-accent-blue)]",
};

function todayStamp() {
  return new Date().toISOString().slice(0, 10);
}

export function ReportsPage() {
  const [lastGenerated, setLastGenerated] = useState<Record<ReportTypeId, string>>({
    env: "2026-05-10",
    social: "2026-05-08",
    gov: "2026-05-12",
    summary: "2026-05-14",
  });
  const [generatingId, setGeneratingId] = useState<ReportTypeId | null>(null);
  const [previewReport, setPreviewReport] = useState<ReportPreviewData | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  function handleGenerate(id: ReportTypeId) {
    if (generatingId) return;
    setGeneratingId(id);
    window.setTimeout(() => {
      const report = compileTypedReport(id);
      setLastGenerated(prev => ({ ...prev, [id]: todayStamp() }));
      setPreviewReport(report);
      setPreviewOpen(true);
      setGeneratingId(null);
    }, 800);
  }

  return (
    <div className="space-y-4 p-6">
      <DepartmentScopeBanner />
      <div>
        <p className="text-[13px] text-[var(--eco-text-secondary)]">Reports → Custom builder → Export</p>
        <h1 className="mt-1 text-2xl font-bold text-[var(--eco-text-primary)]">Reports</h1>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {REPORT_TYPES.map(report => {
          const Icon = report.icon;
          const isGenerating = generatingId === report.id;
          return (
            <div key={report.id} className="eco-card p-4">
              <div className={`mb-3 grid h-10 w-10 place-items-center rounded-full ${colorMap[report.color]}`}>
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-[var(--eco-text-primary)]">{report.title}</h3>
              <p className="mt-1 text-[13px] text-[var(--eco-text-muted)]">
                Last generated: {lastGenerated[report.id]}
              </p>
              <Button
                type="button"
                size="sm"
                disabled={generatingId !== null}
                onClick={() => handleGenerate(report.id)}
                className="mt-4 rounded-full bg-[var(--eco-accent-teal)] text-white hover:bg-[var(--eco-accent-teal)]/90"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                    Generating…
                  </>
                ) : (
                  "Generate"
                )}
              </Button>
            </div>
          );
        })}
      </div>

      <CustomReportBuilder />

      <ReportPreview report={previewReport} open={previewOpen} onOpenChange={setPreviewOpen} />
    </div>
  );
}
