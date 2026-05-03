"use client";

import { Minus, Plus } from "lucide-react";
import { cn, clamp } from "@/lib/utils";

export type ScorePickerProps = {
  value: { home: number; away: number };
  onChange: (next: { home: number; away: number }) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  homeLabel: string;
  awayLabel: string;
};

export function ScorePicker({
  value,
  onChange,
  min = 0,
  max = 9,
  disabled,
  homeLabel,
  awayLabel,
}: ScorePickerProps) {
  const Stepper = ({
    side,
    label,
  }: {
    side: "home" | "away";
    label: string;
  }) => {
    const v = value[side];
    return (
      <div className="flex flex-col items-center gap-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
          {label}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={disabled || v <= min}
            onClick={() => onChange({ ...value, [side]: clamp(v - 1, min, max) })}
            className="grid h-10 w-10 place-items-center rounded-full bg-[var(--color-surface-2)] text-[var(--color-text)] transition hover:bg-[var(--color-surface-3)] disabled:opacity-30"
            aria-label={`Decrease ${label} score`}
          >
            <Minus size={18} />
          </button>
          <span
            className={cn(
              "font-display text-5xl tabular-nums leading-none w-14 text-center",
              v > 0 ? "text-[var(--color-text)]" : "text-[var(--color-text-faint)]"
            )}
          >
            {v}
          </span>
          <button
            type="button"
            disabled={disabled || v >= max}
            onClick={() => onChange({ ...value, [side]: clamp(v + 1, min, max) })}
            className="grid h-10 w-10 place-items-center rounded-full bg-[var(--color-primary)] text-white transition hover:brightness-110 disabled:opacity-30"
            aria-label={`Increase ${label} score`}
          >
            <Plus size={18} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-2 gap-4 rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-5">
      <Stepper side="home" label={homeLabel} />
      <Stepper side="away" label={awayLabel} />
    </div>
  );
}
