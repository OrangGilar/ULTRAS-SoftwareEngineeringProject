"use client";

import Link from "next/link";
import { upcomingMatches, finishedMatches } from "@/lib/mock/matches";
import { threads } from "@/lib/mock/threads";
import { games } from "@/lib/mock/games";
import { getClub } from "@/lib/mock/clubs";
import { PageContainer, SectionHeading } from "@/components/layout/PageContainer";
import { MatchCard } from "@/components/match/MatchCard";
import { ThreadCard } from "@/components/community/ThreadCard";
import { GameTile } from "@/components/games/GameTile";
import { PointsBalance } from "@/components/rewards/PointsBalance";
import { useLocalUser } from "@/hooks/useLocalUser";
import { Button } from "@/components/ui/Button";

export default function FeedPage() {
  const { user } = useLocalUser();
  const club = getClub(user.clubId);
  const upcoming = upcomingMatches();
  const recentResult = finishedMatches()[0];
  const yourNext =
    upcoming.find((m) => m.homeId === user.clubId || m.awayId === user.clubId) ?? upcoming[0];
  const trendingThreads = threads.slice(0, 3);

  return (
    <PageContainer width="md" className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
          Welcome back, {user.displayName}
        </p>
        <h1 className="mt-1 font-display text-3xl leading-tight">
          {club ? <>Another round of {club.shortName} football.</> : <>Pick a club, pick a side.</>}
        </h1>
      </div>

      <PointsBalance />

      {recentResult && (
        <section>
          <SectionHeading
            title="Result is in"
            action={
              <Link href={`/matches/${recentResult.id}/result`}>
                <Button size="sm" variant="secondary">Open</Button>
              </Link>
            }
          />
          <Link
            href={`/matches/${recentResult.id}/result`}
            className="block rounded-2xl border border-[var(--color-primary)]/40 bg-gradient-to-br from-[var(--color-primary)]/10 to-transparent p-4 transition hover:border-[var(--color-primary)]"
          >
            <p className="text-xs uppercase tracking-wider text-[var(--color-primary)]">
              Your reveal awaits
            </p>
            <p className="mt-1 text-base font-semibold">
              See how your prediction landed against {getClub(recentResult.homeId)?.shortName} vs {getClub(recentResult.awayId)?.shortName}.
            </p>
          </Link>
        </section>
      )}

      {yourNext && (
        <section>
          <SectionHeading title="Your next match" />
          <MatchCard
            match={yourNext}
            userPrediction={user.predictions[yourNext.id]?.score}
          />
        </section>
      )}

      <section>
        <SectionHeading
          title="Trending discussions"
          action={
            <Link href="/community" className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
              See all →
            </Link>
          }
        />
        <div className="space-y-3">
          {trendingThreads.map((t) => (
            <ThreadCard key={t.id} thread={t} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeading title="Daily mini-games" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {games.map((g) => (
            <GameTile key={g.slug} game={g} highScore={user.gameHighScores[g.slug]} />
          ))}
        </div>
      </section>
    </PageContainer>
  );
}
