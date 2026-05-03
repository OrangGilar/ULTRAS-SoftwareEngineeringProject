import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = {
  label?: string;
  helper?: string;
  invalid?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, helper, invalid, className, id, ...rest }, ref) => {
    const inputId = id ?? React.useId();
    return (
      <label htmlFor={inputId} className="block">
        {label && (
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
            {label}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          {...rest}
          className={cn(
            "h-11 w-full rounded-xl border bg-[var(--color-surface-2)] px-4 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-faint)] focus:outline-none transition",
            invalid
              ? "border-[var(--color-danger)] focus:border-[var(--color-danger)]"
              : "border-[var(--color-line)] focus:border-[var(--color-primary)]",
            className,
          )}
        />
        {helper && (
          <span className={cn("mt-1.5 block text-xs", invalid ? "text-[var(--color-danger)]" : "text-[var(--color-text-faint)]")}>
            {helper}
          </span>
        )}
      </label>
    );
  },
);
Input.displayName = "Input";
