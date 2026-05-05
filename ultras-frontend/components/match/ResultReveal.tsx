"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Club, PointsLine, Prediction } from "@/app/types";
import { ClubBadge } from "@/components/club/ClubBadge";
import { Button } from "@/components/ui/Button";
import { PointsCounter } from "./PointsCounter";
import { useReveal } from "@/hooks/useReveal";
import { cn } from "@/lib/utils";
import { RotateCcw } from "lucide-react";

export type ResultRevealProps = {
  matchId: string;
  home: Club;
  away: Club;
  finalScore: { home: number; away: number };
  prediction?: Prediction;
  pointsAwarded: number;
  breakdown: PointsLine[];
  autoReveal?: boolean;
  onSettled?: () => void;
};

type Verdict = "exact" | "outcome" | "miss" | "noPrediction";

const VERDICT_LABEL: Record<Verdict, string> = {
  exact: "Exact scoreline",
  outcome: "Outcome correct",
  miss: "Better next match",
  noPrediction: "No prediction",
};

function deriveVerdict(
  prediction: Prediction | undefined,
  finalScore: { home: number; away: number },
): Verdict {
  if (!prediction) return "noPrediction";
  if (prediction.score.home === finalScore.home && prediction.score.away === finalScore.away) {
    return "exact";
  }
  const predOutcome =
    prediction.score.home === prediction.score.away
      ? "draw"
      : prediction.score.home > prediction.score.away
      ? "home"
      : "away";
  const realOutcome =
    finalScore.home === finalScore.away
      ? "draw"
      : finalScore.home > finalScore.away
      ? "home"
      : "away";
  return predOutcome === realOutcome ? "outcome" : "miss";
}

const SLOT_DIGITS = ["3", "8", "1", "5", "0", "9", "2", "7", "4", "6"];

function ScoreSlot({ value, animating }: { value: number; animating: boolean }) {
  const [display, setDisplay] = useState<string>(animating ? SLOT_DIGITS[0] : String(value));
  useEffect(() => {
    if (!animating) {
      setDisplay(String(value));
      return;
    }
    let i = 0;
    const id = setInterval(() => {
      setDisplay(SLOT_DIGITS[i % SLOT_DIGITS.length]);
      i++;
    }, 70);
    const stop = setTimeout(() => {
      clearInterval(id);
      setDisplay(String(value));
    }, 650);
    return () => {
      clearInterval(id);
      clearTimeout(stop);
    };
  }, [animating, value]);
  return (
    <span className="font-display text-7xl font-bold tabular-nums leading-none tracking-[-0.04em] md:text-9xl">
      {display}
    </span>
  );
}

function Confetti({ active }: { active: boolean }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 24 }).map((_, i) => ({
        cx: `${(Math.random() - 0.5) * 360}px`,
        cy: `${-200 - Math.random() * 120}px`,
        delay: `${Math.random() * 220}ms`,
        bg: i % 2 === 0 ? "var(--color-primary)" : "var(--color-text)",
        rotate: `${Math.random() * 360}deg`,
      })),
    [],
  );
  if (!active) return null;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((p, i) => (
        <span
          key={i}
          aria-hidden
          className="absolute left-1/2 top-1/2 h-2 w-2"
          style={{
            background: p.bg,
            transform: `rotate(${p.rotate})`,
            ["--cx" as string]: p.cx,
            ["--cy" as string]: p.cy,
            animation: `ultras-confetti 1100ms ease-out forwards`,
            animationDelay: p.delay,
          }}
        />
      ))}
    </div>
  );
}

const REACTIONS = ["HOT", "MISS", "GOAT", "ICY"] as const;

