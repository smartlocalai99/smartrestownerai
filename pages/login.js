import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useOwnerAuth } from "@/context/OwnerAuthContext";
import { MdOutlineLock, MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";

export default function LoginPage() {
  const router = useRouter();
  const { signIn, isLoggedIn, isHydrated } = useOwnerAuth();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isHydrated || !isLoggedIn) return;
    const redirect = router.query.redirect;
    router.replace(typeof redirect === "string" ? redirect : "/dashboard");
  }, [isHydrated, isLoggedIn, router]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await signIn(password);
      const redirect = router.query.redirect;
      router.replace(typeof redirect === "string" ? redirect : "/dashboard");
    } catch (err) {
      setError(err.message || "Something went wrong. Try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Head>
        <title>Sign in — Mandi Kings Owner</title>
      </Head>
      <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#12100c] p-0 font-sans sm:p-6">
        <div className="pointer-events-none absolute left-1/4 top-1/4 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/20 blur-[100px]" />
        <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-[300px] w-[300px] translate-x-1/2 translate-y-1/2 rounded-full bg-[#d97706]/10 blur-[80px]" />

        <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-canvas sm:h-[844px] sm:min-h-0 sm:max-w-[390px] sm:rounded-[48px] sm:border-[10px] sm:border-[#282420] sm:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)]">
          <div className="absolute top-3.5 left-1/2 z-50 hidden h-6 w-28 -translate-x-1/2 rounded-full bg-[#282420] shadow-inner sm:block" />

          <div className="z-10 flex shrink-0 items-center justify-center px-6 pt-8">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted">Owner Portal</span>
          </div>

          <div className="flex flex-1 flex-col justify-center px-6 pb-8 pt-4">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-[22px] border border-line bg-surface p-1 shadow-[0_8px_20px_-6px_rgba(163,97,15,0.3)]">
              <img src="/logo.png" alt="Mandi Kings Logo" className="h-full w-full rounded-[18px] object-contain" />
            </div>

            <div className="mb-6 text-center">
              <h1 className="font-display text-2xl font-semibold text-ink">Welcome back</h1>
              <p className="mx-auto mt-2 max-w-[280px] text-xs leading-relaxed text-muted">
                Enter the owner password to manage your menu, offers, and orders.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error ? (
                <div className="flex items-start gap-2.5 rounded-2xl border border-danger/20 bg-danger/10 px-4 py-3">
                  <span className="shrink-0 text-sm font-bold text-danger">!</span>
                  <p className="text-xs leading-relaxed text-danger">{error}</p>
                </div>
              ) : null}

              <div>
                <label className="block px-1 text-[11px] font-semibold uppercase tracking-wider text-muted">
                  Owner password
                </label>
                <div className="relative mt-1.5">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    autoFocus
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="input !py-3 !pl-11 !pr-11"
                    placeholder="••••"
                  />
                  <span className="pointer-events-none absolute left-3.5 top-1/2 z-10 flex -translate-y-1/2 items-center text-muted">
                    <MdOutlineLock size={18} />
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute right-3.5 top-1/2 z-10 flex -translate-y-1/2 cursor-pointer items-center text-muted hover:text-ink focus:outline-none"
                  >
                    {showPassword ? <MdOutlineVisibilityOff size={18} /> : <MdOutlineVisibility size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !password}
                className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-accent py-3.5 text-sm font-semibold text-canvas shadow-lg shadow-accent/15 transition active:scale-[0.98] disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-canvas border-t-transparent" />
                    Signing in…
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
