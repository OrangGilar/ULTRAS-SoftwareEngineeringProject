"use client";

import Link from "next/link";
import { useLocalUser } from "@/hooks/useLocalUser";

export function PointsBalance({ compact }: { compact?: boolean }) {
  const { user } = useLocalUser();

  if (compact) {
    return (
      <Link
        href="/rewards"
        className="inline-flex items-baseline gap-1.5 font-display text-sm font-bold tabular-nums tracking-[-0.01em] text-[var(--color-text)] transition hover:text-[var(--color-primary)]"
      >
        <span className="font-mono-label text-[10px] font-normal text-[var(--color-text-faint)]">
          PTS
        </span>
        {user.points.toLocaleString()}
      </Link>
    );
  }

  return (
    <Link
      href="/rewards"
      className="group block border-y border-[var(--color-line)] py-5 transition hover:border-[var(--color-text)]"
    >
      <div className="flex items-end justify-between gap-4">
        <div className="flex flex-col">
          <span className="font-mono-label text-[10px] text-[var(--color-text-faint)]">
            Points balance
          </span>
          <span className="font-display text-5xl font-bold tabular-nums leading-none tracking-[-0.04em]">
            {user.points.toLocaleString()}
          </span>
        </div>
        <span className="font-mono-label text-[10px] text-[var(--color-text-muted)] transition group-hover:text-[var(--color-primary)]">
          Open rewards →
        </span>
      </div>
    </Link>
  );
}
