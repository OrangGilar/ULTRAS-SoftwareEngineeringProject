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
      <div className="flex flex-col items-center gap-3">
        <p className="font-mono-label text-[10px] text-[var(--color-text-faint)]">
          {label}
        </p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={disabled || v <= min}
            onClick={() => onChange({ ...value, [side]: clamp(v - 1, min, max) })}
            className="grid h-10 w-10 place-items-center rounded-full border border-[var(--color-line)] text-[var(--color-text)] transition hover:border-[var(--color-text)] disabled:opacity-30"
            aria-label={`Decrease ${label} score`}
          >
            <Minus size={16} />
          </button>
          <span
            className={cn(
              "font-display w-14 text-center text-6xl font-bold tabular-nums leading-none tracking-[-0.04em]",
              v > 0 ? "text-[var(--color-text)]" : "text-[var(--color-text-faint)]",
            )}
          >
            {v}
          </span>
          <button
            type="button"
            disabled={disabled || v >= max}
            onClick={() => onChange({ ...value, [side]: clamp(v + 1, min, max) })}
            className="grid h-10 w-10 place-items-center rounded-full bg-[var(--color-primary)] text-[var(--color-pure-white)] transition hover:bg-[var(--color-primary)]/90 disabled:opacity-30"
            aria-label={`Increase ${label} score`}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-2 gap-4 border-y border-[var(--color-line)] py-8">
      <Stepper side="home" label={homeLabel} />
      <Stepper side="away" label={awayLabel} />
    </div>
  );
}
