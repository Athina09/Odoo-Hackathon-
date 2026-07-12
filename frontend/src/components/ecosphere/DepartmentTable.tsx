import { departments } from "@/data/ecosphere";
import { DataTable, ConfidenceBar, StatusPill } from "@/components/ecosphere/ds";
import type { DepartmentRow } from "@/data/ecosphere";

const riskTone = (risk: DepartmentRow["risk"]) => (risk === "high" ? "high" : risk === "medium" ? "medium" : "low") as const;
const statusTone = (status: DepartmentRow["status"]) =>
  (status === "critical" ? "critical" : status === "watch" ? "medium" : status === "excellent" ? "excellent" : "good") as const;

export function DepartmentTable() {
  return (
    <DataTable<DepartmentRow>
      title="Department Performance"
      subtitle={`${departments.length} departments · ESG ranked`}
      rows={departments}
      columns={[
        { key: "dept", header: "Department", render: r => <span className="font-semibold">{r.department}</span> },
        { key: "esg", header: "ESG", render: r => <span className="text-[var(--eco-accent-blue)]">{r.esg}</span> },
        { key: "carbon", header: "Carbon", render: r => <span className="capitalize">{r.carbon}</span> },
        { key: "csr", header: "CSR", render: r => `${r.csr}%` },
        { key: "gov", header: "Governance", render: r => `${r.governance}%` },
        { key: "conf", header: "AI Conf.", render: r => <ConfidenceBar value={r.confidence} /> },
        { key: "risk", header: "Risk", render: r => <StatusPill label={r.risk} tone={riskTone(r.risk)} /> },
        { key: "status", header: "Status", render: r => <StatusPill label={r.status} tone={statusTone(r.status)} /> },
      ]}
      onOpen={() => {}}
    />
  );
}
