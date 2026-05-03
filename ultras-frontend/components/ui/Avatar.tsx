import { cn } from "@/lib/utils";

export type AvatarProps = {
  name: string;
  emoji?: string;
  logo?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  ring?: boolean;
  className?: string;
};

const SIZES = {
  xs: "h-6 w-6 text-xs",
  sm: "h-8 w-8 text-sm",
  md: "h-10 w-10 text-base",
  lg: "h-14 w-14 text-xl",
  xl: "h-20 w-20 text-3xl",
};

export function Avatar({ name, emoji, logo, size = "md", ring, className }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-[var(--color-surface-2)] font-bold text-[var(--color-text)] overflow-hidden",
        ring && "ring-2 ring-[var(--color-primary)] ring-offset-2 ring-offset-[var(--color-bg)]",
        SIZES[size],
        className,
      )}
      aria-label={name}
    >
      {logo ? (
        <img src={logo} alt={name} className="h-full w-full object-contain p-1" />
      ) : (
        emoji ?? initials
      )}
    </div>
  );
}
