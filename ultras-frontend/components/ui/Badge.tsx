import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "neutral" | "success" | "warning" | "danger" | "points" | "club";

export type BadgeProps = {
  variant?: Variant;
  size?: "sm" | "md";
} & React.HTMLAttributes<HTMLSpanElement>;

const VARIANTS: Record<Variant, string> = {
  neutral: "border border-[var(--color-line)] text-[var(--color-text-muted)]",
  success: "border border-[var(--color-success)] text-[var(--color-success)]",
  warning: "border border-[var(--color-text)] text-[var(--color-text)]",
  danger: "border border-[var(--color-primary)] text-[var(--color-primary)]",
  points: "bg-[var(--color-text)] text-[var(--color-pitch-black)]",
  club: "border border-[var(--color-primary)] text-[var(--color-primary)]",
};

const SIZES = {
  sm: "text-[9px] px-2 py-0.5",
  md: "text-[10px] px-2.5 py-1",
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
        "inline-flex items-center gap-1 font-mono-label",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
    >
      {children}
    </span>
  );
}