export function ResultReveal({
  matchId,
  home,
  away,
  finalScore,
  prediction,
  pointsAwarded,
  breakdown,
  autoReveal,
  onSettled,
}: ResultRevealProps) {
  const verdict = deriveVerdict(prediction, finalScore);
  const { phase, start, replay } = useReveal(!!autoReveal, `ultras:reveal:${matchId}`);
  const settledOnceRef = useRef(false);

  useEffect(() => {
    if (phase === "settled" && !settledOnceRef.current) {
      settledOnceRef.current = true;
      onSettled?.();
    }
  }, [phase, onSettled]);

  const showScore = phase !== "idle";
  const animatingScore = phase === "revealingScore";
  const showVerdict = phase === "revealingOutcome" || phase === "revealingBreakdown" || phase === "settled";
  const showBreakdown = phase === "revealingBreakdown" || phase === "settled";
  const showTotal = phase === "settled";

  const winnerSide: "home" | "away" | "draw" =
    finalScore.home > finalScore.away ? "home" : finalScore.home < finalScore.away ? "away" : "draw";

  return (
    <section
      className={cn(
        "relative overflow-hidden border-y border-[var(--color-line)] py-12",
        verdict === "miss" && phase === "revealingOutcome" && "[animation:ultras-shake_500ms_ease-in-out_1]",
      )}
      aria-live="polite"
    >
      <Confetti active={showVerdict && verdict === "exact"} />

      <div className="relative grid grid-cols-3 items-center gap-3">
        <div
          className={cn(
            "flex flex-col items-center transition",
            showVerdict && winnerSide === "home" && "scale-105",
            showVerdict && winnerSide === "away" && "opacity-50",
          )}
        >
          <ClubBadge club={home} size="lg" showLabel />
        </div>

        <div className="text-center">
          {showScore ? (
            <div className="flex items-center justify-center gap-3">
              <ScoreSlot value={finalScore.home} animating={animatingScore} />
              <span className="font-display text-5xl font-bold leading-none text-[var(--color-text-faint)]">
                .
              </span>
              <ScoreSlot value={finalScore.away} animating={animatingScore} />
            </div>
          ) : (
            <button
              type="button"
              onClick={start}
              className="relative grid h-32 w-32 place-items-center rounded-full bg-[var(--color-primary)] font-mono-label text-xs text-[var(--color-pure-white)] transition hover:scale-105"
              style={{ animation: "ultras-pulse-ring 1.4s ease-out infinite" }}
            >
              Reveal
            </button>
          )}
          {prediction && phase !== "idle" && (
            <p className="mt-4 font-mono-label text-[10px] text-[var(--color-text-faint)]">
              You called {prediction.score.home}.{prediction.score.away}
            </p>
          )}
        </div>

        <div
          className={cn(
            "flex flex-col items-center transition",
            showVerdict && winnerSide === "away" && "scale-105",
            showVerdict && winnerSide === "home" && "opacity-50",
          )}
        >
          <ClubBadge club={away} size="lg" showLabel />
        </div>
      </div>

      {showVerdict && (
        <p
          className={cn(
            "mt-10 text-center font-display text-3xl font-bold tracking-[-0.02em] md:text-4xl",
            verdict === "exact" || verdict === "outcome"
              ? "text-[var(--color-primary)]"
              : "text-[var(--color-text-muted)]",
            "[animation:ultras-pop_420ms_ease-out_both]",
          )}
        >
          {VERDICT_LABEL[verdict]}.
        </p>
      )}

      {showBreakdown && (
        <ul className="mt-10 divide-y divide-[var(--color-line)]">
          {breakdown.length === 0 && (
            <li className="py-3 text-center text-sm text-[var(--color-text-muted)]">
              No prediction logged for this match.
            </li>
          )}
          {breakdown.map((line, i) => (
            <li
              key={`${line.label}-${i}`}
              className={cn(
                "flex items-center justify-between py-3",
                !line.hit && "opacity-50",
              )}
              style={{
                animation: "ultras-rise 360ms ease-out both",
                animationDelay: `${i * 80}ms`,
              }}
            >
              <span className="flex items-center gap-3 font-mono-label text-xs text-[var(--color-text-muted)]">
                <span
                  aria-hidden
                  className={cn(
                    "inline-block h-1.5 w-1.5 rounded-full",
                    line.hit ? "bg-[var(--color-primary)]" : "bg-[var(--color-text-faint)]",
                  )}
                />
                {line.label}
              </span>
              <span
                className={cn(
                  "font-display text-base font-bold tabular-nums",
                  line.hit ? "text-[var(--color-text)]" : "text-[var(--color-text-faint)]",
                )}
              >
                {line.hit ? "+" : ""}
                {line.points}
              </span>
            </li>
          ))}
        </ul>
      )}

      {showTotal && (
        <div
          className="mt-8 flex items-baseline justify-between border-t-2 border-[var(--color-primary)] pt-5"
          style={{ animation: "ultras-pop 420ms ease-out both" }}
        >
          <span className="font-mono-label text-[10px] text-[var(--color-primary)]">
            Points earned
          </span>
          <span className="font-display text-5xl font-bold tabular-nums leading-none tracking-[-0.04em] text-[var(--color-text)] md:text-6xl">
            +<PointsCounter to={pointsAwarded} />
          </span>
        </div>
      )}

      {showTotal && <ReactionRow />}

      {showTotal && (
        <div className="mt-6 flex justify-end">
          <Button variant="ghost" size="sm" leftIcon={<RotateCcw size={14} />} onClick={replay}>
            Replay reveal
          </Button>
        </div>
      )}
    </section>
  );
}

function ReactionRow() {
  const [counts, setCounts] = useState<Record<string, number>>({
    "HOT": 142,
    "MISS": 38,
    "GOAT": 24,
    "ICY": 11,
  });
  const [active, setActive] = useState<string | null>(null);
  return (
    <div className="mt-8 grid grid-cols-4 divide-x divide-[var(--color-line)] border-y border-[var(--color-line)]">
      {REACTIONS.map((r) => (
        <button
          key={r}
          type="button"
          onClick={() => {
            const wasActive = active === r;
            setActive(wasActive ? null : r);
            setCounts((c) => ({ ...c, [r]: (c[r] ?? 0) + (wasActive ? -1 : 1) }));
          }}
          className={cn(
            "flex flex-col items-center gap-1 py-4 transition",
            active === r
              ? "bg-[var(--color-primary)] text-[var(--color-pure-white)]"
              : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]",
          )}
          aria-pressed={active === r}
          aria-label={`React with ${r}`}
        >
          <span className="font-mono-label text-xs">{r}</span>
          <span className="font-display text-sm font-bold tabular-nums">{counts[r]}</span>
        </button>
      ))}
    </div>
  );
}
