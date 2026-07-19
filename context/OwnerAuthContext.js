import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getSupabase } from "@/lib/supabaseClient";

const OwnerAuthContext = createContext(null);

async function checkIsOwner(client, userId) {
  const { data, error } = await client
    .from("restaurant_owners")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return Boolean(data);
}

async function claimOwnershipIfUnclaimed(client, userId) {
  const { error } = await client.from("restaurant_owners").insert({ user_id: userId });
  // A unique-violation or RLS-denied insert just means someone already claimed it first.
  if (error && error.code !== "23505" && !error.message?.includes("row-level security")) {
    throw error;
  }
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

  const signUp = useCallback(
    async (email, password) => {
      const { data, error } = await client.auth.signUp({ email, password });
      if (error) throw error;

      if (!data.session) {
        return { needsEmailConfirmation: true };
      }

      await claimOwnershipIfUnclaimed(client, data.session.user.id);
      await refreshOwnerStatus(data.session);
      return { needsEmailConfirmation: false };
    },
    [client, refreshOwnerStatus]
  );

  const signIn = useCallback(
    async (email, password) => {
      const { data, error } = await client.auth.signInWithPassword({ email, password });
      if (error) throw error;
      const owned = await checkIsOwner(client, data.session.user.id);
      if (!owned) {
        await claimOwnershipIfUnclaimed(client, data.session.user.id);
      }
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
      signUp,
      signIn,
      signOut,
    }),
    [session, isOwner, isHydrated, signUp, signIn, signOut]
  );

  return <OwnerAuthContext.Provider value={value}>{children}</OwnerAuthContext.Provider>;
}

export function useOwnerAuth() {
  const ctx = useContext(OwnerAuthContext);
  if (!ctx) throw new Error("useOwnerAuth must be used within OwnerAuthProvider");
  return ctx;
}
