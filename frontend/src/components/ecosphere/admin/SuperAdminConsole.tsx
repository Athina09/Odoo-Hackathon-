import { useEcoAuth } from "@/context/EcoAuthContext";
import type { EcoAdminConfig } from "@/lib/ecosphere-config-store";
import { RoleAssignmentsPanel } from "./RoleAssignmentsPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, RotateCcw, Check } from "lucide-react";

export function SuperAdminConsole() {
  const { config, updateConfig, resetConfig } = useEcoAuth();

  const setOrg = (patch: Partial<EcoAdminConfig["organization"]>) =>
    updateConfig(c => ({ ...c, organization: { ...c.organization, ...patch } }));

  return (
    <div className="space-y-6 p-5 pb-10">
      <header className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 border-b border-border/40 pb-5">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Administration</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-foreground">Super Admin</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-1.5 text-sm text-success sm:flex">
            <Check className="h-3.5 w-3.5" /> Auto-saved
          </span>
          <Button type="button" variant="ghost" size="sm" className="h-8 text-muted-foreground" onClick={() => resetConfig()}>
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Reset
          </Button>
        </div>
      </header>

      <Tabs defaultValue="assignments" className="mx-auto max-w-5xl space-y-6">
        <TabsList className="h-auto w-full justify-start gap-0 rounded-none border-b border-border/50 bg-transparent p-0">
          <Tab value="assignments">People</Tab>
          <Tab value="organization">Weights</Tab>
          <Tab value="emissions">Emissions</Tab>
          <Tab value="goals">Goals</Tab>
          <Tab value="gamification">Rewards</Tab>
          <Tab value="notifications">Alerts</Tab>
        </TabsList>

        <TabsContent value="assignments" className="mt-0 focus-visible:outline-none">
          <RoleAssignmentsPanel />
        </TabsContent>

        <TabsContent value="organization" className="mt-0">
          <ConfigSection title="Organization" description="Name and ESG scoring weights (must total 100%).">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Organization name">
                <Input value={config.organization.name} onChange={e => setOrg({ name: e.target.value })} />
              </Field>
              <Field label="Environmental %">
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={config.organization.environmentalWeight}
                  onChange={e => setOrg({ environmentalWeight: Number(e.target.value) })}
                />
              </Field>
              <Field label="Social %">
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={config.organization.socialWeight}
                  onChange={e => setOrg({ socialWeight: Number(e.target.value) })}
                />
              </Field>
              <Field label="Governance %">
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={config.organization.governanceWeight}
                  onChange={e => setOrg({ governanceWeight: Number(e.target.value) })}
                />
              </Field>
            </div>
          </ConfigSection>
        </TabsContent>

        <TabsContent value="emissions" className="mt-0">
          <ListEditor
            title="Emission factors"
            description="Carbon conversion rates used in calculations."
            items={config.emissionFactors}
            onChange={emissionFactors => updateConfig({ emissionFactors })}
            fields={["name", "unit", "factor"]}
            placeholders={{ name: "Fuel type", unit: "Unit", factor: "kg CO₂ factor" }}
          />
        </TabsContent>

        <TabsContent value="goals" className="mt-0">
          <ListEditor
            title="ESG goals"
            description="Organization sustainability targets."
            items={config.sustainabilityGoals}
            onChange={sustainabilityGoals => updateConfig({ sustainabilityGoals })}
            fields={["title", "target", "deadline"]}
            placeholders={{ title: "Goal", target: "Target", deadline: "Deadline" }}
          />
        </TabsContent>

        <TabsContent value="gamification" className="mt-0">
          <div className="space-y-8">
            <ListEditor
              title="Badges"
              items={config.badges}
              onChange={badges => updateConfig({ badges })}
              fields={["name"]}
              placeholders={{ name: "Badge name" }}
              numericFields={{ xpRequired: "XP" }}
            />
            <ListEditor
              title="Rewards"
              items={config.rewards}
              onChange={rewards => updateConfig({ rewards })}
              fields={["name"]}
              placeholders={{ name: "Reward name" }}
              numericFields={{ points: "Points" }}
            />
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="mt-0">
          <ConfigSection title="Notifications" description="Choose how the team gets updates.">
            <div className="mb-5 flex flex-wrap gap-6">
              <Toggle
                label="Email digest"
                checked={config.notificationSettings.emailDigest}
                onChange={v =>
                  updateConfig({
                    notificationSettings: { ...config.notificationSettings, emailDigest: v },
                  })
                }
              />
              <Toggle
                label="Real-time alerts"
                checked={config.notificationSettings.realtimeAlerts}
                onChange={v =>
                  updateConfig({
                    notificationSettings: { ...config.notificationSettings, realtimeAlerts: v },
                  })
                }
              />
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {config.notificationTypes.map(type => (
                <Toggle
                  key={type}
                  label={type}
                  checked={config.notificationSettings.enabledTypes.includes(type)}
                  onChange={checked => {
                    const enabled = checked
                      ? [...config.notificationSettings.enabledTypes, type]
                      : config.notificationSettings.enabledTypes.filter(t => t !== type);
                    updateConfig({
                      notificationSettings: { ...config.notificationSettings, enabledTypes: enabled },
                    });
                  }}
                />
              ))}
            </div>
          </ConfigSection>
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

function ConfigSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-5xl">
      <h2 className="text-base font-semibold">{title}</h2>
      {description && <p className="mt-1 mb-5 text-base text-muted-foreground">{description}</p>}
      {!description && <div className="mb-5" />}
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-base text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-border/40 px-3 py-2.5 text-base hover:bg-muted/30">
      <input
        type="checkbox"
        className="h-4 w-4 rounded border-border accent-primary"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
      />
      {label}
    </label>
  );
}

function ListEditor<T extends Record<string, unknown>>({
  title,
  description,
  items,
  onChange,
  fields,
  placeholders = {},
  numericFields = {},
}: {
  title: string;
  description?: string;
  items: T[];
  onChange: (items: T[]) => void;
  fields: (keyof T & string)[];
  placeholders?: Partial<Record<keyof T & string, string>>;
  numericFields?: Partial<Record<keyof T & string, string>>;
}) {
  return (
    <ConfigSection title={title} description={description}>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex flex-wrap items-center gap-2 rounded-lg border border-border/50 p-3">
            {fields.map(f => (
              <Input
                key={f}
                className="h-9 min-w-[100px] flex-1"
                placeholder={placeholders[f]}
                value={String(item[f] ?? "")}
                onChange={e => {
                  const next = [...items];
                  next[i] = { ...item, [f]: e.target.value };
                  onChange(next);
                }}
              />
            ))}
            {Object.entries(numericFields).map(([f, label]) => (
              <Input
                key={f}
                type="number"
                className="h-9 w-24"
                placeholder={label}
                value={Number(item[f as keyof T] ?? 0)}
                onChange={e => {
                  const next = [...items];
                  next[i] = { ...item, [f]: Number(e.target.value) };
                  onChange(next);
                }}
              />
            ))}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 shrink-0 text-muted-foreground hover:text-danger"
              aria-label="Remove row"
              onClick={() => onChange(items.filter((_, j) => j !== i))}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-2 gap-1"
          onClick={() => {
            const blank = Object.fromEntries(fields.map(f => [f, ""])) as T;
            onChange([...items, blank]);
          }}
        >
          <Plus className="h-3.5 w-3.5" /> Add
        </Button>
      </div>
    </ConfigSection>
  );
}
