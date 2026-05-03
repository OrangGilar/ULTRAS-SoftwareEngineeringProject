"use client";

import { useState } from "react";
import type { Game } from "@/app/types";
import { GameShell } from "@/components/games/GameShell";
import { Button } from "@/components/ui/Button";
import { crestQuestions } from "@/lib/mock/games";
import { clubsById } from "@/lib/mock/clubs";
import { useLocalUser } from "@/hooks/useLocalUser";
import { cn } from "@/lib/utils";

export function CrestGame({ game }: { game: Game }) {
  const { recordGameScore } = useLocalUser();
  const [phase, setPhase] = useState<"intro" | "playing" | "done">("intro");
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);

  const q = crestQuestions[idx];
  const club = clubsById[q.clubId];

  return (
    <GameShell title={game.name} subtitle={`Round ${Math.min(idx + 1, crestQuestions.length)} of ${crestQuestions.length}`} score={score}>
      {phase === "intro" && (
        <div className="space-y-5 text-center">
          <p className="text-sm text-[var(--color-text-muted)]">
            We blur the crest. You name the club. {crestQuestions.length} rounds — 3+ wins {game.rewardPerWin} pts.
          </p>
          <Button onClick={() => setPhase("playing")} size="lg">Start</Button>
        </div>
      )}

      {phase === "playing" && club && (
        <div className="space-y-5">
          <div className="mx-auto grid h-44 w-44 place-items-center rounded-full text-7xl ring-2 ring-[var(--color-line)]"
            style={{
              background: `linear-gradient(135deg, ${club.colors[0]}, ${club.colors[1]})`,
              filter: picked !== null ? "blur(0)" : "blur(8px) saturate(0.7)",
              transition: "filter 220ms ease",
            }}
            aria-hidden
          >
            {club.logo ? (
              <img src={club.logo} alt={club.name} className="h-4/5 w-4/5 object-contain" />
            ) : (
              club.crestEmoji
            )}
          </div>
          <div className="grid gap-2">
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
                      if (idx >= crestQuestions.length - 1) {
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
                    "rounded-xl border p-3 text-left text-sm transition",
                    picked === null && "border-[var(--color-line)] bg-[var(--color-surface)] hover:border-[var(--color-surface-3)]",
                    isCorrect && "border-[var(--color-success)] bg-[var(--color-success)]/15",
                    isWrong && "border-[var(--color-danger)] bg-[var(--color-danger)]/15"
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
          <p className="font-display text-6xl tabular-nums text-[var(--color-accent)]">
            {score}<span className="text-[var(--color-text-faint)]">/{crestQuestions.length}</span>
          </p>
          {score >= 3 ? (
            <p className="text-sm text-[var(--color-success)]">+{game.rewardPerWin} pts added.</p>
          ) : (
            <p className="text-sm text-[var(--color-text-muted)]">3+ next time gets you the points.</p>
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
