import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getSupabase } from "@/lib/supabaseClient";

const OwnerAuthContext = createContext(null);

// There is one shared owner account for this restaurant, used by the owner
// and their team alike. The login screen only ever asks for a password —
// this is the fixed identity behind it.
const OWNER_EMAIL = "owner@smartrestownerai.app";

export function OwnerAuthProvider({ children }) {
  const client = useMemo(() => getSupabase(), []);
  const [session, setSession] = useState(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;

    client.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      setSession(data.session ?? null);
      setIsHydrated(true);
    });

    const { data: subscription } = client.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => {
      cancelled = true;
      subscription?.subscription?.unsubscribe();
    };
  }, [client]);

  const signIn = useCallback(
    async (password) => {
      const { error } = await client.auth.signInWithPassword({ email: OWNER_EMAIL, password });
      if (error) throw new Error("Incorrect password.");
    },
    [client]
  );

  const signOut = useCallback(async () => {
    await client.auth.signOut();
  }, [client]);

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      isLoggedIn: Boolean(session?.user),
      isHydrated,
      signIn,
      signOut,
    }),
    [session, isHydrated, signIn, signOut]
  );

  return <OwnerAuthContext.Provider value={value}>{children}</OwnerAuthContext.Provider>;
}

export function useOwnerAuth() {
  const ctx = useContext(OwnerAuthContext);
  if (!ctx) throw new Error("useOwnerAuth must be used within OwnerAuthProvider");
  return ctx;
}
