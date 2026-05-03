import { cn } from "@/lib/utils";

export type SkeletonProps = {
  className?: string;
  rounded?: "sm" | "md" | "lg" | "full";
};

const ROUNDED = {
  sm: "rounded",
  md: "rounded-lg",
  lg: "rounded-2xl",
  full: "rounded-full",
};

export function Skeleton({ className, rounded = "md" }: SkeletonProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-[var(--color-surface-2)]",
        ROUNDED[rounded],
        className,
      )}
    >
      <div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent"
        style={{ animation: "ultras-shimmer 1.4s linear infinite" }}
      />
    </div>
  );
}
