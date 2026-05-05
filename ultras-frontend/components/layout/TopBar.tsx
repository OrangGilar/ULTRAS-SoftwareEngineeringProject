"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { useLocalUser } from "@/hooks/useLocalUser";
import { getClub } from "@/lib/mock/clubs";
import { Avatar } from "@/components/ui/Avatar";
import { PointsBalance } from "@/components/rewards/PointsBalance";

export function TopBar() {
  const { user } = useLocalUser();
  const club = getClub(user.clubId);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-line)] bg-[var(--color-bg)]">
      <div className="mx-auto flex h-14 w-full max-w-screen-lg items-center justify-between px-4">
        <Link href="/feed" className="flex items-center gap-3">
          <span className="font-display text-xl font-bold tracking-[-0.02em] text-[var(--color-primary)]">
            ULTRAS.
          </span>
          {club && (
            <span className="hidden items-center gap-1.5 border-l border-[var(--color-line)] pl-3 font-mono-label text-[10px] text-[var(--color-text-muted)] sm:inline-flex">
              {club.logo ? (
                <img src={club.logo} alt={club.name} className="h-4 w-4 object-contain" />
              ) : (
                <span>{club.crestEmoji}</span>
              )}
              <span className="text-[var(--color-text)]">{club.shortName}</span>
            </span>
          )}
        </Link>

        <div className="flex items-center gap-3">
          <PointsBalance compact />
          <button
            type="button"
            aria-label="Notifications"
            className="relative grid h-9 w-9 place-items-center rounded-[var(--radius-pill)] border border-[var(--color-line)] text-[var(--color-text-muted)] transition hover:border-[var(--color-text)] hover:text-[var(--color-text)]"
          >
            <Bell size={15} />
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]" />
          </button>
          <Link href="/profile" aria-label="Profile">
            <Avatar name={user.displayName} logo={club?.logo} emoji={club?.crestEmoji} size="sm" />
          </Link>
        </div>
      </div>
    </header>
  );
}
