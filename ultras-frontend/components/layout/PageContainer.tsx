import { cn } from "@/lib/utils";

export function PageContainer({
  children,
  className,
  width = "sm",
}: {
  children: React.ReactNode;
  className?: string;
  width?: "sm" | "md" | "lg";
}) {
  const max = {
    sm: "max-w-screen-sm",
    md: "max-w-screen-md",
    lg: "max-w-screen-lg",
  }[width];
  return (
    <div className={cn("mx-auto w-full px-5 py-8 md:px-6 md:py-12", max, className)}>
      {children}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  lede,
  action,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("flex flex-col gap-4", className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-3">
          {eyebrow && (
            <span className="font-mono-label text-[10px] text-[var(--color-text-faint)]">
              {eyebrow}
            </span>
          )}
          <h1 className="font-display text-4xl font-bold leading-[0.95] tracking-[-0.02em] md:text-5xl">
            {title}
          </h1>
        </div>
        {action}
      </div>
      {lede && (
        <p className="prose-line text-base leading-snug text-[var(--color-text-muted)] md:text-lg">
          {lede}
        </p>
      )}
    </header>
  );
}

export function SectionHeading({
  title,
  hint,
  action,
}: {
  title: string;
  hint?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-2 border-b border-[var(--color-line)] pb-2">
      <div>
        <h2 className="font-mono-label text-[10px] text-[var(--color-text-muted)]">
          {title}
        </h2>
        {hint && (
          <p className="mt-1 text-xs text-[var(--color-text-faint)]">{hint}</p>
        )}
      </div>
      {action}
    </div>
  );
}
