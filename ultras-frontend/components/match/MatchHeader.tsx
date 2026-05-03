import type { Match } from "@/app/types";
import { getClub } from "@/lib/mock/clubs";
import { ClubBadge } from "@/components/club/ClubBadge";
import { Badge } from "@/components/ui/Badge";
import { formatKickoff } from "@/lib/utils";

export function MatchHeader({ match, hideScore }: { match: Match; hideScore?: boolean }) {
  const home = getClub(match.homeId);
  const away = getClub(match.awayId);
  if (!home || !away) return null;

  return (
    <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-5">
      <div className="mb-4 flex items-center justify-between text-xs text-[var(--color-text-muted)]">
        <Badge variant={match.status === "live" ? "danger" : match.status === "finished" ? "neutral" : "club"}>
          {match.status}
        </Badge>
        <span>MD {match.matchday} · {match.venue}</span>
      </div>

      <div className="grid grid-cols-3 items-center gap-2">
        <div className="flex flex-col items-center text-center">
          <ClubBadge club={home} size="lg" showLabel />
        </div>
        <div className="flex flex-col items-center justify-center">
          {match.finalScore && !hideScore ? (
            <p className="font-display text-4xl tabular-nums">
              {match.finalScore.home}<span className="mx-2 text-[var(--color-text-faint)]">–</span>{match.finalScore.away}
            </p>
          ) : (
            <p className="font-display text-3xl text-[var(--color-text-muted)]">vs</p>
          )}
          <p className="mt-1 text-[10px] uppercase tracking-wider text-[var(--color-text-faint)]">
            {formatKickoff(match.kickoffISO)}
          </p>
        </div>
        <div className="flex flex-col items-center text-center">
          <ClubBadge club={away} size="lg" showLabel />
        </div>
      </div>
    </div>
  );
}
