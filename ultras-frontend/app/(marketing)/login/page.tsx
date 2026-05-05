"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = email.trim().length > 0 && password.length > 0;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      router.push("/feed");
    }, 600);
  };

  return (
    <div className="mx-auto w-full max-w-md px-5 py-12 md:py-20">
      <header className="space-y-3">
        <p className="font-mono-label text-[10px] text-[var(--color-text-faint)]">
          Welcome back
        </p>
        <h1 className="font-display text-5xl font-bold leading-[0.95] tracking-[-0.04em] md:text-6xl">
          Log in.
        </h1>
        <p className="prose-line text-base text-[var(--color-text-muted)]">
          Pick up where you left off. Your predictions, threads, and points are right where you left them.
        </p>
      </header>

      <form onSubmit={onSubmit} className="mt-12 space-y-8">
        <div className="space-y-2">
          <label
            htmlFor="login-email"
            className="font-mono-label text-[10px] text-[var(--color-text-faint)]"
          >
            Email
          </label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="supporter@ultras.id"
            className="w-full border-0 border-b border-[var(--color-line-strong)] bg-transparent px-0 py-2 text-base text-[var(--color-text)] placeholder:text-[var(--color-text-faint)] focus:border-[var(--color-primary)] focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <label
              htmlFor="login-password"
              className="font-mono-label text-[10px] text-[var(--color-text-faint)]"
            >
              Password
            </label>
            <Link
              href="/login"
              className="font-mono-label text-[10px] text-[var(--color-text-muted)] transition hover:text-[var(--color-primary)]"
            >
              Forgot?
            </Link>
          </div>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            className="w-full border-0 border-b border-[var(--color-line-strong)] bg-transparent px-0 py-2 text-base text-[var(--color-text)] placeholder:text-[var(--color-text-faint)] focus:border-[var(--color-primary)] focus:outline-none"
          />
        </div>

        <Button
          fullWidth
          size="lg"
          variant="primary"
          type="submit"
          loading={submitting}
          disabled={!canSubmit}
        >
          Log in
        </Button>
      </form>

      <p className="mt-12 border-t border-[var(--color-line)] pt-6 font-mono-label text-[10px] text-[var(--color-text-muted)]">
        New to Ultras?{" "}
        <Link
          href="/register"
          className="text-[var(--color-text)] underline-offset-4 transition hover:text-[var(--color-primary)] hover:underline"
        >
          Register →
        </Link>
      </p>
    </div>
  );
}
