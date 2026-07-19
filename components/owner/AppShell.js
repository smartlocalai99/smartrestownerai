import useRequireOwnerAuth from "@/hooks/useRequireOwnerAuth";
import { useOwnerAuth } from "@/context/OwnerAuthContext";
import BottomNav from "./BottomNav";

export default function AppShell({ children }) {
  const { isReady, isHydrated, isLoggedIn, isOwner } = useRequireOwnerAuth();
  const { signOut } = useOwnerAuth();

  if (!isHydrated || (isLoggedIn && !isOwner)) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-canvas px-6 text-center">
        {isLoggedIn && !isOwner ? (
          <div>
            <p className="font-display text-lg text-ink">This account isn&apos;t linked as the owner</p>
            <p className="mt-2 text-sm text-muted">
              Only one owner account is allowed per restaurant. Sign out and use the owner account instead.
            </p>
            <button
              onClick={signOut}
              className="mt-5 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-canvas"
            >
              Sign out
            </button>
          </div>
        ) : (
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-accent" />
        )}
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
