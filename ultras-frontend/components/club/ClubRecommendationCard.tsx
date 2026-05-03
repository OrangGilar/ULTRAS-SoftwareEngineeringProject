import type { Club } from "@/app/types";
import { Card } from "@/components/ui/Card";
import { ClubBadge } from "./ClubBadge";
import { Badge } from "@/components/ui/Badge";

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
    <Card
      variant="elevated"
      className="relative overflow-hidden p-6"
    >
      {primary && (
        <span className="absolute right-4 top-4">
          <Badge variant="points" size="md">Top match</Badge>
        </span>
      )}
      <div
        aria-hidden
        className="absolute inset-x-0 -top-24 h-48 opacity-20 blur-2xl"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${club.colors[0]}, transparent 60%)`,
        }}
      />
      <div className="relative flex items-center gap-4">
        <ClubBadge club={club} size={primary ? "xl" : "lg"} />
        <div>
          <p className="text-xs uppercase tracking-widest text-[var(--color-text-faint)]">
            {club.region} · est. {club.founded}
          </p>
          <h3 className="text-2xl font-bold leading-tight">{club.name}</h3>
          <p className="text-sm italic text-[var(--color-text-muted)]">"{club.motto}"</p>
        </div>
      </div>

      <div className="relative mt-5">
        <div className="flex items-baseline justify-between text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
          <span>Match</span>
          <span className="text-base font-bold tabular-nums text-[var(--color-accent)]">
            {matchPercent}%
          </span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--color-surface-3)]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] transition-[width] duration-700"
            style={{ width: `${matchPercent}%` }}
          />
        </div>
      </div>

      <ul className="relative mt-4 space-y-1.5">
        {reasons.map((r) => (
          <li key={r} className="flex items-start gap-2 text-sm">
            <span aria-hidden className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]" />
            <span className="text-[var(--color-text-muted)]">{r}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
