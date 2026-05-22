"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { recommendClubs, type QuizAnswer, type QuizMatch } from "@/lib/mock/quiz";
import { ClubRecommendationCard } from "@/components/club/ClubRecommendationCard";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { MatchCard } from "@/components/match/MatchCard";
import { useLocalUser } from "@/hooks/useLocalUser";
import { findFixtureForClub } from "@/lib/mock/upcomingFixtures";

const STORAGE_KEY = "ultras:quiz:answers:v1";

/**
 * Result page after the onboarding quiz.
 *
 * Adds a "your team's next match" section under the reveal: looks up the
 * top-recommended club in the hardcoded upcoming fixture slate, and if
 * present, shows it as a clickable MatchCard linking to the predict page.
 * If the club isn't in the slate this section silently doesn't render —
 * the rest of the page works the same.
 */
export default function QuizResultPage() {
  const router = useRouter();
  const { adoptClub } = useLocalUser();
  const [results, setResults] = useState<QuizMatch[] | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [adopted, setAdopted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      const raw = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
      const answers: QuizAnswer[] = raw ? JSON.parse(raw) : [];
      setResults(recommendClubs(answers));
    }, 600);
    return () => clearTimeout(t);
  }, []);

  if (!results) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-72 w-full" rounded="lg" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-28" rounded="lg" />
          <Skeleton className="h-28" rounded="lg" />
        </div>
      </div>
    );
  }

  const top = results[activeIdx];
  const others = results.filter((_, i) => i !== activeIdx);

  // Look up the top club's next match in the hardcoded slate. Returns undefined
  // if their team isn't playing in this round — we handle both cases below.
  const nextMatch = findFixtureForClub(top.club.id);

  return (
    <div className="space-y-10">
      <header>
        <p className="font-mono-label text-[10px] text-[var(--color-text-faint)]">
          Your Liga 1 match
        </p>
        <h1 className="mt-3 font-display text-5xl font-bold leading-[0.95] tracking-[-0.04em] md:text-6xl">
          {top.club.name}.
        </h1>
      </header>

      <ClubRecommendationCard
        club={top.club}
        matchPercent={top.matchPercent}
        reasons={top.reasons.length ? top.reasons : ["Plays the football you love"]}
        primary
      />

      {!adopted ? (
        <Button
          fullWidth
          size="lg"
          onClick={() => {
            adoptClub(top.club.id);
            setAdopted(true);
            setTimeout(() => router.push("/feed"), 900);
          }}
        >
          Adopt {top.club.shortName}
        </Button>
      ) : (
        <div className="border-t-2 border-[var(--color-success)] pt-4 text-sm text-[var(--color-success)]">
          Welcome to the {top.club.motto.toLowerCase()}. Heading to your feed.
        </div>
      )}

      {/* Featured match for the user's new club. The whole MatchCard is clickable
          (routes to the predict page), so we don't need a separate CTA button. */}
      {nextMatch && (
        <section className="border-t border-[var(--color-line)] pt-8">
          <p className="mb-4 font-mono-label text-[10px] text-[var(--color-text-muted)]">
            {top.club.shortName}s next match — make your first prediction
          </p>
          <MatchCard match={nextMatch} />
        </section>
      )}

      {others.length > 0 && (
        <section>
          <p className="mb-4 border-b border-[var(--color-line)] pb-2 font-mono-label text-[10px] text-[var(--color-text-muted)]">
            Or consider
          </p>
          <div className="grid grid-cols-2 gap-0 divide-x divide-[var(--color-line)]">
            {others.map((r) => (
              <button
                key={r.club.id}
                type="button"
                onClick={() => {
                  setActiveIdx(results.findIndex((x) => x.club.id === r.club.id));
                  setAdopted(false);
                }}
                className="group flex items-center gap-3 py-4 px-4 text-left transition hover:bg-[var(--color-surface)]"
              >
                <span className="grid h-12 w-12 place-items-center" aria-hidden>
                  {r.club.logo ? (
                    <img src={r.club.logo} alt={r.club.name} className="h-full w-full object-contain" />
                  ) : (
                    <span className="text-xl">{r.club.crestEmoji}</span>
                  )}
                </span>
                <div className="min-w-0">
                  <p className="font-display text-base font-bold tracking-[-0.01em] transition group-hover:text-[var(--color-primary)]">
                    {r.club.shortName}
                  </p>
                  <p className="font-mono-label text-[10px] text-[var(--color-text-faint)]">
                    {r.matchPercent}% match
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
