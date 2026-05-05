"use client";

import Link from "next/link";
import { upcomingMatches, finishedMatches } from "@/lib/mock/matches";
import { threads } from "@/lib/mock/threads";
import { games } from "@/lib/mock/games";
import { getClub } from "@/lib/mock/clubs";
import { PageContainer, PageHeader, SectionHeading } from "@/components/layout/PageContainer";
import { MatchCard } from "@/components/match/MatchCard";
import { ThreadCard } from "@/components/community/ThreadCard";
import { GameTile } from "@/components/games/GameTile";
import { PointsBalance } from "@/components/rewards/PointsBalance";
import { useLocalUser } from "@/hooks/useLocalUser";

export default function FeedPage() {
  const { user } = useLocalUser();
  const club = getClub(user.clubId);
  const upcoming = upcomingMatches();
  const recentResult = finishedMatches()[0];
  const yourNext =
    upcoming.find((m) => m.homeId === user.clubId || m.awayId === user.clubId) ?? upcoming[0];
  const trendingThreads = threads.slice(0, 3);
  const homeClub = recentResult ? getClub(recentResult.homeId) : null;
  const awayClub = recentResult ? getClub(recentResult.awayId) : null;

  return (
    <PageContainer width="md" className="space-y-12">
      <PageHeader
        eyebrow={`Welcome back, ${user.displayName}`}
        title={
          club ? (
            <>
              Another round of <span className="text-[var(--color-primary)]">{club.shortName}</span> football.
            </>
          ) : (
            <>Pick a club. Pick a side.</>
          )
        }
      />

      <PointsBalance />

      {recentResult && homeClub && awayClub && (
        <section>
          <SectionHeading
            title="Recent result"
            action={
              <Link
                href={`/matches/${recentResult.id}/result`}
                className="font-mono-label text-[10px] text-[var(--color-text-muted)] transition hover:text-[var(--color-primary)]"
              >
                Open →
              </Link>
            }
          />
          <Link
            href={`/matches/${recentResult.id}/result`}
            className="group block transition"
          >
            <p className="font-display text-2xl font-bold leading-tight tracking-[-0.02em] transition group-hover:text-[var(--color-primary)] md:text-3xl">
              See how your prediction landed against {homeClub.shortName} vs {awayClub.shortName}.
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
            <Link
              href="/community"
              className="font-mono-label text-[10px] text-[var(--color-text-muted)] transition hover:text-[var(--color-primary)]"
            >
              See all →
            </Link>
          }
        />
        <div>
          {trendingThreads.map((t) => (
            <ThreadCard key={t.id} thread={t} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeading title="Daily mini-games" />
        <div className="grid grid-cols-1 gap-0 sm:grid-cols-3">
          {games.map((g) => (
            <GameTile key={g.slug} game={g} highScore={user.gameHighScores[g.slug]} />
          ))}
        </div>
      </section>
    </PageContainer>
  );
}
