import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useOwnerAuth } from "@/context/OwnerAuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { signIn, signUp, isLoggedIn } = useOwnerAuth();
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!isLoggedIn) return;
    const redirect = router.query.redirect;
    router.replace(typeof redirect === "string" ? redirect : "/dashboard");
  }, [isLoggedIn, router]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setNotice("");
    setIsSubmitting(true);
    try {
      if (mode === "signin") {
        await signIn(email, password);
      } else {
        const result = await signUp(email, password);
        if (result.needsEmailConfirmation) {
          setNotice("Check your email to confirm your account, then sign in below.");
          setMode("signin");
          setIsSubmitting(false);
          return;
        }
      }
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
      <main className="flex min-h-screen items-center justify-center bg-canvas px-6">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">Mandi Kings</p>
            <h1 className="mt-2 font-display text-3xl font-semibold text-ink">
              {mode === "signin" ? "Welcome back" : "Set up your restaurant"}
            </h1>
            <p className="mt-2 text-sm text-muted">
              {mode === "signin"
                ? "Sign in to manage your menu, offers, and orders."
                : "Create the one owner account for this restaurant."}
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-line bg-surface p-6 shadow-sm"
          >
            {notice ? (
              <p className="mb-4 rounded-xl bg-success/15 px-3 py-2 text-sm text-success">{notice}</p>
            ) : null}
            {error ? (
              <p className="mb-4 rounded-xl bg-danger/15 px-3 py-2 text-sm text-danger">{error}</p>
            ) : null}

            <label className="block text-xs font-medium uppercase tracking-wide text-muted">
              Email
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input mt-1.5"
                placeholder="you@restaurant.com"
              />
            </label>

            <label className="mt-4 block text-xs font-medium uppercase tracking-wide text-muted">
              Password
              <input
                type="password"
                required
                minLength={4}
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input mt-1.5"
                placeholder="••••••••"
              />
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 w-full rounded-xl bg-accent py-3 text-sm font-semibold text-canvas transition active:scale-[0.98] disabled:opacity-60"
            >
              {isSubmitting ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>

          <button
            type="button"
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setError("");
              setNotice("");
            }}
            className="mt-5 w-full text-center text-sm text-muted underline decoration-line underline-offset-4"
          >
            {mode === "signin" ? "First time here? Create your owner account" : "Already have an account? Sign in"}
          </button>
        </div>
      </main>
    </>
  );
}
