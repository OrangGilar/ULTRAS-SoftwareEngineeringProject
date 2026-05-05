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
      <div className="flex items-center justify-between border-b border-[var(--color-line)] px-5 py-4">
        <div>
          <h1 className="font-display text-base font-bold tracking-[-0.01em]">{title}</h1>
          {subtitle && (
            <p className="font-mono-label text-[10px] text-[var(--color-text-faint)]">
              {subtitle}
            </p>
          )}
        </div>
        <div className="flex items-center gap-4">
          {typeof score === "number" && (
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono-label text-[10px] text-[var(--color-text-faint)]">
                Score
              </span>
              <span className="font-display text-xl font-bold tabular-nums leading-none tracking-[-0.02em]">
                {score}
              </span>
            </div>
          )}
          <Link
            href="/games"
            aria-label="Exit game"
            className="grid h-8 w-8 place-items-center rounded-full border border-[var(--color-line)] text-[var(--color-text-muted)] transition hover:border-[var(--color-text)] hover:text-[var(--color-text)]"
          >
            <X size={14} />
          </Link>
        </div>
      </div>
      <div className="flex-1 px-5 py-8">{children}</div>
    </div>
  );
}
