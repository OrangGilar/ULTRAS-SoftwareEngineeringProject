"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Club, PointsLine, Prediction } from "@/app/types";
import { ClubBadge } from "@/components/club/ClubBadge";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PointsCounter } from "./PointsCounter";
import { useReveal } from "@/hooks/useReveal";
import { cn } from "@/lib/utils";
import { Sparkles, Frown, Trophy, RotateCcw } from "lucide-react";

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
    <span className="font-display text-7xl tabular-nums leading-none md:text-8xl">
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
        bg: i % 2 === 0 ? "var(--color-primary)" : "var(--color-accent)",
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
          className="absolute left-1/2 top-1/2 h-2 w-2 rounded-sm"
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
        "relative overflow-hidden rounded-3xl border border-[var(--color-line)] bg-gradient-to-b from-[var(--color-surface)] to-[var(--color-bg)] p-6",
        verdict === "miss" && phase === "revealingOutcome" && "[animation:ultras-shake_500ms_ease-in-out_1]"
      )}
      aria-live="polite"
    >
      <Confetti active={showVerdict && verdict === "exact"} />

      <div className="relative grid grid-cols-3 items-center gap-3">
        <div
          className={cn(
            "flex flex-col items-center transition",
            showVerdict && winnerSide === "home" && "scale-105",
            showVerdict && winnerSide === "away" && "opacity-60"
          )}
        >
          <ClubBadge club={home} size="lg" showLabel />
        </div>

        <div className="text-center">
          {showScore ? (
            <div className="flex items-center justify-center gap-3">
              <ScoreSlot value={finalScore.home} animating={animatingScore} />
              <span className="font-display text-5xl text-[var(--color-text-faint)]">–</span>
              <ScoreSlot value={finalScore.away} animating={animatingScore} />
            </div>
          ) : (
            <button
              type="button"
              onClick={start}
              className="relative grid h-28 w-28 place-items-center rounded-full bg-[var(--color-primary)] text-sm font-bold uppercase tracking-widest text-white"
              style={{ animation: "ultras-pulse-ring 1.4s ease-out infinite" }}
            >
              Reveal
            </button>
          )}
          {prediction && phase !== "idle" && (
            <p className="mt-2 text-[10px] uppercase tracking-wider text-[var(--color-text-faint)]">
              You called {prediction.score.home}–{prediction.score.away}
            </p>
          )}
        </div>

        <div
          className={cn(
            "flex flex-col items-center transition",
            showVerdict && winnerSide === "away" && "scale-105",
            showVerdict && winnerSide === "home" && "opacity-60"
          )}
        >
          <ClubBadge club={away} size="lg" showLabel />
        </div>
      </div>

      {showVerdict && (
        <div
          className={cn(
            "mt-6 flex items-center justify-center gap-2",
            "[animation:ultras-pop_420ms_ease-out_both]"
          )}
        >
          {verdict === "exact" && (
            <Badge variant="success" size="md">
              <Trophy size={14} /> Exact scoreline
            </Badge>
          )}
          {verdict === "outcome" && (
            <Badge variant="success" size="md">
              <Sparkles size={14} /> Outcome correct
            </Badge>
          )}
          {verdict === "miss" && (
            <Badge variant="danger" size="md">
              <Frown size={14} /> Better next match
            </Badge>
          )}
          {verdict === "noPrediction" && (
            <Badge variant="neutral" size="md">No prediction</Badge>
          )}
        </div>
      )}

      {showBreakdown && (
        <ul className="mt-6 space-y-2">
          {breakdown.length === 0 && (
            <li className="rounded-xl border border-[var(--color-line)] bg-[var(--color-surface-2)] p-3 text-center text-sm text-[var(--color-text-muted)]">
              No prediction logged for this match.
            </li>
          )}
          {breakdown.map((line, i) => (
            <li
              key={`${line.label}-${i}`}
              className={cn(
                "flex items-center justify-between rounded-xl border bg-[var(--color-surface)] px-3 py-2 text-sm",
                line.hit ? "border-[var(--color-success)]/30" : "border-[var(--color-line)] opacity-70"
              )}
              style={{
                animation: "ultras-rise 360ms ease-out both",
                animationDelay: `${i * 80}ms`,
              }}
            >
              <span className="flex items-center gap-2 text-[var(--color-text-muted)]">
                <span aria-hidden className={cn("inline-block h-1.5 w-1.5 rounded-full", line.hit ? "bg-[var(--color-success)]" : "bg-[var(--color-text-faint)]")} />
                {line.label}
              </span>
              <span className={cn("font-display tabular-nums", line.hit ? "text-[var(--color-success)]" : "text-[var(--color-text-faint)]")}>
                {line.hit ? "+" : ""}
                {line.points}
              </span>
            </li>
          ))}
        </ul>
      )}

      {showTotal && (
        <div
          className="mt-6 flex items-center justify-between rounded-2xl border border-[var(--color-accent)]/40 bg-[var(--color-accent)]/10 px-5 py-4"
          style={{ animation: "ultras-pop 420ms ease-out both" }}
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)]">
            Points earned
          </span>
          <span className="font-display text-3xl tabular-nums text-[var(--color-accent)]">
            +<PointsCounter to={pointsAwarded} />
          </span>
        </div>
      )}

      {showTotal && <ReactionRow />}

      {showTotal && (
        <div className="mt-4 flex justify-end">
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
    <div className="mt-5 flex items-center justify-between gap-2 rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-3">
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
            "flex flex-1 flex-col items-center rounded-xl px-2 py-2 transition",
            active === r ? "bg-[var(--color-primary-soft)]" : "hover:bg-white/5"
          )}
          aria-pressed={active === r}
          aria-label={`React with ${r}`}
        >
          <span className="text-xs font-bold tracking-wider">{r}</span>
          <span className="text-[10px] tabular-nums text-[var(--color-text-muted)]">{counts[r]}</span>
        </button>
      ))}
    </div>
  );
}
