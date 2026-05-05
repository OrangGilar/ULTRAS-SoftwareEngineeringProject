import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "accent";
type Size = "sm" | "md" | "lg" | "icon";

export type ButtonProps = {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-[var(--color-primary)] text-[var(--color-pure-white)] hover:bg-[var(--color-primary)]/90 active:bg-[var(--color-primary)]/80",
  secondary:
    "bg-transparent text-[var(--color-text)] border border-[var(--color-text)] hover:bg-[var(--color-text)] hover:text-[var(--color-pitch-black)]",
  ghost:
    "bg-transparent text-[var(--color-text)] hover:text-[var(--color-primary)]",
  danger:
    "bg-[var(--color-danger)] text-[var(--color-pure-white)] hover:bg-[var(--color-danger)]/90",
  accent:
    "bg-[var(--color-text)] text-[var(--color-pitch-black)] hover:bg-[var(--color-text)]/90",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-5 text-xs rounded-[var(--radius-pill)]",
  md: "h-11 px-6 text-sm rounded-[var(--radius-pill)]",
  lg: "h-12 px-8 text-sm rounded-[var(--radius-pill)]",
  icon: "h-10 w-10 rounded-[var(--radius-pill)]",
};

export function Button({
  variant = "primary",
  size = "md",
  loading,
  leftIcon,
  rightIcon,
  fullWidth,
  className,
  disabled,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium tracking-wide uppercase transition-colors active:scale-[0.99] disabled:opacity-40 disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]",
        VARIANTS[variant],
        SIZES[size],
        fullWidth && "w-full",
        className,
      )}
    >
      {loading ? (
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : leftIcon}
      {children}
      {rightIcon}
    </button>
  );
}
