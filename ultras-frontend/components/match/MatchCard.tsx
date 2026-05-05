import Link from "next/link";
import type { Match } from "@/app/types";
import { getClub } from "@/lib/mock/clubs";
import { ClubBadge } from "@/components/club/ClubBadge";
import { formatKickoff } from "@/lib/utils";
import { cn } from "@/lib/utils";

export type MatchCardProps = {
  match: Match;
  userPrediction?: { home: number; away: number };
  variant?: "default" | "compact";
};

const STATUS_LABEL: Record<Match["status"], string> = {
  live: "Live now",
  finished: "Full time",
  postponed: "Postponed",
  scheduled: "Upcoming",
};

export function MatchCard({ match, userPrediction, variant = "default" }: MatchCardProps) {
  const home = getClub(match.homeId);
  const away = getClub(match.awayId);
  if (!home || !away) return null;

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
          <ClubBadge club={home} size={variant === "compact" ? "sm" : "md"} />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold tracking-tight">{home.shortName}</p>
            <p className="truncate text-[10px] text-[var(--color-text-faint)]">{home.city}</p>
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
            <p className="truncate text-sm font-bold tracking-tight">{away.shortName}</p>
            <p className="truncate text-[10px] text-[var(--color-text-faint)]">{away.city}</p>
          </div>
          <ClubBadge club={away} size={variant === "compact" ? "sm" : "md"} />
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
