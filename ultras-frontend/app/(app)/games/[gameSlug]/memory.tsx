"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Game } from "@/app/types";
import { GameShell } from "@/components/games/GameShell";
import { Button } from "@/components/ui/Button";
import { useClubs } from "@/components/providers/ClubsProvider";
import { useLocalUser } from "@/hooks/useLocalUser";
import { cn } from "@/lib/utils";

type Card = { id: number; clubId: string; matched: boolean; flipped: boolean };

function buildDeck(clubsList: { id: string }[]): Card[] {
  const sample = clubsList.slice(0, 6);
  const pairs = sample.flatMap((c, i) => [
    { id: i * 2, clubId: c.id, matched: false, flipped: false },
    { id: i * 2 + 1, clubId: c.id, matched: false, flipped: false },
  ]);
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
  }
  return pairs;
}

export function MemoryGame({ game }: { game: Game }) {
  const { recordGameScore } = useLocalUser();
  const { clubs, clubsById } = useClubs();
  const [phase, setPhase] = useState<"intro" | "playing" | "done">("intro");
  const [deck, setDeck] = useState<Card[]>([]);
  const [first, setFirst] = useState<number | null>(null);
  const [second, setSecond] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [matched, setMatched] = useState(0);

  const total = deck.length / 2;

  useEffect(() => {
    if (first !== null && second !== null) {
      setMoves((m) => m + 1);
      const a = deck.find((c) => c.id === first);
      const b = deck.find((c) => c.id === second);
      if (a && b && a.clubId === b.clubId) {
        setDeck((prev) => prev.map((c) => (c.id === a.id || c.id === b.id ? { ...c, matched: true } : c)));
        setMatched((m) => m + 1);
        setFirst(null);
        setSecond(null);
      } else {
        const t = setTimeout(() => {
          setDeck((prev) =>
            prev.map((c) => (c.id === first || c.id === second ? { ...c, flipped: false } : c))
          );
          setFirst(null);
          setSecond(null);
        }, 700);
        return () => clearTimeout(t);
      }
    }
    return;
  }, [first, second, deck]);

  useEffect(() => {
    if (phase === "playing" && matched === total) {
      const score = Math.max(0, total * 2 - moves);
      const reward = moves <= total + 4 ? game.rewardPerWin : Math.floor(game.rewardPerWin / 2);
      recordGameScore(game.slug, score, reward);
      setPhase("done");
    }
  }, [matched, total, moves, phase, game, recordGameScore]);

  const reset = () => {
    setDeck(buildDeck(clubs));
    setFirst(null);
    setSecond(null);
    setMoves(0);
    setMatched(0);
  };

  const handleFlip = (id: number) => {
    if (first !== null && second !== null) return;
    setDeck((prev) => prev.map((c) => (c.id === id ? { ...c, flipped: true } : c)));
    if (first === null) setFirst(id);
    else if (second === null && id !== first) setSecond(id);
  };

  const club = clubsById;

  return (
    <GameShell title={game.name} subtitle={`Moves ${moves}`} score={matched}>
      {phase === "intro" && (
        <div className="mx-auto max-w-md space-y-6 py-12 text-center">
          <p className="prose-line text-base text-[var(--color-text-muted)]">
            Match the crest pairs in as few moves as possible. Under {total + 5} moves wins full points.
          </p>
          <Button
            onClick={() => {
              reset();
              setPhase("playing");
            }}
            size="lg"
          >
            Start
          </Button>
        </div>
      )}

      {phase === "playing" && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {deck.map((c) => {
            const cl = club[c.clubId];
            const flipped = c.flipped || c.matched;
            return (
              <button
                key={c.id}
                type="button"
                disabled={flipped}
                onClick={() => handleFlip(c.id)}
                className={cn(
                  "aspect-square border text-3xl transition",
                  flipped
                    ? "border-[var(--color-line)] bg-transparent"
                    : "border-[var(--color-line)] bg-[var(--color-surface)] hover:border-[var(--color-text)]",
                  c.matched && "opacity-40",
                )}
                aria-label={flipped ? cl.name : "Hidden card"}
              >
                {flipped ? (
                  cl.logo ? (
                    <img src={cl.logo} alt={cl.name} className="h-4/5 w-4/5 object-contain" />
                  ) : (
                    cl.crestEmoji
                  )
                ) : (
                  <span className="font-mono-label text-[var(--color-text-faint)]">?</span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {phase === "done" && (
        <div className="mx-auto max-w-md space-y-6 py-12 text-center">
          <p className="font-mono-label text-[10px] text-[var(--color-text-faint)]">
            Cleared in
          </p>
          <p className="font-display text-7xl font-bold tabular-nums leading-none tracking-[-0.04em] md:text-8xl">
            {moves} <span className="text-2xl text-[var(--color-text-faint)]">moves</span>
          </p>
          <div className="flex flex-col items-center gap-3">
            <Button
              onClick={() => {
                reset();
                setPhase("playing");
              }}
            >
              Play again
            </Button>
            <Link
              href="/games"
              className="font-mono-label text-[10px] text-[var(--color-text-muted)] transition hover:text-[var(--color-text)]"
            >
              Back to games
            </Link>
          </div>
        </div>
      )}
    </GameShell>
  );
}
