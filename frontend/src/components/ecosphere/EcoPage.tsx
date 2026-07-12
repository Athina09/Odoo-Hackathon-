import { EcoShell } from "./EcoShell";
import { EcoAuthProvider } from "@/context/EcoAuthContext";

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
    </EcoAuthProvider>
  );
}
