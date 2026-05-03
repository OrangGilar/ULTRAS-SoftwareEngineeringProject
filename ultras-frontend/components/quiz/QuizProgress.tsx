import { ProgressBar } from "@/components/ui/ProgressBar";

export function QuizProgress({ step, total }: { step: number; total: number }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)]">
        <span className="uppercase tracking-wider">Step {step} of {total}</span>
        <span>{Math.round((step / total) * 100)}%</span>
      </div>
      <ProgressBar value={step} max={total} segmented={total} tone="primary" />
    </div>
  );
}
