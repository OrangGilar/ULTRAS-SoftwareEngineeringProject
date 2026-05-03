"use client";

import { useState } from "react";
import type { Game } from "@/app/types";
import { GameShell } from "@/components/games/GameShell";
import { Button } from "@/components/ui/Button";
import { triviaQuestions } from "@/lib/mock/games";
import { useLocalUser } from "@/hooks/useLocalUser";
import { cn } from "@/lib/utils";

type Phase = "intro" | "playing" | "done";

export function TriviaGame({ game }: { game: Game }) {
  const { recordGameScore } = useLocalUser();
  const [phase, setPhase] = useState<Phase>("intro");
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);

  const q = triviaQuestions[idx];

  const onPick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === q.answerIndex) setScore((s) => s + 1);
    setTimeout(() => {
      const isLast = idx >= triviaQuestions.length - 1;
      if (isLast) {
        const finalScore = score + (i === q.answerIndex ? 1 : 0);
        const reward = finalScore >= 3 ? game.rewardPerWin : 0;
        recordGameScore(game.slug, finalScore, reward);
        setPhase("done");
      } else {
        setIdx((n) => n + 1);
        setPicked(null);
      }
    }, 700);
  };

  return (
    <GameShell title={game.name} subtitle={`Q${Math.min(idx + 1, triviaQuestions.length)} of ${triviaQuestions.length}`} score={score}>
      {phase === "intro" && (
        <div className="space-y-5 text-center">
          <p className="text-sm text-[var(--color-text-muted)]">
            Answer 5 quick questions on Liga 1. 3+ correct unlocks {game.rewardPerWin} pts.
          </p>
          <Button onClick={() => setPhase("playing")} size="lg">Start</Button>
        </div>
      )}

      {phase === "playing" && (
        <div className="space-y-4">
          <h2 className="font-display text-xl leading-tight">{q.prompt}</h2>
          <div className="grid gap-2">
            {q.choices.map((c, i) => {
              const correct = picked !== null && i === q.answerIndex;
              const wrong = picked === i && i !== q.answerIndex;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => onPick(i)}
                  className={cn(
                    "rounded-xl border p-3 text-left text-sm transition",
                    picked === null && "border-[var(--color-line)] bg-[var(--color-surface)] hover:border-[var(--color-surface-3)]",
                    correct && "border-[var(--color-success)] bg-[var(--color-success)]/15",
                    wrong && "border-[var(--color-danger)] bg-[var(--color-danger)]/15"
                  )}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {phase === "done" && (
        <div className="space-y-4 text-center">
          <p className="text-xs uppercase tracking-wider text-[var(--color-text-muted)]">Final score</p>
          <p className="font-display text-6xl tabular-nums text-[var(--color-accent)]">
            {score}<span className="text-[var(--color-text-faint)]">/{triviaQuestions.length}</span>
          </p>
          {score >= 3 ? (
            <p className="text-sm text-[var(--color-success)]">+{game.rewardPerWin} pts added.</p>
          ) : (
            <p className="text-sm text-[var(--color-text-muted)]">Get 3+ next time to claim points.</p>
          )}
          <Button
            onClick={() => {
              setPhase("intro");
              setIdx(0);
              setScore(0);
              setPicked(null);
            }}
          >
            Play again
          </Button>
        </div>
      )}
    </GameShell>
  );
}
