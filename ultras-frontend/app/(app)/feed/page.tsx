"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { upcomingMatches, finishedMatches } from "@/lib/mock/matches";
import { games } from "@/lib/mock/games";
import { getClub } from "@/lib/mock/clubs";
import { PageContainer, PageHeader, SectionHeading } from "@/components/layout/PageContainer";
import { MatchCard } from "@/components/match/MatchCard";
import { ThreadCard } from "@/components/community/ThreadCard";
import { GameTile } from "@/components/games/GameTile";
import { PointsBalance } from "@/components/rewards/PointsBalance";
import { useLocalUser } from "@/hooks/useLocalUser";
import { getThreads, type ApiThread, ApiError } from "@/lib/api";

export default function FeedPage() {
  const { user } = useLocalUser();
  const club = getClub(user.clubId);
  const upcoming = upcomingMatches();
  const recentResult = finishedMatches()[0];
  const yourNext =
    upcoming.find((m) => m.homeId === user.clubId || m.awayId === user.clubId) ?? upcoming[0];
  const homeClub = recentResult ? getClub(recentResult.homeId) : null;
  const awayClub = recentResult ? getClub(recentResult.awayId) : null;

  const [trendingThreads, setTrendingThreads] = useState<ApiThread[]>([]);
  const [threadsLoading, setThreadsLoading] = useState(true);
  const [threadsError, setThreadsError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getThreads({ limit: 3 });
        if (!cancelled) setTrendingThreads(data);
      } catch (err) {
        if (cancelled) return;
        const apiErr = err instanceof ApiError ? err : new ApiError(String(err), 0);
        setThreadsError(
          apiErr.status === 0
            ? "Couldn't reach the server. Is the backend running?"
            : `Failed to load threads: ${apiErr.message}`,
        );
      } finally {
        if (!cancelled) setThreadsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

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
        {threadsError ? (
          <div role="alert" className="border border-[var(--color-primary)] py-10 px-5 font-mono-label text-xs text-[var(--color-primary)]">
            {threadsError}
          </div>
        ) : threadsLoading ? (
          <div className="border border-dashed border-[var(--color-line)] py-10 text-center font-mono-label text-xs text-[var(--color-text-muted)]">
            Loading threads…
          </div>
        ) : trendingThreads.length === 0 ? (
          <div className="border border-dashed border-[var(--color-line)] py-10 text-center font-mono-label text-xs text-[var(--color-text-muted)]">
            No threads yet. Be the first to start one.
          </div>
        ) : (
          <div>
            {trendingThreads.map((t) => (
              <ThreadCard key={t.id} thread={t} />
            ))}
          </div>
        )}
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
