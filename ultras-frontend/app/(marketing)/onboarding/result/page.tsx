"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { recommendClubs, type QuizAnswer, type QuizMatch } from "@/lib/mock/quiz";
import { ClubRecommendationCard } from "@/components/club/ClubRecommendationCard";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { useLocalUser } from "@/hooks/useLocalUser";

const STORAGE_KEY = "ultras:quiz:answers:v1";

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
      <div className="space-y-4">
        <Skeleton className="h-7 w-2/3" />
        <Skeleton className="h-72 w-full" rounded="lg" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-40" rounded="lg" />
          <Skeleton className="h-40" rounded="lg" />
        </div>
      </div>
    );
  }

  const top = results[activeIdx];
  const others = results.filter((_, i) => i !== activeIdx);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-xs uppercase tracking-widest text-[var(--color-text-faint)]">
          Your Liga 1 match
        </p>
        <h1 className="mt-2 font-display text-4xl">{top.club.name}</h1>
      </div>

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
        <div className="rounded-2xl border border-[var(--color-success)]/40 bg-[var(--color-success)]/10 p-4 text-center text-sm text-[var(--color-success)]">
          Welcome to the {top.club.motto.toLowerCase()}. Heading to your feed…
        </div>
      )}

      {others.length > 0 && (
        <div>
          <p className="mb-3 text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
            Or consider
          </p>
          <div className="grid grid-cols-2 gap-3">
            {others.map((r) => (
              <button
                key={r.club.id}
                type="button"
                onClick={() => {
                  setActiveIdx(results.findIndex((x) => x.club.id === r.club.id));
                  setAdopted(false);
                }}
                className="group rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-4 text-left transition hover:border-[var(--color-surface-3)]"
              >
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className="grid h-10 w-10 place-items-center rounded-full text-xl ring-1 ring-[var(--color-line)]"
                    style={{ background: `linear-gradient(135deg, ${r.club.colors[0]}, ${r.club.colors[1]})` }}
                  >
                    {r.club.logo ? (
                      <img src={r.club.logo} alt={r.club.name} className="h-4/5 w-4/5 object-contain" />
                    ) : (
                      r.club.crestEmoji
                    )}
                  </span>
                  <div>
                    <p className="text-sm font-bold">{r.club.shortName}</p>
                    <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-faint)]">
                      {r.matchPercent}% match
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
