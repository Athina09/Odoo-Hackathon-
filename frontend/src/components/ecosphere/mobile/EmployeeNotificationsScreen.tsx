import { Bell, CheckCircle2, Clock, Trophy } from "lucide-react";
import { useEmployeeGamification } from "@/context/EmployeeGamificationContext";

export function EmployeeNotificationsScreen() {
  const { state } = useEmployeeGamification();

  const notifications = [
    ...state.challenges
      .filter(c => c.status === "pending_review")
      .map(c => ({
        id: c.id,
        icon: Clock,
        title: "Challenge under review",
        body: `${c.title} — waiting for manager approval`,
        tone: "amber" as const,
      })),
    ...state.challenges
      .filter(c => c.status === "approved" && c.approvedAt)
      .slice(-2)
      .map(c => ({
        id: `ap-${c.id}`,
        icon: Trophy,
        title: "XP awarded",
        body: `+${c.xpReward} XP for ${c.title}`,
        tone: "teal" as const,
      })),
    ...state.csrActivities
      .filter(a => a.status === "pending_review")
      .map(a => ({
        id: a.id,
        icon: Clock,
        title: "CSR proof submitted",
        body: `${a.title} — awaiting approval`,
        tone: "amber" as const,
      })),
    ...state.redemptions.slice(-2).map(r => ({
      id: r.id,
      icon: CheckCircle2,
      title: "Reward redeemed",
      body: `${r.rewardName} — show to HR`,
      tone: "green" as const,
    })),
  ];

  if (notifications.length === 0) {
    notifications.push({
      id: "welcome",
      icon: Bell,
      title: "Welcome to EcoSphere",
      body: "Join a challenge or CSR activity to start earning XP",
      tone: "teal" as const,
    });
  }

  const toneColor = {
    amber: "text-[var(--accent-amber)]",
    teal: "text-[var(--accent-teal)]",
    green: "text-[var(--accent-green)]",
  };

  return (
    <div className="space-y-4 p-4">
      <div>
        <h1 className="text-xl font-bold text-[var(--text-primary)]">Notifications</h1>
        <p className="text-sm text-[var(--text-muted)]">Activity updates and approvals</p>
      </div>

      <div className="space-y-2">
        {notifications.map(n => (
          <div key={n.id} className="eco-card flex gap-3 p-4">
            <n.icon className={`h-5 w-5 shrink-0 ${toneColor[n.tone]}`} />
            <div>
              <div className="font-semibold text-[var(--text-primary)]">{n.title}</div>
              <div className="text-sm text-[var(--text-secondary)]">{n.body}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
