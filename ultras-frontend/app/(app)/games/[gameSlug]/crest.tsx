"use client";

import { useState } from "react";
import type { Game } from "@/app/types";
import { GameShell } from "@/components/games/GameShell";
import { Button } from "@/components/ui/Button";
import { crestQuestions } from "@/lib/mock/games";
import { clubsById } from "@/lib/mock/clubs";
import { useLocalUser } from "@/hooks/useLocalUser";
import { cn, shuffle } from "@/lib/utils";

type CrestQ = { clubId: string; choices: string[]; answerIndex: number };

function buildCrestRound(): CrestQ[] {
  return shuffle(crestQuestions).slice(0, 4).map((q) => {
    const correct = q.choices[q.answerIndex];
    const choices = shuffle([...q.choices]);
    return { ...q, choices, answerIndex: choices.indexOf(correct) };
  });
}

export function CrestGame({ game }: { game: Game }) {
  const { recordGameScore } = useLocalUser();
  const [phase, setPhase] = useState<"intro" | "playing" | "done">("intro");
  const [questions, setQuestions] = useState<CrestQ[]>(() => buildCrestRound());
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);

  const q = questions[idx];
  const club = clubsById[q.clubId];

  return (
    <GameShell
      title={game.name}
      subtitle={`Round ${Math.min(idx + 1, questions.length)} of ${questions.length}`}
      score={score}
    >
      {phase === "intro" && (
        <div className="mx-auto max-w-md space-y-6 py-12 text-center">
          <p className="prose-line text-base text-[var(--color-text-muted)]">
            We blur the crest. You name the club. {crestQuestions.length} rounds. 3+ wins {game.rewardPerWin} pts.
          </p>
          <Button onClick={() => { setQuestions(buildCrestRound()); setPhase("playing"); }} size="lg">
            Start
          </Button>
        </div>
      )}

      {phase === "playing" && club && (
        <div className="space-y-8">
          <div
            className="mx-auto grid h-48 w-48 place-items-center text-7xl"
            style={{
              filter: picked !== null ? "blur(0)" : "blur(12px) saturate(0.7)",
              transition: "filter 220ms ease",
            }}
            aria-hidden
          >
            {club.logo ? (
              <img src={club.logo} alt={club.name} className="h-full w-full object-contain" />
            ) : (
              club.crestEmoji
            )}
          </div>
          <div className="grid gap-3">
            {q.choices.map((c, i) => {
              const isCorrect = picked !== null && i === q.answerIndex;
              const isWrong = picked === i && i !== q.answerIndex;
              return (
                <button
                  key={c}
                  type="button"
                  disabled={picked !== null}
                  onClick={() => {
                    setPicked(i);
                    const right = i === q.answerIndex;
                    if (right) setScore((s) => s + 1);
                    setTimeout(() => {
                      if (idx >= questions.length - 1) {
                        const finalScore = score + (right ? 1 : 0);
                        const reward = finalScore >= 3 ? game.rewardPerWin : 0;
                        recordGameScore(game.slug, finalScore, reward);
                        setPhase("done");
                      } else {
                        setIdx((n) => n + 1);
                        setPicked(null);
                      }
                    }, 800);
                  }}
                  className={cn(
                    "border p-4 text-left text-base transition",
                    picked === null &&
                      "border-[var(--color-line)] hover:border-[var(--color-text)]",
                    isCorrect && "border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-pure-white)]",
                    isWrong && "border-[var(--color-line)] text-[var(--color-text-faint)] line-through",
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
            <span className="text-[var(--color-text-faint)]">/{questions.length}</span>
          </p>
          {score >= 3 ? (
            <p className="font-mono-label text-xs text-[var(--color-primary)]">
              +{game.rewardPerWin} pts added.
            </p>
          ) : (
            <p className="font-mono-label text-xs text-[var(--color-text-muted)]">
              3+ next time gets you the points.
            </p>
          )}
          <Button
            onClick={() => {
              setQuestions(buildCrestRound());
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
