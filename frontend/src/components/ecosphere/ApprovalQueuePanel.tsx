import { useMemo, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { useEcoAuth } from "@/context/EcoAuthContext";
import {
  approveSubmissionForEmployee,
  getAllPendingSubmissions,
} from "@/lib/ecosphere-employee-store";
import { Button } from "@/components/ui/button";

export function ApprovalQueuePanel({ departmentOnly = false }: { departmentOnly?: boolean }) {
  const { config, user } = useEcoAuth();
  const [tick, setTick] = useState(0);

  const pending = useMemo(() => {
    void tick;
    const all = getAllPendingSubmissions(config);
    if (!departmentOnly || !user?.departmentId) return all;
    return {
      challenges: all.challenges.filter(c => c.departmentId === user.departmentId),
      csr: all.csr.filter(c => c.departmentId === user.departmentId),
    };
  }, [config, departmentOnly, user?.departmentId, tick]);

  const approve = (employeeId: string, type: "challenge" | "csr", id: string) => {
    approveSubmissionForEmployee(employeeId, type, id);
    setTick(t => t + 1);
  };

  const total = pending.challenges.length + pending.csr.length;
  if (total === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
        No pending submissions in queue.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {pending.challenges.map(c => (
        <div key={c.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-white p-3">
          <div>
            <div className="font-medium">{c.title}</div>
            <div className="text-sm text-muted-foreground">
              Challenge · {c.employeeName} · {c.xpReward} XP
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="button" size="sm" className="gap-1" onClick={() => approve(c.employeeId, "challenge", c.id)}>
              <CheckCircle2 className="h-3.5 w-3.5" /> Approve
            </Button>
            <Button type="button" size="sm" variant="outline" className="gap-1 text-danger">
              <XCircle className="h-3.5 w-3.5" /> Reject
            </Button>
          </div>
        </div>
      ))}
      {pending.csr.map(a => (
        <div key={a.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-white p-3">
          <div>
            <div className="font-medium">{a.title}</div>
            <div className="text-sm text-muted-foreground">
              CSR · {a.employeeName} · {a.points} pts
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="button" size="sm" className="gap-1" onClick={() => approve(a.employeeId, "csr", a.id)}>
              <CheckCircle2 className="h-3.5 w-3.5" /> Approve
            </Button>
            <Button type="button" size="sm" variant="outline" className="gap-1 text-danger">
              <XCircle className="h-3.5 w-3.5" /> Reject
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
