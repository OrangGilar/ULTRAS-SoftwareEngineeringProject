import Link from "next/link";
import type { Match } from "@/app/types";
import { getClub } from "@/lib/mock/clubs";
import { Badge } from "@/components/ui/Badge";
import { ClubBadge } from "@/components/club/ClubBadge";
import { formatKickoff } from "@/lib/utils";

export type MatchCardProps = {
  match: Match;
  userPrediction?: { home: number; away: number };
  variant?: "default" | "compact";
};

export function MatchCard({ match, userPrediction, variant = "default" }: MatchCardProps) {
  const home = getClub(match.homeId);
  const away = getClub(match.awayId);
  if (!home || !away) return null;

  const href =
    match.status === "finished"
      ? `/matches/${match.id}/result`
      : `/matches/${match.id}/predict`;

  return (
    <Link
      href={href}
      className="group block rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-4 transition hover:-translate-y-0.5 hover:border-[var(--color-surface-3)] hover:shadow-lg hover:shadow-black/40"
    >
      <div className="mb-3 flex items-center justify-between text-[10px] uppercase tracking-wider text-[var(--color-text-faint)]">
        <Badge
          variant={
            match.status === "live"
              ? "danger"
              : match.status === "finished"
              ? "neutral"
              : match.status === "postponed"
              ? "warning"
              : "club"
          }
        >
          {match.status}
        </Badge>
        <span>MD {match.matchday}</span>
      </div>

      <div className="grid grid-cols-3 items-center gap-2">
        <div className="flex flex-col items-center gap-1.5">
          <ClubBadge club={home} size={variant === "compact" ? "sm" : "md"} />
          <span className="text-xs font-semibold">{home.shortName}</span>
        </div>

        <div className="text-center">
          {match.status === "finished" && match.finalScore ? (
            <p className="font-display text-2xl tabular-nums">
              {match.finalScore.home}–{match.finalScore.away}
            </p>
          ) : (
            <p className="font-display text-lg text-[var(--color-text-muted)]">vs</p>
          )}
          <p className="mt-0.5 text-[10px] text-[var(--color-text-faint)]">
            {formatKickoff(match.kickoffISO)}
          </p>
        </div>

        <div className="flex flex-col items-center gap-1.5">
          <ClubBadge club={away} size={variant === "compact" ? "sm" : "md"} />
          <span className="text-xs font-semibold">{away.shortName}</span>
        </div>
      </div>

      {userPrediction && (
        <div className="mt-3 flex items-center justify-center gap-2 rounded-lg border border-dashed border-[var(--color-line)] bg-[var(--color-surface-2)]/50 px-3 py-1.5 text-xs text-[var(--color-text-muted)]">
          <span>Your call</span>
          <span className="font-display tabular-nums text-[var(--color-text)]">
            {userPrediction.home}–{userPrediction.away}
          </span>
        </div>
      )}

      <p className="mt-3 text-center text-xs text-[var(--color-text-muted)] transition group-hover:text-[var(--color-text)]">
        {match.status === "finished" ? "See your result →" : "Make a prediction →"}
      </p>
    </Link>
  );
}
