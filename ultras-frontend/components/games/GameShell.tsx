"use client";

import Link from "next/link";
import { X } from "lucide-react";

export function GameShell({
  title,
  subtitle,
  score,
  children,
}: {
  title: string;
  subtitle?: string;
  score?: number;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col">
      <div className="flex items-center justify-between border-b border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3">
        <div>
          <h1 className="text-base font-bold">{title}</h1>
          {subtitle && <p className="text-xs text-[var(--color-text-muted)]">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-3">
          {typeof score === "number" && (
            <span className="font-display text-lg tabular-nums text-[var(--color-accent)]">{score}</span>
          )}
          <Link
            href="/games"
            aria-label="Exit game"
            className="grid h-8 w-8 place-items-center rounded-full bg-[var(--color-surface-2)] text-[var(--color-text-muted)] transition hover:text-[var(--color-text)]"
          >
            <X size={16} />
          </Link>
        </div>
      </div>
      <div className="flex-1 px-4 py-6">{children}</div>
    </div>
  );
}
