"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { ApiError } from "@/lib/api";

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const passwordsMatch = newPassword === confirmPassword;
  const canSubmit =
    email.trim().includes("@") &&
    newPassword.length >= 8 &&
    confirmPassword.length >= 8 &&
    passwordsMatch &&
    !submitting;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await forgotPassword({
        email: email.trim(),
        newPassword,
      });
      setSuccessMsg("Password updated. You can log in with the new password now.");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMsg(
          err.status === 0
            ? "Couldn't reach the server. Is the backend running on port 8080?"
            : err.message,
        );
      } else {
        setErrorMsg("Something went wrong. Try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md px-5 py-12 md:py-20">
      <header className="space-y-3">
        <p className="font-mono-label text-[10px] text-[var(--color-text-faint)]">
          Account recovery
        </p>
        <h1 className="font-display text-5xl font-bold leading-[0.95] tracking-[-0.04em] md:text-6xl">
          Reset password.
        </h1>
        <p className="prose-line text-base text-[var(--color-text-muted)]">
          Enter your account email and choose a new password.
        </p>
      </header>

      <form onSubmit={onSubmit} className="mt-12 space-y-8">
        <div className="space-y-2">
          <label
            htmlFor="forgot-email"
            className="font-mono-label text-[10px] text-[var(--color-text-faint)]"
          >
            Email
          </label>
          <input
            id="forgot-email"
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
          <label
            htmlFor="forgot-password"
            className="font-mono-label text-[10px] text-[var(--color-text-faint)]"
          >
            New password
          </label>
          <input
            id="forgot-password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="At least 8 characters"
            className="w-full border-0 border-b border-[var(--color-line-strong)] bg-transparent px-0 py-2 text-base text-[var(--color-text)] placeholder:text-[var(--color-text-faint)] focus:border-[var(--color-primary)] focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="forgot-confirm-password"
            className="font-mono-label text-[10px] text-[var(--color-text-faint)]"
          >
            Confirm password
          </label>
          <input
            id="forgot-confirm-password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat the new password"
            className="w-full border-0 border-b border-[var(--color-line-strong)] bg-transparent px-0 py-2 text-base text-[var(--color-text)] placeholder:text-[var(--color-text-faint)] focus:border-[var(--color-primary)] focus:outline-none"
          />
          {!passwordsMatch && confirmPassword.length > 0 && (
            <p className="font-mono-label text-[10px] text-[var(--color-primary)]">
              Passwords do not match.
            </p>
          )}
        </div>

        {errorMsg && (
          <div
            role="alert"
            className="border-l-2 border-[var(--color-primary)] pl-3 font-mono-label text-[11px] text-[var(--color-primary)]"
          >
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div
            role="status"
            className="border-l-2 border-[var(--color-success)] pl-3 font-mono-label text-[11px] text-[var(--color-text-muted)]"
          >
            {successMsg}
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
          Update password
        </Button>
      </form>

      <p className="mt-12 border-t border-[var(--color-line)] pt-6 font-mono-label text-[10px] text-[var(--color-text-muted)]">
        Remembered it?{" "}
        <Link
          href="/login"
          className="text-[var(--color-text)] underline-offset-4 transition hover:text-[var(--color-primary)] hover:underline"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
