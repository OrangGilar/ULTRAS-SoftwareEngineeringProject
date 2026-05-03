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
    <div className={cn("mx-auto w-full px-4 py-6 md:py-8", max, className)}>
      {children}
    </div>
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
    <div className="mb-3 flex items-end justify-between gap-2">
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
          {title}
        </h2>
        {hint && <p className="text-xs text-[var(--color-text-faint)]">{hint}</p>}
      </div>
      {action}
    </div>
  );
}
