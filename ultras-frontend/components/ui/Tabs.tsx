"use client";

import { cn } from "@/lib/utils";

export type TabsProps<T extends string> = {
  value: T;
  onChange: (next: T) => void;
  options: { id: T; label: string; count?: number }[];
  variant?: "underline" | "pill";
  className?: string;
};

export function Tabs<T extends string>({
  value,
  onChange,
  options,
  variant = "underline",
  className,
}: TabsProps<T>) {
  if (variant === "pill") {
    return (
      <div className={cn("inline-flex gap-2", className)}>
        {options.map((o) => {
          const active = o.id === value;
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => onChange(o.id)}
              className={cn(
                "rounded-[var(--radius-pill)] border px-4 py-2 font-mono-label text-[10px] transition",
                active
                  ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-pure-white)]"
                  : "border-[var(--color-line)] text-[var(--color-text-muted)] hover:border-[var(--color-text)] hover:text-[var(--color-text)]",
              )}
            >
              {o.label}
              {typeof o.count === "number" && (
                <span className="ml-2 opacity-70">{o.count}</span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn("flex gap-8 border-b border-[var(--color-line)]", className)}>
      {options.map((o) => {
        const active = o.id === value;
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            className={cn(
              "relative -mb-px py-3 font-mono-label text-[10px] transition",
              active
                ? "text-[var(--color-text)]"
                : "text-[var(--color-text-faint)] hover:text-[var(--color-text-muted)]",
            )}
          >
            {o.label}
            {typeof o.count === "number" && (
              <span className="ml-2 opacity-70">{o.count}</span>
            )}
            {active && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 bg-[var(--color-primary)]" />
            )}
          </button>
        );
      })}
    </div>
  );
}
