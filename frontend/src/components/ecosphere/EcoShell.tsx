import { EcoSidebar } from "./EcoSidebar";
import { EcoHeader } from "./EcoHeader";

export function EcoShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="eco-light relative flex min-h-screen w-full">
      <EcoSidebar />
      <div className="relative z-10 flex min-h-screen flex-1 flex-col border-l border-border">
        <EcoHeader />
        <main className="relative flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
