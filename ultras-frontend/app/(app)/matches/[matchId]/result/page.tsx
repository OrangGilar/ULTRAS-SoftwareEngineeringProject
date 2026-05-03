import Link from "next/link";
import { notFound } from "next/navigation";
import { getMatch, upcomingMatches } from "@/lib/mock/matches";
import { getClub } from "@/lib/mock/clubs";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, MessagesSquare, ArrowRight } from "lucide-react";
import { MatchResultClient } from "./Client";

export default async function MatchResultPage({
  params,
}: {
  params: Promise<{ matchId: string }>;
}) {
  const { matchId } = await params;
  const match = getMatch(matchId);
  if (!match) notFound();

  const home = getClub(match.homeId);
  const away = getClub(match.awayId);
  if (!home || !away) notFound();

  if (match.status === "postponed") {
    return (
      <>
        <Link href="/matches">
          <Button variant="ghost" leftIcon={<ChevronLeft size={16} />}>Back</Button>
        </Link>
        <div className="rounded-2xl border border-[var(--color-accent)]/40 bg-[var(--color-accent)]/10 p-6 text-center">
          <p className="font-display text-2xl">Match postponed</p>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            We'll restore your prediction once the rescheduled fixture is announced.
          </p>
        </div>
      </>
    );
  }

  if (match.status !== "finished" || !match.finalScore) {
    return (
      <>
        <Link href="/matches">
          <Button variant="ghost" leftIcon={<ChevronLeft size={16} />}>Back</Button>
        </Link>
        <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-6 text-center">
          <p className="font-display text-2xl">Not finished yet</p>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Come back after the final whistle for your reveal.
          </p>
          <Link href={`/matches/${match.id}/predict`} className="mt-4 inline-block">
            <Button>Adjust your prediction</Button>
          </Link>
        </div>
      </>
    );
  }

  const next = upcomingMatches()[0];

  return (
    <>
      <Link href="/matches">
        <Button variant="ghost" leftIcon={<ChevronLeft size={16} />}>Back to fixtures</Button>
      </Link>

      <MatchResultClient match={match} home={home} away={away} />

      <div className="grid gap-3 sm:grid-cols-2">
        <Link href="/community" className="block">
          <div className="flex items-center justify-between rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-4 transition hover:border-[var(--color-surface-3)]">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--color-surface-2)] text-[var(--color-text-muted)]">
                <MessagesSquare size={18} />
              </span>
              <div>
                <p className="text-sm font-semibold">Discuss this match</p>
                <p className="text-xs text-[var(--color-text-muted)]">Drop a take in community</p>
              </div>
            </div>
            <ArrowRight size={16} className="text-[var(--color-text-faint)]" />
          </div>
        </Link>
        {next && (
          <Link href={`/matches/${next.id}/predict`} className="block">
            <div className="flex items-center justify-between rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-4 transition hover:border-[var(--color-surface-3)]">
              <div>
                <p className="text-xs uppercase tracking-wider text-[var(--color-text-faint)]">Next up</p>
                <p className="text-sm font-semibold">
                  {getClub(next.homeId)?.shortName} vs {getClub(next.awayId)?.shortName}
                </p>
              </div>
              <ArrowRight size={16} className="text-[var(--color-text-faint)]" />
            </div>
          </Link>
        )}
      </div>
    </>
  );
}
