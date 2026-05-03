"use client";

import Link from "next/link";
import { Coins } from "lucide-react";
import { useLocalUser } from "@/hooks/useLocalUser";
import { cn } from "@/lib/utils";

export function PointsBalance({ compact }: { compact?: boolean }) {
  const { user } = useLocalUser();
  if (compact) {
    return (
      <Link
        href="/rewards"
        className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-accent)]/15 px-3 py-1 text-xs font-bold tabular-nums text-[var(--color-accent)] transition hover:bg-[var(--color-accent)]/25"
      >
        <Coins size={14} />
        {user.points.toLocaleString()}
      </Link>
    );
  }
  return (
    <Link
      href="/rewards"
      className={cn(
        "flex items-center justify-between rounded-2xl border border-[var(--color-line)] bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface-2)] p-4 transition hover:border-[var(--color-accent)]/40"
      )}
    >
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--color-accent)]/20 text-[var(--color-accent)]">
          <Coins size={20} />
        </span>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-faint)]">
            Your points
          </p>
          <p className="font-display text-2xl tabular-nums">{user.points.toLocaleString()}</p>
        </div>
      </div>
      <span className="text-xs text-[var(--color-text-muted)]">Open rewards →</span>
    </Link>
  );
}
