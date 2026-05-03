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
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-3xl leading-tight">{question.prompt}</h2>
        {question.helper && (
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">{question.helper}</p>
        )}
      </div>

      <div className="grid gap-3">
        {question.choices.map((c) => {
          const active = selected === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onSelect(c.id)}
              className={cn(
                "flex items-center gap-3 rounded-2xl border p-4 text-left transition",
                active
                  ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)]"
                  : "border-[var(--color-line)] bg-[var(--color-surface)] hover:border-[var(--color-surface-3)]"
              )}
            >
              <span className="flex-1 text-sm font-medium">{c.label}</span>
              <span
                className={cn(
                  "h-5 w-5 rounded-full border-2 transition",
                  active
                    ? "border-[var(--color-primary)] bg-[var(--color-primary)]"
                    : "border-[var(--color-line)]"
                )}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
