"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { use } from "react";
import { useMatch, useMatches } from "@/hooks/useMatches";
import { useClubs } from "@/components/providers/ClubsProvider";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, ArrowRight } from "lucide-react";
import { MatchResultClient } from "./Client";

export default function MatchResultPage({
  params,
}: {
  params: Promise<{ matchId: string }>;
}) {
  const { matchId } = use(params);
  const matchState = useMatch(matchId);
  const allMatchesState = useMatches();
  const { getClub, loading: clubsLoading } = useClubs();

  if (matchState.status === "loading" || clubsLoading) {
    return (
      <div className="border border-dashed border-[var(--color-line)] py-16 text-center font-mono-label text-xs text-[var(--color-text-muted)]">
        Loading match…
      </div>
    );
  }

  if (matchState.status === "error") {
    if (matchState.error.status === 404) notFound();
    return (
      <div role="alert" className="border border-[var(--color-primary)] py-10 px-5 font-mono-label text-xs text-[var(--color-primary)]">
        Couldn't load this match: {matchState.error.message}
      </div>
    );
  }

  const match = matchState.data;
  const home = getClub(match.homeId);
  const away = getClub(match.awayId);
  if (!home || !away) notFound();

  if (match.status === "postponed") {
    return (
      <>
        <Link href="/matches" className="inline-flex items-center gap-1 font-mono-label text-[10px] text-[var(--color-text-muted)] transition hover:text-[var(--color-primary)]">
          <ChevronLeft size={14} />
          Back
        </Link>
        <div className="border-y border-[var(--color-line)] py-12 text-center">
          <p className="font-display text-4xl font-bold tracking-[-0.02em]">Match postponed.</p>
          <p className="prose-line mx-auto mt-3 text-sm text-[var(--color-text-muted)]">
            We'll restore your prediction once the rescheduled fixture is announced.
          </p>
        </div>
      </>
    );
  }

  if (match.status !== "finished" || !match.finalScore) {
    return (
      <>
        <Link href="/matches" className="inline-flex items-center gap-1 font-mono-label text-[10px] text-[var(--color-text-muted)] transition hover:text-[var(--color-primary)]">
          <ChevronLeft size={14} />
          Back
        </Link>
        <div className="border-y border-[var(--color-line)] py-12 text-center">
          <p className="font-display text-4xl font-bold tracking-[-0.02em]">Not finished yet.</p>
          <p className="prose-line mx-auto mt-3 text-sm text-[var(--color-text-muted)]">
            Come back after the final whistle for your reveal.
          </p>
          <Link href={`/matches/${match.id}/predict`} className="mt-6 inline-block">
            <Button>Adjust your prediction</Button>
          </Link>
        </div>
      </>
    );
  }

  const allMatches = allMatchesState.status === "success" ? allMatchesState.data : [];
  const next = allMatches
    .filter((m) => m.status === "upcoming")
    .sort((a, b) => a.kickoffISO.localeCompare(b.kickoffISO))[0];
  const nextHome = next ? getClub(next.homeId) : null;
  const nextAway = next ? getClub(next.awayId) : null;

  return (
    <>
      <Link href="/matches" className="inline-flex items-center gap-1 font-mono-label text-[10px] text-[var(--color-text-muted)] transition hover:text-[var(--color-primary)]">
        <ChevronLeft size={14} />
        Back to fixtures
      </Link>

      <MatchResultClient match={match} home={home} away={away} />

      <div className="grid gap-0 sm:grid-cols-2">
        <Link
          href="/community"
          className="group flex items-center justify-between border-b border-[var(--color-line)] py-5 transition hover:border-[var(--color-text)] sm:border-r sm:border-b-0 sm:pr-5"
        >
          <div>
            <p className="font-mono-label text-[10px] text-[var(--color-text-faint)]">Community</p>
            <p className="mt-1 font-display text-lg font-bold tracking-[-0.01em] transition group-hover:text-[var(--color-primary)]">
              Discuss this match
            </p>
          </div>
          <ArrowRight size={16} className="text-[var(--color-text-faint)] transition group-hover:text-[var(--color-primary)]" />
        </Link>
        {next && nextHome && nextAway && (
          <Link
            href={`/matches/${next.id}/predict`}
            className="group flex items-center justify-between py-5 transition hover:border-[var(--color-text)] sm:pl-5"
          >
            <div>
              <p className="font-mono-label text-[10px] text-[var(--color-text-faint)]">Next up</p>
              <p className="mt-1 font-display text-lg font-bold tracking-[-0.01em] transition group-hover:text-[var(--color-primary)]">
                {nextHome.shortName} vs {nextAway.shortName}
              </p>
            </div>
            <ArrowRight size={16} className="text-[var(--color-text-faint)] transition group-hover:text-[var(--color-primary)]" />
          </Link>
        )}
      </div>
    </>
  );
}
