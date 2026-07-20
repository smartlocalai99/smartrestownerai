import useRequireOwnerAuth from "@/hooks/useRequireOwnerAuth";
import BottomNav from "./BottomNav";

export default function AppShell({ children }) {
  const { isReady, isHydrated } = useRequireOwnerAuth();

  if (!isHydrated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-canvas">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-accent" />
      </main>
    );
  }

  if (!isReady) {
    return <main className="min-h-screen bg-canvas" />;
  }

  return (
    <div className="min-h-screen bg-canvas pb-28">
      {children}
      <BottomNav />
    </div>
  );
}
