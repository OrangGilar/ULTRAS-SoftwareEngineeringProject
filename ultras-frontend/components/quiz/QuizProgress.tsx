export function QuizProgress({ step, total }: { step: number; total: number }) {
  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between font-mono-label text-[10px] text-[var(--color-text-muted)]">
        <span>Step {step} of {total}</span>
        <span className="font-display text-base font-bold tabular-nums leading-none text-[var(--color-text)]">
          {Math.round((step / total) * 100)}%
        </span>
      </div>
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))` }}>
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            aria-hidden
            className={
              i < step
                ? "h-1 bg-[var(--color-primary)]"
                : "h-1 bg-[var(--color-line)]"
            }
          />
        ))}
      </div>
    </div>
  );
}
