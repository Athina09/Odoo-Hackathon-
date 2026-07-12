import { EcoShell } from "./EcoShell";
import { EcoAuthProvider } from "@/context/EcoAuthContext";
import { Toaster } from "@/components/ui/sonner";

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
      <Toaster position="bottom-right" richColors />
    </EcoAuthProvider>
  );
}
