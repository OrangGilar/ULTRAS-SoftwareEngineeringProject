"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { ApiError } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // fieldErrors mirrors the Spring Boot validation response so we can highlight
  // individual fields. errorMsg covers the rest (409 conflicts, 5xx, network).
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const canSubmit =
    name.trim().length > 1 &&
    email.includes("@") &&
    password.length >= 8 &&
    agreed &&
    !submitting;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setErrorMsg(null);
    setFieldErrors({});

    try {
      await register({
        displayName: name.trim(),
        email: email.trim(),
        password,
        // username and city left unset — backend derives a username from displayName.
      });
      router.push("/onboarding/quiz");
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 0) {
          setErrorMsg("Couldn't reach the server. Is the backend running on port 8080?");
        } else if (err.fieldErrors && Object.keys(err.fieldErrors).length > 0) {
          setFieldErrors(err.fieldErrors);
        } else {
          setErrorMsg(err.message);
        }
      } else {
        setErrorMsg("Something went wrong. Try again.");
      }
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md px-5 py-12 md:py-20">
      <header className="space-y-3">
        <p className="font-mono-label text-[10px] text-[var(--color-text-faint)]">
          New supporter
        </p>
        <h1 className="font-display text-5xl font-bold leading-[0.95] tracking-[-0.04em] md:text-6xl">
          Join the
          <br />
          <span className="text-[var(--color-primary)]">community</span>.
        </h1>
        <p className="prose-line text-base text-[var(--color-text-muted)]">
          Create an account to start predicting matches, earning points, and joining the discussion.
        </p>
      </header>

      <form onSubmit={onSubmit} className="mt-12 space-y-8">
        <div className="space-y-2">
          <label
            htmlFor="register-name"
            className="font-mono-label text-[10px] text-[var(--color-text-faint)]"
          >
            Display name
          </label>
          <input
            id="register-name"
            type="text"
            autoComplete="nickname"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="What fellow ultras call you"
            className="w-full border-0 border-b border-[var(--color-line-strong)] bg-transparent px-0 py-2 font-display text-xl font-bold tracking-[-0.01em] placeholder:font-normal placeholder:text-base placeholder:text-[var(--color-text-faint)] focus:border-[var(--color-primary)] focus:outline-none"
          />
          {fieldErrors.displayName && (
            <p className="font-mono-label text-[10px] text-[var(--color-primary)]">
              {fieldErrors.displayName}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="register-email"
            className="font-mono-label text-[10px] text-[var(--color-text-faint)]"
          >
            Email
          </label>
          <input
            id="register-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="supporter@ultras.id"
            className="w-full border-0 border-b border-[var(--color-line-strong)] bg-transparent px-0 py-2 text-base text-[var(--color-text)] placeholder:text-[var(--color-text-faint)] focus:border-[var(--color-primary)] focus:outline-none"
          />
          {fieldErrors.email && (
            <p className="font-mono-label text-[10px] text-[var(--color-primary)]">
              {fieldErrors.email}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="register-password"
            className="font-mono-label text-[10px] text-[var(--color-text-faint)]"
          >
            Password
          </label>
          <input
            id="register-password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            className="w-full border-0 border-b border-[var(--color-line-strong)] bg-transparent px-0 py-2 text-base text-[var(--color-text)] placeholder:text-[var(--color-text-faint)] focus:border-[var(--color-primary)] focus:outline-none"
          />
          <p className="font-mono-label text-[10px] text-[var(--color-text-faint)]">
            8+ characters. Mix it up.
          </p>
          {fieldErrors.password && (
            <p className="font-mono-label text-[10px] text-[var(--color-primary)]">
              {fieldErrors.password}
            </p>
          )}
        </div>

        <label className="flex cursor-pointer items-start gap-3 pt-2">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="peer sr-only"
          />
          <span
            aria-hidden
            className={
              agreed
                ? "mt-0.5 grid h-4 w-4 shrink-0 place-items-center border border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-pure-white)]"
                : "mt-0.5 grid h-4 w-4 shrink-0 place-items-center border border-[var(--color-line-strong)]"
            }
          >
            {agreed && (
              <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 6l3 3 5-6" />
              </svg>
            )}
          </span>
          <span className="prose-line text-xs leading-snug text-[var(--color-text-muted)]">
            I agree to the terms and conditions.
          </span>
        </label>

        {errorMsg && (
          <div
            role="alert"
            className="border-l-2 border-[var(--color-primary)] pl-3 font-mono-label text-[11px] text-[var(--color-primary)]"
          >
            {errorMsg}
          </div>
        )}

        <Button
          fullWidth
          size="lg"
          variant="primary"
          type="submit"
          loading={submitting}
          disabled={!canSubmit}
        >
          Create account
        </Button>
      </form>

      <p className="mt-12 border-t border-[var(--color-line)] pt-6 font-mono-label text-[10px] text-[var(--color-text-muted)]">
        Already a supporter?{" "}
        <Link
          href="/login"
          className="text-[var(--color-text)] underline-offset-4 transition hover:text-[var(--color-primary)] hover:underline"
        >
          Log in →
        </Link>
      </p>
    </div>
  );
}
