import { EcoSidebar } from "./EcoSidebar";
import { EcoHeader } from "./EcoHeader";
import { EcoAiFab } from "./EcoAiFab";

export function EcoShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="eco-theme relative flex min-h-screen w-full bg-[#0B1120] text-slate-100">
      <EcoSidebar />
      <div className="flex min-h-screen flex-1 flex-col border-l border-[rgba(59,130,246,0.25)]">
        <EcoHeader />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
      <EcoAiFab />
    </div>
  );
}
