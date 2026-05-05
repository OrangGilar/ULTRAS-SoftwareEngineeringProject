import type { Club } from "@/app/types";
import { ClubBadge } from "./ClubBadge";

export type ClubRecommendationCardProps = {
  club: Club;
  matchPercent: number;
  reasons: string[];
  primary?: boolean;
};

export function ClubRecommendationCard({
  club,
  matchPercent,
  reasons,
  primary,
}: ClubRecommendationCardProps) {
  return (
    <article className="border-y border-[var(--color-line)] py-8">
      {primary && (
        <p className="mb-6 font-mono-label text-[10px] text-[var(--color-primary)]">
          Top match
        </p>
      )}

      <div className="flex items-center gap-5">
        <ClubBadge club={club} size={primary ? "xl" : "lg"} />
        <div className="min-w-0">
          <p className="font-mono-label text-[10px] text-[var(--color-text-faint)]">
            {club.region} / est. {club.founded}
          </p>
          <h3 className="mt-1 font-display text-3xl font-bold leading-tight tracking-[-0.02em] md:text-4xl">
            {club.name}
          </h3>
          <p className="prose-line mt-1 text-sm italic text-[var(--color-text-muted)]">
            "{club.motto}"
          </p>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-baseline justify-between font-mono-label text-[10px] text-[var(--color-text-muted)]">
          <span>Match</span>
          <span className="font-display text-3xl font-bold tabular-nums leading-none tracking-[-0.04em] text-[var(--color-text)]">
            {matchPercent}
            <span className="text-base text-[var(--color-text-faint)]">%</span>
          </span>
        </div>
        <div className="mt-3 h-1 w-full bg-[var(--color-line)]">
          <div
            className="h-full bg-[var(--color-primary)] transition-[width] duration-700"
            style={{ width: `${matchPercent}%` }}
          />
        </div>
      </div>

      <ul className="mt-6 space-y-3">
        {reasons.map((r) => (
          <li key={r} className="flex items-start gap-3">
            <span
              aria-hidden
              className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]"
            />
            <span className="prose-line text-sm leading-snug text-[var(--color-text-muted)]">
              {r}
            </span>
          </li>
        ))}
      </ul>
    </article>
  );
}
