"use client";

import { useEffect, useMemo, useState } from "react";
import type { Game } from "@/app/types";
import { GameShell } from "@/components/games/GameShell";
import { Button } from "@/components/ui/Button";
import { clubs } from "@/lib/mock/clubs";
import { useLocalUser } from "@/hooks/useLocalUser";
import { cn } from "@/lib/utils";

type Card = { id: number; clubId: string; matched: boolean; flipped: boolean };

function buildDeck(): Card[] {
  const sample = clubs.slice(0, 6);
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
    setDeck(buildDeck());
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

  const club = useMemo(() => Object.fromEntries(clubs.map((c) => [c.id, c])), []);

  return (
    <GameShell title={game.name} subtitle={`Moves: ${moves}`} score={matched}>
      {phase === "intro" && (
        <div className="space-y-5 text-center">
          <p className="text-sm text-[var(--color-text-muted)]">
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
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
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
                  "aspect-square rounded-2xl border text-3xl transition",
                  flipped
                    ? "border-[var(--color-line)]"
                    : "border-[var(--color-line)] bg-[var(--color-surface)] hover:border-[var(--color-surface-3)]",
                  c.matched && "opacity-50"
                )}
                style={
                  flipped
                    ? { background: `linear-gradient(135deg, ${cl.colors[0]}, ${cl.colors[1]})` }
                    : undefined
                }
                aria-label={flipped ? cl.name : "Hidden card"}
              >
                {flipped ? (
                  cl.logo ? (
                    <img src={cl.logo} alt={cl.name} className="h-4/5 w-4/5 object-contain" />
                  ) : (
                    cl.crestEmoji
                  )
                ) : "?"}
              </button>
            );
          })}
        </div>
      )}

      {phase === "done" && (
        <div className="space-y-4 text-center">
          <p className="text-xs uppercase tracking-wider text-[var(--color-text-muted)]">Cleared in</p>
          <p className="font-display text-6xl tabular-nums text-[var(--color-accent)]">{moves} moves</p>
          <Button
            onClick={() => {
              reset();
              setPhase("playing");
            }}
          >
            Play again
          </Button>
        </div>
      )}
    </GameShell>
  );
}
