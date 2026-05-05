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
          <span className="mb-2 block font-mono-label text-[10px] text-[var(--color-text-faint)]">
            {label}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          {...rest}
          className={cn(
            "h-11 w-full border-0 border-b bg-transparent px-0 py-2 text-base text-[var(--color-text)] placeholder:text-[var(--color-text-faint)] focus:outline-none transition",
            invalid
              ? "border-[var(--color-danger)] focus:border-[var(--color-danger)]"
              : "border-[var(--color-line-strong)] focus:border-[var(--color-primary)]",
            className,
          )}
        />
        {helper && (
          <span
            className={cn(
              "mt-2 block font-mono-label text-[10px]",
              invalid ? "text-[var(--color-danger)]" : "text-[var(--color-text-faint)]",
            )}
          >
            {helper}
          </span>
        )}
      </label>
    );
  },
);
Input.displayName = "Input";
