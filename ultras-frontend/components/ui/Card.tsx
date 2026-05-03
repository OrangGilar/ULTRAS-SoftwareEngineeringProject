import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "flat" | "elevated" | "interactive";

export type CardProps = {
  variant?: Variant;
  as?: keyof React.JSX.IntrinsicElements;
} & React.HTMLAttributes<HTMLElement>;

const VARIANTS: Record<Variant, string> = {
  flat: "bg-[var(--color-surface)] border border-[var(--color-line)]",
  elevated: "bg-[var(--color-surface)] border border-[var(--color-line)] shadow-lg shadow-black/40",
  interactive:
    "bg-[var(--color-surface)] border border-[var(--color-line)] transition hover:-translate-y-0.5 hover:border-[var(--color-surface-3)] hover:shadow-lg hover:shadow-black/40 active:translate-y-0",
};

export function Card({
  variant = "flat",
  as,
  className,
  children,
  ...rest
}: CardProps) {
  const Component = (as ?? "div") as React.ElementType;
  return (
    <Component
      {...rest}
      className={cn("rounded-2xl p-4", VARIANTS[variant], className)}
    >
      {children}
    </Component>
  );
}
