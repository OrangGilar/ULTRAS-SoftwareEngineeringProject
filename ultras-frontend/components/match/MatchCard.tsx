"use client";

import Link from "next/link";
import type { Match } from "@/app/types";
import type { ApiMatch } from "@/lib/api";
import { useClubs } from "@/components/providers/ClubsProvider";
import { ClubBadge } from "@/components/club/ClubBadge";
import { formatKickoff } from "@/lib/utils";
import { cn } from "@/lib/utils";

export type MatchCardProps = {
  // Accept either the bare Match type (for mock data) or the API-extended ApiMatch
  // (which includes homeName/awayName/logo fallbacks for unmapped clubs).
  match: Match | ApiMatch;
  userPrediction?: { home: number; away: number };
  variant?: "default" | "compact";
};

// Fixed: original code keyed on "scheduled" which doesn't exist in the Match
// status union — it's "upcoming". The UI silently fell through to undefined.
const STATUS_LABEL: Record<Match["status"], string> = {
  live: "Live now",
  finished: "Full time",
  postponed: "Postponed",
  upcoming: "Upcoming",
};

export function MatchCard({ match, userPrediction, variant = "default" }: MatchCardProps) {
  const { getClub } = useClubs();
  const apiMatch = match as ApiMatch;

  // Try the clubs catalog first (rich Indonesian club metadata — crests, motto, etc.).
  // If the slug isn't there (brand-new team from API-Football we haven't seeded yet),
  // fall back to the homeName/homeLogo the API gave us.
  const home = getClub(match.homeId);
  const away = getClub(match.awayId);

  const homeDisplay = home ?? fallbackClub(apiMatch.homeName, apiMatch.homeLogo, match.homeId);
  const awayDisplay = away ?? fallbackClub(apiMatch.awayName, apiMatch.awayLogo, match.awayId);

  if (!homeDisplay || !awayDisplay) return null;

  const href =
    match.status === "finished"
      ? `/matches/${match.id}/result`
      : `/matches/${match.id}/predict`;

  const isLive = match.status === "live";

  return (
    <Link
      href={href}
      className="group block border-b border-[var(--color-line)] py-5 transition hover:border-[var(--color-text)]"
    >
      <div className="mb-4 flex items-center justify-between font-mono-label text-[10px]">
        <span
          className={cn(
            "inline-flex items-center gap-2",
            isLive ? "text-[var(--color-primary)]" : "text-[var(--color-text-faint)]",
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
        <span className="text-[var(--color-text-faint)]">MD {match.matchday}</span>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        <div className="flex items-center gap-3">
          <ClubBadge club={homeDisplay} size={variant === "compact" ? "sm" : "md"} />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold tracking-tight">{homeDisplay.shortName}</p>
            <p className="truncate text-[10px] text-[var(--color-text-faint)]">{homeDisplay.city}</p>
          </div>
        </div>

        <div className="text-center">
          {match.status === "finished" && match.finalScore ? (
            <p className="font-display text-4xl font-bold tabular-nums leading-none tracking-[-0.04em]">
              {match.finalScore.home}<span className="text-[var(--color-text-faint)]">.</span>{match.finalScore.away}
            </p>
          ) : (
            <p className="font-mono-label text-xs text-[var(--color-text-muted)]">
              {formatKickoff(match.kickoffISO)}
            </p>
          )}
        </div>

        <div className="flex items-center justify-end gap-3">
          <div className="min-w-0 text-right">
            <p className="truncate text-sm font-bold tracking-tight">{awayDisplay.shortName}</p>
            <p className="truncate text-[10px] text-[var(--color-text-faint)]">{awayDisplay.city}</p>
          </div>
          <ClubBadge club={awayDisplay} size={variant === "compact" ? "sm" : "md"} />
        </div>
      </div>

      {userPrediction && (
        <div className="mt-4 flex items-baseline justify-between font-mono-label text-[10px] text-[var(--color-text-faint)]">
          <span>Your call</span>
          <span className="font-display text-base font-bold tabular-nums tracking-[-0.02em] text-[var(--color-text)]">
            {userPrediction.home}.{userPrediction.away}
          </span>
        </div>
      )}

      <p className="mt-4 font-mono-label text-[10px] text-[var(--color-text-muted)] transition group-hover:text-[var(--color-primary)]">
        {match.status === "finished" ? "See your result →" : "Make a prediction →"}
      </p>
    </Link>
  );
}

/**
 * Build a minimal Club-shaped object from API-Football data when we don't
 * have a local clubs.ts entry. Lets brand-new fixtures still render instead
 * of returning null and leaving the user with a confusing empty grid.
 */
function fallbackClub(name?: string, logo?: string, id?: string) {
  if (!name) return null;
  return {
    id: id ?? name,
    name,
    shortName: name.length > 12 ? name.slice(0, 3).toUpperCase() : name,
    city: "—",
    region: "Other" as const,
    founded: 0,
    colors: ["#888888", "#cccccc"] as [string, string],
    crestEmoji: "",
    logo,
    vibe: [] as never[],
    motto: "",
  };
}
