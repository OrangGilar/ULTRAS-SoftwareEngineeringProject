"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function Modal({ open, onClose, title, children, footer }: ModalProps) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-[var(--color-pitch-black)]/80 md:items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "w-full max-w-md border border-[var(--color-line)] bg-[var(--color-bg)] p-6",
          "[animation:ultras-rise_180ms_ease-out_both]",
        )}
      >
        {title && (
          <h2 className="mb-3 font-display text-xl font-bold leading-tight tracking-[-0.02em]">
            {title}
          </h2>
        )}
        <div className="prose-line text-sm text-[var(--color-text-muted)]">{children}</div>
        {footer && <div className="mt-6 flex justify-end gap-3">{footer}</div>}
      </div>
    </div>
  );
}
