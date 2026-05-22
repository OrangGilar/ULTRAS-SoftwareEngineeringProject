"use client";

import { useState } from "react";
import type { Game } from "@/app/types";
import { GameShell } from "@/components/games/GameShell";
import { Button } from "@/components/ui/Button";
import { triviaQuestions } from "@/lib/mock/games";
import { useLocalUser } from "@/hooks/useLocalUser";
import { cn, shuffle } from "@/lib/utils";

type TriviaQ = { prompt: string; choices: string[]; answerIndex: number };
type Phase = "intro" | "playing" | "done";

function buildRound(): TriviaQ[] {
  return shuffle(triviaQuestions).slice(0, 5).map((q) => {
    const correct = q.choices[q.answerIndex];
    const choices = shuffle([...q.choices]);
    return { ...q, choices, answerIndex: choices.indexOf(correct) };
  });
}

export function TriviaGame({ game }: { game: Game }) {
  const { recordGameScore } = useLocalUser();
  const [phase, setPhase] = useState<Phase>("intro");
  const [questions, setQuestions] = useState<TriviaQ[]>(() => buildRound());
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);

  const q = questions[idx];

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
    <GameShell
      title={game.name}
      subtitle={`Q${Math.min(idx + 1, triviaQuestions.length)} of ${triviaQuestions.length}`}
      score={score}
    >
      {phase === "intro" && (
        <div className="mx-auto max-w-md space-y-6 py-12 text-center">
          <p className="prose-line text-base text-[var(--color-text-muted)]">
            Answer 5 quick questions on Liga 1. 3+ correct unlocks {game.rewardPerWin} pts.
          </p>
          <Button onClick={() => { setQuestions(buildRound()); setPhase("playing"); }} size="lg">
            Start
          </Button>
        </div>
      )}

      {phase === "playing" && (
        <div className="space-y-8">
          <h2 className="font-display text-2xl font-bold leading-tight tracking-[-0.02em] md:text-3xl">
            {q.prompt}
          </h2>
          <div className="grid gap-3">
            {q.choices.map((c, i) => {
              const correct = picked !== null && i === q.answerIndex;
              const wrong = picked === i && i !== q.answerIndex;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => onPick(i)}
                  className={cn(
                    "border p-4 text-left text-base transition",
                    picked === null &&
                      "border-[var(--color-line)] hover:border-[var(--color-text)]",
                    correct && "border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-pure-white)]",
                    wrong && "border-[var(--color-line)] text-[var(--color-text-faint)] line-through",
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
        <div className="mx-auto max-w-md space-y-6 py-12 text-center">
          <p className="font-mono-label text-[10px] text-[var(--color-text-faint)]">
            Final score
          </p>
          <p className="font-display text-7xl font-bold tabular-nums leading-none tracking-[-0.04em] md:text-8xl">
            {score}
            <span className="text-[var(--color-text-faint)]">/{triviaQuestions.length}</span>
          </p>
          {score >= 3 ? (
            <p className="font-mono-label text-xs text-[var(--color-primary)]">
              +{game.rewardPerWin} pts added.
            </p>
          ) : (
            <p className="font-mono-label text-xs text-[var(--color-text-muted)]">
              Get 3+ next time to claim points.
            </p>
          )}
          <Button
            onClick={() => {
              setQuestions(buildRound());
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
