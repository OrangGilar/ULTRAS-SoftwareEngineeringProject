import type { Club } from "@/app/types";
import { cn } from "@/lib/utils";

export type ClubBadgeProps = {
  club: Club;
  size?: "sm" | "md" | "lg" | "xl";
  showLabel?: boolean;
  className?: string;
};

const SIZES = {
  sm: "h-9 w-9 text-base",
  md: "h-12 w-12 text-xl",
  lg: "h-16 w-16 text-3xl",
  xl: "h-24 w-24 text-5xl",
};

export function ClubBadge({ club, size = "md", showLabel, className }: ClubBadgeProps) {
  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div
        className={cn(
          "grid place-items-center rounded-full ring-2 ring-[var(--color-line)]",
          SIZES[size],
        )}
        aria-label={club.name}
      >
        {club.logo ? (
          <img src={club.logo} alt={club.name} className="h-4/5 w-4/5 object-contain" />
        ) : (
          <span aria-hidden>{club.crestEmoji}</span>
        )}
      </div>
      {showLabel && (
        <div className="text-center">
          <p className="text-sm font-semibold leading-tight">{club.shortName}</p>
          <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-faint)]">
            {club.city}
          </p>
        </div>
      )}
    </div>
  );
}
