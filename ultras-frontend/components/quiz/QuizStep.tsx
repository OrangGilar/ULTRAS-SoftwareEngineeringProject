"use client";

import { useState } from "react";
import type { QuizQuestion, QuizProvince } from "@/app/types";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type QuizStepProps = {
  question: QuizQuestion;
  selected?: string;
  onSelect: (choiceId: string) => void;
};

export function QuizStep({ question, selected, onSelect }: QuizStepProps) {
  if (question.provinces) {
    return (
      <QuizStepCascade
        question={question}
        provinces={question.provinces}
        selected={selected}
        onSelect={onSelect}
      />
    );
  }

  return (
    <div className="space-y-6">
      <QuizPrompt question={question} />
      <ChoiceList
        choices={question.choices}
        selected={selected}
        onSelect={onSelect}
      />
    </div>
  );
}

function QuizStepCascade({
  question,
  provinces,
  selected,
  onSelect,
}: {
  question: QuizQuestion;
  provinces: QuizProvince[];
  selected?: string;
  onSelect: (choiceId: string) => void;
}) {
  const [openProvince, setOpenProvince] = useState<string | null>(() => {
    if (!selected) return null;
    for (const p of provinces) {
      if (p.cities.some((c) => c.id === selected)) return p.id;
    }
    return null;
  });

  const province = provinces.find((p) => p.id === openProvince);

  if (province) {
    return (
      <div className="space-y-6">
        <QuizPrompt question={question} />
        <button
          type="button"
          onClick={() => setOpenProvince(null)}
          className="inline-flex items-center gap-1 font-mono-label text-[10px] text-[var(--color-text-muted)] transition hover:text-[var(--color-text)]"
        >
          <ChevronLeft size={12} />
          {province.label}
        </button>
        <ChoiceList
          choices={province.cities}
          selected={selected}
          onSelect={(id) => {
            onSelect(id);
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <QuizPrompt question={question} />
      <div className="grid gap-0 divide-y divide-[var(--color-line)] border-y border-[var(--color-line)]">
        {provinces.map((p) => {
          const hasSelection = p.cities.some((c) => c.id === selected);
          const selectedCity = hasSelection
            ? p.cities.find((c) => c.id === selected)
            : null;
          const isSingleCity = p.cities.length === 1;

          return (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                if (isSingleCity) {
                  onSelect(p.cities[0].id);
                } else {
                  setOpenProvince(p.id);
                }
              }}
              className={cn(
                "group flex items-center gap-4 py-4 text-left transition",
                hasSelection
                  ? "text-[var(--color-text)]"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "h-3 w-3 flex-shrink-0 rounded-full border transition",
                  hasSelection
                    ? "border-[var(--color-primary)] bg-[var(--color-primary)]"
                    : "border-[var(--color-line-strong)] bg-transparent",
                )}
              />
              <span className="flex-1 font-display text-base font-bold tracking-[-0.01em]">
                {p.label}
              </span>
              {selectedCity && (
                <span className="font-mono-label text-[10px] text-[var(--color-text-muted)]">
                  {selectedCity.label}
                </span>
              )}
              {!isSingleCity && (
                <ChevronRight
                  size={14}
                  className="flex-shrink-0 text-[var(--color-line-strong)] transition group-hover:text-[var(--color-text-muted)]"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function QuizPrompt({ question }: { question: QuizQuestion }) {
  return (
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
  );
}

function ChoiceList({
  choices,
  selected,
  onSelect,
}: {
  choices: { id: string; label: string }[];
  selected?: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="grid gap-0 divide-y divide-[var(--color-line)] border-y border-[var(--color-line)]">
      {choices.map((c) => {
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
  );
}
