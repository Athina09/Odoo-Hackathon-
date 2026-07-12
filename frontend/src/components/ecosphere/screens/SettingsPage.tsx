import { useState } from "react";
import { orgDepartments, csrCategories, challengeCategories } from "@/data/ecosphere";
import { useEcoAuth } from "@/context/EcoAuthContext";

const tabs = ["Departments", "Categories", "ESG Configuration", "Notifications"] as const;

export function SettingsPage() {
  const { config, updateConfig } = useEcoAuth();
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Departments");
  const [autoEmission, setAutoEmission] = useState(true);
  const [evidenceRequired, setEvidenceRequired] = useState(true);
  const [badgeAutoAward, setBadgeAutoAward] = useState(true);
  const weights = {
    environmental: config.organization.environmentalWeight,
    social: config.organization.socialWeight,
    governance: config.organization.governanceWeight,
  };

  return (
    <div className="space-y-4 p-6">
      <div>
        <p className="text-[13px] text-[var(--eco-text-secondary)]">Settings → Configuration → Notifications</p>
        <h1 className="mt-1 text-2xl font-bold text-[var(--eco-text-primary)]">Settings & Administration</h1>
      </div>

      <div className="eco-card overflow-hidden">
        <div className="flex flex-wrap border-b border-[var(--eco-border)]">
          {tabs.map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium transition ${
                activeTab === tab
                  ? "border-b-2 border-[var(--eco-accent-teal)] text-[var(--eco-accent-teal)]"
                  : "text-[var(--eco-text-secondary)] hover:text-[var(--eco-text-primary)]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-5">
          {activeTab === "Departments" && (
            <div className="space-y-2">
              {orgDepartments.map(d => (
                <div key={d.id} className="flex items-center justify-between rounded-lg border border-[var(--eco-border)] px-4 py-3">
                  <div>
                    <div className="font-medium text-[var(--eco-text-primary)]">{d.name}</div>
                    <div className="text-[13px] text-[var(--eco-text-muted)]">Head: {d.head} · {d.employeeCount} employees</div>
                  </div>
                  <span className="rounded-full bg-[var(--eco-accent-green-bg)] px-2.5 py-0.5 text-[11px] font-bold uppercase text-[var(--eco-accent-green)]">Active</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === "Categories" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase text-[var(--eco-text-secondary)]">CSR Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {csrCategories.map(c => (
                    <span key={c} className="rounded-full bg-[var(--eco-accent-teal-bg)] px-3 py-1 text-xs font-medium text-[var(--eco-accent-teal)]">{c}</span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase text-[var(--eco-text-secondary)]">Challenge Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {challengeCategories.map(c => (
                    <span key={c} className="rounded-full bg-[var(--eco-accent-purple-bg)] px-3 py-1 text-xs font-medium text-[var(--eco-accent-purple)]">{c}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "ESG Configuration" && (
            <div className="max-w-lg space-y-5">
              {([
                ["Environmental", "environmental", weights.environmental],
                ["Social", "social", weights.social],
                ["Governance", "governance", weights.governance],
              ] as const).map(([label, key, value]) => (
                <div key={key}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="font-medium text-[var(--eco-text-primary)]">{label}</span>
                    <span className="font-bold text-[var(--eco-accent-teal)]">{value}%</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={70}
                    value={value}
                    onChange={e => {
                      const next = Number(e.target.value);
                      updateConfig(prev => ({
                        ...prev,
                        organization: {
                          ...prev.organization,
                          [`${key}Weight`]: key === "environmental" ? next : key === "social" ? next : next,
                          environmentalWeight: key === "environmental" ? next : prev.organization.environmentalWeight,
                          socialWeight: key === "social" ? next : prev.organization.socialWeight,
                          governanceWeight: key === "governance" ? next : prev.organization.governanceWeight,
                        },
                      }));
                    }}
                    className="h-1 w-full cursor-pointer accent-[var(--eco-accent-teal)]"
                  />
                </div>
              ))}
              <div className="space-y-3 pt-2">
                {(
                  [
                    ["Auto Emission Calculation", setAutoEmission, autoEmission],
                    ["Evidence Requirement", setEvidenceRequired, evidenceRequired],
                    ["Badge Auto-Award", setBadgeAutoAward, badgeAutoAward],
                  ] as const
                ).map(([label, setter, value]) => (
                  <label key={label} className="flex items-center justify-between rounded-lg border border-[var(--eco-border)] px-4 py-3">
                    <span className="text-sm text-[var(--eco-text-primary)]">{label}</span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={value}
                      onClick={() => setter(!value)}
                      className={`relative h-6 w-11 rounded-full transition ${
                        value ? "bg-[var(--eco-accent-teal)]" : "bg-[var(--eco-border)]"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                          value ? "left-5" : "left-0.5"
                        }`}
                      />
                    </button>
                  </label>
                ))}
              </div>
            </div>
          )}

          {activeTab === "Notifications" && (
            <div className="space-y-2">
              {["Compliance issues", "CSR approvals", "Challenge completions", "Policy reminders", "Badge unlocks"].map(n => (
                <label key={n} className="flex items-center justify-between rounded-lg border border-[var(--eco-border)] px-4 py-3">
                  <span className="text-sm text-[var(--eco-text-primary)]">{n}</span>
                  <input type="checkbox" defaultChecked className="h-4 w-4 accent-[var(--eco-accent-teal)]" />
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
