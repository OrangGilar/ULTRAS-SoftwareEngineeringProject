import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "flat" | "elevated" | "interactive";

export type CardProps = {
  variant?: Variant;
  as?: keyof React.JSX.IntrinsicElements;
} & React.HTMLAttributes<HTMLElement>;

const VARIANTS: Record<Variant, string> = {
  flat: "border border-[var(--color-line)]",
  elevated: "border border-[var(--color-line)] bg-[var(--color-surface)]",
  interactive:
    "border border-[var(--color-line)] transition hover:border-[var(--color-text)] active:bg-[var(--color-surface)]",
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
      className={cn("p-5", VARIANTS[variant], className)}
    >
      {children}
    </Component>
  );
}
