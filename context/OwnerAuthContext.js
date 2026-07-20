import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getSupabase } from "@/lib/supabaseClient";

const OwnerAuthContext = createContext(null);

// There is exactly one owner account for this restaurant. The login screen
// only ever asks for a password — this is the fixed identity behind it.
const OWNER_EMAIL = "owner@smartrestownerai.app";

async function checkIsOwner(client, userId) {
  const { data, error } = await client
    .from("restaurant_owners")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return Boolean(data);
}

export function OwnerAuthProvider({ children }) {
  const client = useMemo(() => getSupabase(), []);
  const [session, setSession] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  const refreshOwnerStatus = useCallback(
    async (activeSession) => {
      if (!activeSession?.user) {
        setIsOwner(false);
        return;
      }
      const owned = await checkIsOwner(client, activeSession.user.id);
      setIsOwner(owned);
    },
    [client]
  );

  useEffect(() => {
    let cancelled = false;

    client.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      setSession(data.session ?? null);
      refreshOwnerStatus(data.session).finally(() => setIsHydrated(true));
    });

    const { data: subscription } = client.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      refreshOwnerStatus(nextSession);
    });

    return () => {
      cancelled = true;
      subscription?.subscription?.unsubscribe();
    };
  }, [client, refreshOwnerStatus]);

  const signIn = useCallback(
    async (password) => {
      const { data, error } = await client.auth.signInWithPassword({ email: OWNER_EMAIL, password });
      if (error) throw new Error("Incorrect password.");
      await refreshOwnerStatus(data.session);
    },
    [client, refreshOwnerStatus]
  );

  const signOut = useCallback(async () => {
    await client.auth.signOut();
  }, [client]);

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      isOwner,
      isLoggedIn: Boolean(session?.user),
      isHydrated,
      signIn,
      signOut,
    }),
    [session, isOwner, isHydrated, signIn, signOut]
  );

  return <OwnerAuthContext.Provider value={value}>{children}</OwnerAuthContext.Provider>;
}

export function useOwnerAuth() {
  const ctx = useContext(OwnerAuthContext);
  if (!ctx) throw new Error("useOwnerAuth must be used within OwnerAuthProvider");
  return ctx;
}
