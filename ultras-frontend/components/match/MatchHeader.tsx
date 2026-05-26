"use client";

import type { Match } from "@/app/types";
import { useClubs } from "@/components/providers/ClubsProvider";
import { ClubBadge } from "@/components/club/ClubBadge";
import { formatKickoff } from "@/lib/utils";
import { cn } from "@/lib/utils";

const STATUS_LABEL: Record<Match["status"], string> = {
  live: "Live now",
  finished: "Full time",
  postponed: "Postponed",
  upcoming: "Upcoming",
};

export function MatchHeader({ match, hideScore }: { match: Match; hideScore?: boolean }) {
  const { getClub } = useClubs();
  const home = getClub(match.homeId);
  const away = getClub(match.awayId);
  if (!home || !away) return null;

  const isLive = match.status === "live";

  return (
    <section className="border-b border-[var(--color-line)] pb-6">
      <div className="mb-5 flex items-center justify-between font-mono-label text-[10px]">
        <span
          className={cn(
            "inline-flex items-center gap-2",
            isLive ? "text-[var(--color-primary)]" : "text-[var(--color-text-muted)]",
          )}
        >
          {isLive && (
            <span className="relative grid h-2 w-2 place-items-center">
              <span className="absolute inset-0 animate-ping rounded-full bg-[var(--color-primary)] opacity-60" />
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]" />
            </span>
          )}
          {STATUS_LABEL[match.status]}
        </span>
        <span className="text-[var(--color-text-faint)]">
          MD {match.matchday} / {match.venue}
        </span>
      </div>

      <div className="grid grid-cols-3 items-center gap-3">
        <div className="flex flex-col items-center text-center">
          <ClubBadge club={home} size="lg" showLabel />
        </div>
        <div className="flex flex-col items-center justify-center">
          {match.finalScore && !hideScore ? (
            <p className="font-display text-6xl font-bold tabular-nums leading-none tracking-[-0.04em] md:text-7xl">
              {match.finalScore.home}<span className="mx-2 text-[var(--color-text-faint)]">.</span>{match.finalScore.away}
            </p>
          ) : (
            <p className="font-display text-3xl font-bold leading-none text-[var(--color-text-faint)] tracking-[-0.02em]">
              vs
            </p>
          )}
          <p className="mt-3 font-mono-label text-[10px] text-[var(--color-text-faint)]">
            {formatKickoff(match.kickoffISO)}
          </p>
        </div>
        <div className="flex flex-col items-center text-center">
          <ClubBadge club={away} size="lg" showLabel />
        </div>
      </div>
    </section>
  );
}
