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
      <div className={cn("inline-flex rounded-full bg-[var(--color-surface-2)] p-1", className)}>
        {options.map((o) => {
          const active = o.id === value;
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => onChange(o.id)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition",
                active
                  ? "bg-[var(--color-primary)] text-white"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              )}
            >
              {o.label}
              {typeof o.count === "number" && (
                <span className="ml-1.5 text-[10px] opacity-80">{o.count}</span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn("flex gap-6 border-b border-[var(--color-line)]", className)}>
      {options.map((o) => {
        const active = o.id === value;
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            className={cn(
              "relative -mb-px py-3 text-sm font-medium transition",
              active ? "text-[var(--color-text)]" : "text-[var(--color-text-faint)] hover:text-[var(--color-text-muted)]"
            )}
          >
            {o.label}
            {typeof o.count === "number" && (
              <span className="ml-2 text-[10px] opacity-70">{o.count}</span>
            )}
            {active && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-[var(--color-primary)]" />
            )}
          </button>
        );
      })}
    </div>
  );
}
