import { cn } from "@/lib/utils";

export type SkeletonProps = {
  className?: string;
  rounded?: "sm" | "md" | "lg" | "full";
};

const ROUNDED = {
  sm: "rounded-none",
  md: "rounded-none",
  lg: "rounded-none",
  full: "rounded-full",
};

export function Skeleton({ className, rounded = "md" }: SkeletonProps) {
  return (
    <div
      className={cn(
        "bg-[var(--color-line)] animate-pulse",
        ROUNDED[rounded],
        className,
      )}
    />
  );
}
