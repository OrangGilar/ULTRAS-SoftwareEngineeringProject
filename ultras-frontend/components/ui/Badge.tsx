import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "neutral" | "success" | "warning" | "danger" | "points" | "club";

export type BadgeProps = {
  variant?: Variant;
  size?: "sm" | "md";
} & React.HTMLAttributes<HTMLSpanElement>;

const VARIANTS: Record<Variant, string> = {
  neutral: "bg-[var(--color-surface-2)] text-[var(--color-text-muted)]",
  success: "bg-[var(--color-success)]/15 text-[var(--color-success)]",
  warning: "bg-[var(--color-accent)]/15 text-[var(--color-accent)]",
  danger: "bg-[var(--color-danger)]/15 text-[var(--color-danger)]",
  points: "bg-[var(--color-accent)] text-black",
  club: "bg-[var(--color-primary)]/15 text-[var(--color-primary)]",
};

const SIZES = {
  sm: "text-[10px] px-2 py-0.5",
  md: "text-xs px-2.5 py-1",
};

export function Badge({
  variant = "neutral",
  size = "sm",
  className,
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      {...rest}
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-semibold tracking-wide uppercase",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
    >
      {children}
    </span>
  );
}
