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
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
  xl: "h-20 w-20 text-2xl",
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
        "inline-flex items-center justify-center overflow-hidden rounded-full border border-[var(--color-line)] font-display font-bold tracking-tight text-[var(--color-text)]",
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
