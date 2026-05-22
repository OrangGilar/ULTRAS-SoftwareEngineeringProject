"use client";

import Link from "next/link";
import Image from "next/image";
import { upcomingMatches, finishedMatches } from "@/lib/mock/matches";
import { findFixtureForClub } from "@/lib/mock/upcomingFixtures";
import { threads } from "@/lib/mock/threads";
import { games } from "@/lib/mock/games";
import { getClub, clubs } from "@/lib/mock/clubs";
import { PageContainer, PageHeader, SectionHeading } from "@/components/layout/PageContainer";
import { MatchCard } from "@/components/match/MatchCard";
import { GameTile } from "@/components/games/GameTile";
import { PointsBalance } from "@/components/rewards/PointsBalance";
import { useLocalUser } from "@/hooks/useLocalUser";
<<<<<<< HEAD
=======

const FEATURED_CLUB_IDS = ["persib", "persija", "psm"];
>>>>>>> 3cedad9051b9ff06915df5d11f90cb14488ff9d3

export default function FeedPage() {
  const { user } = useLocalUser();
  const club = getClub(user.clubId);
  const upcoming = upcomingMatches();
  const recentResult = finishedMatches()[0];

  // "Your next match" preference order:
  //   1. The user's team's fixture in the hardcoded upcoming slate. We look
  //      that up directly via findFixtureForClub so the new slate always wins
  //      over any stray older mock data that happens to involve their club.
  //   2. Any other upcoming fixture involving the user's team.
  //   3. The next upcoming fixture period.
  const yourNext =
    findFixtureForClub(user.clubId) ??
    upcoming.find((m) => m.homeId === user.clubId || m.awayId === user.clubId) ??
    upcoming[0];

  const trendingThreads = threads.slice(0, 3);
  const homeClub = recentResult ? getClub(recentResult.homeId) : null;
  const awayClub = recentResult ? getClub(recentResult.awayId) : null;

<<<<<<< HEAD
=======
  // User's club first, then fill from featured list, deduped, max 3.
  const featuredIds = [
    ...(user.clubId ? [user.clubId] : []),
    ...FEATURED_CLUB_IDS.filter((id) => id !== user.clubId),
  ].slice(0, 3);
  const featuredClubs = featuredIds.map((id) => getClub(id)).filter(Boolean) as NonNullable<ReturnType<typeof getClub>>[];
  const totalCommunities = clubs.length + 1; // +1 for General

>>>>>>> 3cedad9051b9ff06915df5d11f90cb14488ff9d3
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
          title="Communities"
          hint={`${totalCommunities} total`}
          action={
            <Link
              href="/community"
              className="font-mono-label text-[10px] text-[var(--color-text-muted)] transition hover:text-[var(--color-primary)]"
            >
              See all →
            </Link>
          }
        />
<<<<<<< HEAD
        <div>
          {trendingThreads.map((t) => (
            <ThreadCard key={t.id} thread={t} />
          ))}
        </div>
=======
        <ul className="grid grid-cols-3 gap-px bg-[var(--color-line)]">
          {featuredClubs.map((c) => (
            <li key={c.id} className="bg-[var(--color-bg)]">
              <Link
                href={`/community/c/${c.id}`}
                className="flex h-full flex-col items-center justify-center gap-2 p-5 text-center transition hover:bg-[var(--color-surface)]"
              >
                {c.logo ? (
                  <Image
                    src={c.logo}
                    alt={`${c.name} crest`}
                    width={40}
                    height={40}
                    className="h-10 w-10 object-contain"
                  />
                ) : (
                  <span
                    className="grid h-10 w-10 place-items-center rounded-full font-display text-sm font-bold text-[var(--color-pure-white)]"
                    style={{ backgroundColor: c.colors[0] }}
                  >
                    {c.shortName.slice(0, 2)}
                  </span>
                )}
                <span className="font-display text-sm font-bold leading-tight tracking-[-0.01em]">
                  {c.shortName}
                </span>
              </Link>
            </li>
          ))}
        </ul>
>>>>>>> 3cedad9051b9ff06915df5d11f90cb14488ff9d3
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
