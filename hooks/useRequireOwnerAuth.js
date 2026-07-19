import { useEffect } from "react";
import { useRouter } from "next/router";
import { useOwnerAuth } from "@/context/OwnerAuthContext";

export default function useRequireOwnerAuth() {
  const router = useRouter();
  const { isLoggedIn, isOwner, isHydrated } = useOwnerAuth();

  useEffect(() => {
    if (isHydrated && !isLoggedIn) {
      router.replace(`/login?redirect=${encodeURIComponent(router.asPath)}`);
    }
  }, [isHydrated, isLoggedIn, router]);

  return { isReady: isHydrated && isLoggedIn && isOwner, isHydrated, isLoggedIn, isOwner };
}
