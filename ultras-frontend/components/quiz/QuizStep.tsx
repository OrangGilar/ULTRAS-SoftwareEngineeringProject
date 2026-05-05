"use client";

import type { QuizQuestion } from "@/app/types";
import { cn } from "@/lib/utils";

export type QuizStepProps = {
  question: QuizQuestion;
  selected?: string;
  onSelect: (choiceId: string) => void;
};

export function QuizStep({ question, selected, onSelect }: QuizStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl font-bold leading-[1.05] tracking-[-0.02em] md:text-4xl">
          {question.prompt}
        </h2>
        {question.helper && (
          <p className="prose-line mt-2 text-sm text-[var(--color-text-muted)]">
            {question.helper}
          </p>
        )}
      </div>

      <div className="grid gap-0 divide-y divide-[var(--color-line)] border-y border-[var(--color-line)]">
        {question.choices.map((c) => {
          const active = selected === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onSelect(c.id)}
              className={cn(
                "group flex items-center gap-4 py-4 text-left transition",
                active
                  ? "text-[var(--color-text)]"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "h-3 w-3 rounded-full border transition",
                  active
                    ? "border-[var(--color-primary)] bg-[var(--color-primary)]"
                    : "border-[var(--color-line-strong)] bg-transparent",
                )}
              />
              <span className="flex-1 font-display text-base font-bold tracking-[-0.01em]">
                {c.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
