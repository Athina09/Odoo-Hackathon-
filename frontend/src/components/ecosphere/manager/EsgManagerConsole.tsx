import { useEcoAuth } from "@/context/EcoAuthContext";
import {
  aiRecommendations,
  csrActivities,
  ecoAudits,
  ecoPolicies,
  complianceIssueTypes,
  sustainabilityChallenges,
  ESG_KPIS,
} from "@/data/ecosphere";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AiLiveFeed } from "@/components/ecosphere/AiLiveFeed";
import { EcoChartsGrid } from "@/components/ecosphere/EcoChartsGrid";
import { EnvironmentCaseTable } from "@/components/ecosphere/EnvironmentCaseTable";
import { FileDown, Plus, CheckCircle2, AlertTriangle } from "lucide-react";
import { ApprovalQueuePanel } from "@/components/ecosphere/ApprovalQueuePanel";

export function EsgManagerConsole() {
  const { config } = useEcoAuth();

  return (
    <div className="space-y-6 p-5 pb-10">
      <header className="mx-auto max-w-5xl border-b border-border/40 pb-5">
        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">ESG Manager</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-foreground">ESG Operations Hub</h1>
        <p className="mt-1 text-base text-muted-foreground">
          Monitor environmental performance, CSR, challenges, audits, and organization-wide ESG for{" "}
          {config.organization.name}.
        </p>
      </header>

      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-4">
        <Kpi label="Org ESG score" value={ESG_KPIS.overallScore.value} />
        <Kpi label="Open compliance" value={ESG_KPIS.complianceIssues.value} />
        <Kpi label="CSR participation" value={87} suffix="%" />
        <Kpi label="AI confidence" value={94} suffix="%" />
      </div>

      <Tabs defaultValue="environment" className="mx-auto max-w-5xl space-y-6">
        <TabsList className="h-auto w-full justify-start gap-0 rounded-none border-b border-border/50 bg-transparent p-0">
          <Tab value="environment">Environment</Tab>
          <Tab value="csr">CSR</Tab>
          <Tab value="challenges">Challenges</Tab>
          <Tab value="audits">Audits</Tab>
          <Tab value="compliance">Compliance</Tab>
          <Tab value="reports">Reports</Tab>
          <Tab value="ai">AI insights</Tab>
        </TabsList>

        <TabsContent value="environment" className="mt-0 space-y-4">
          <Section title="Environmental performance" description="Track cases, emissions trends, and facility risk.">
            <EnvironmentCaseTable />
            <EcoChartsGrid />
          </Section>
        </TabsContent>

        <TabsContent value="csr" className="mt-0">
          <Section title="CSR activities" description="Manage and approve employee participation in CSR programs.">
            <ApprovalQueuePanel />
            <div className="mt-4 space-y-2">
              {csrActivities.map((a, i) => (
                <div
                  key={i}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/50 p-3"
                >
                  <div>
                    <div className="font-medium">{a.title}</div>
                    <div className="text-sm text-muted-foreground">{a.location} · {a.xp} XP</div>
                  </div>
                  <Button type="button" size="sm" variant="outline" className="gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Approve participation
                  </Button>
                </div>
              ))}
            </div>
            <Button type="button" size="sm" className="mt-3 gap-1">
              <Plus className="h-3.5 w-3.5" /> Add CSR activity
            </Button>
          </Section>
        </TabsContent>

        <TabsContent value="challenges" className="mt-0">
          <Section title="Sustainability challenges" description="Create challenges and approve employee sign-ups.">
            <ApprovalQueuePanel />
            <div className="mt-4 space-y-2">
              {sustainabilityChallenges.map((c, i) => (
                <div
                  key={i}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/50 p-3"
                >
                  <div>
                    <div className="font-medium">{c.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {c.difficulty} · {c.xp} XP
                    </div>
                  </div>
                  <Button type="button" size="sm" variant="outline">
                    Review sign-ups
                  </Button>
                </div>
              ))}
            </div>
            <Button type="button" size="sm" className="mt-3 gap-1">
              <Plus className="h-3.5 w-3.5" /> Create challenge
            </Button>
          </Section>
        </TabsContent>

        <TabsContent value="audits" className="mt-0">
          <Section title="Audits & governance" description="Conduct audits and track policy compliance.">
            <div className="grid gap-4 md:grid-cols-2">
              <ListCard title="Scheduled audits" items={ecoAudits} actionLabel="Conduct audit" />
              <ListCard title="Policies" items={ecoPolicies} actionLabel="Review" />
            </div>
          </Section>
        </TabsContent>

        <TabsContent value="compliance" className="mt-0">
          <Section title="Compliance issues" description="Raise and assign organization-wide compliance issues.">
            <div className="space-y-2">
              {complianceIssueTypes.slice(0, 5).map((issue, i) => (
                <div
                  key={i}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/50 p-3"
                >
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-warn" />
                    <span>{issue}</span>
                  </div>
                  <Button type="button" size="sm" variant="outline">
                    Raise issue
                  </Button>
                </div>
              ))}
            </div>
          </Section>
        </TabsContent>

        <TabsContent value="reports" className="mt-0">
          <Section title="ESG reports" description="Generate organization-wide ESG and carbon reports.">
            <div className="grid gap-3 sm:grid-cols-2">
              {["Quarterly ESG summary", "Carbon footprint report", "CSR impact report", "Audit compliance pack"].map(
                title => (
                  <div
                    key={title}
                    className="flex items-center justify-between rounded-lg border border-border/50 p-4"
                  >
                    <span className="font-medium">{title}</span>
                    <Button type="button" size="sm" variant="outline" className="gap-1">
                      <FileDown className="h-3.5 w-3.5" /> Generate
                    </Button>
                  </div>
                ),
              )}
            </div>
          </Section>
        </TabsContent>

        <TabsContent value="ai" className="mt-0">
          <Section title="AI insights & recommendations" description="Live feed and AI-generated actions.">
            <div className="grid gap-4 lg:grid-cols-2">
              <AiLiveFeed />
              <div className="space-y-2">
                {aiRecommendations.map(r => (
                  <div key={r.id} className="rounded-lg border border-border/50 p-4">
                    <div className="font-medium">{r.title}</div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {r.impact} · {r.esgBoost}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Section>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Tab({ value, children }: { value: string; children: React.ReactNode }) {
  return (
    <TabsTrigger
      value={value}
      className="rounded-none border-b-2 border-transparent px-4 py-2.5 text-base font-medium text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
    >
      {children}
    </TabsTrigger>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-base font-semibold">{title}</h2>
      {description && <p className="mt-1 mb-4 text-base text-muted-foreground">{description}</p>}
      {children}
    </section>
  );
}

function Kpi({ label, value, suffix = "" }: { label: string; value: number; suffix?: string }) {
  return (
    <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-1 font-mono text-2xl font-semibold text-foreground">
        {value}
        {suffix}
      </div>
    </div>
  );
}

function ListCard({
  title,
  items,
  actionLabel,
}: {
  title: string;
  items: string[];
  actionLabel: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-white p-4">
      <h3 className="mb-3 font-medium">{title}</h3>
      <ul className="space-y-2">
        {items.map(item => (
          <li key={item} className="flex items-center justify-between gap-2 text-sm">
            <span>{item}</span>
            <Button type="button" size="sm" variant="ghost" className="h-7 text-xs">
              {actionLabel}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
