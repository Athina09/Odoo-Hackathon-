import { EcoShell } from "./EcoShell";
import { EcoAuthProvider } from "@/context/EcoAuthContext";
import { Toaster } from "@/components/ui/sonner";
import { EcoAiFab } from "./EcoAiFab";

export function EcoPage({
  children,
  bare = false,
}: {
  children: React.ReactNode;
  bare?: boolean;
}) {
  return (
    <EcoAuthProvider>
      {bare ? (
        <div className="eco-light min-h-screen">{children}</div>
      ) : (
        <EcoShell>{children}</EcoShell>
      )}
      <EcoAiFab mobile={bare} />
      <Toaster position="bottom-right" richColors />
    </EcoAuthProvider>
  );
}
