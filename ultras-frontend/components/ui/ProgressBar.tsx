import { cn } from "@/lib/utils";

export type ProgressBarProps = {
  value: number;
  max?: number;
  segmented?: number;
  className?: string;
  tone?: "primary" | "accent" | "success";
};

const TONES = {
  primary: "bg-[var(--color-primary)]",
  accent: "bg-[var(--color-text)]",
  success: "bg-[var(--color-success)]",
};

export function ProgressBar({
  value,
  max = 100,
  segmented,
  className,
  tone = "primary",
}: ProgressBarProps) {
  if (segmented) {
    return (
      <div className={cn("flex gap-1", className)}>
        {Array.from({ length: segmented }).map((_, i) => {
          const filled = i < value;
          return (
            <div
              key={i}
              className={cn(
                "h-1 flex-1 transition-colors",
                filled ? TONES[tone] : "bg-[var(--color-line)]",
              )}
            />
          );
        })}
      </div>
    );
  }
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className={cn("h-1 w-full bg-[var(--color-line)]", className)}>
      <div
        className={cn("h-full transition-[width] duration-500", TONES[tone])}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
