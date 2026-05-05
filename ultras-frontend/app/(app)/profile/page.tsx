"use client";

import Link from "next/link";
import { useLocalUser } from "@/hooks/useLocalUser";
import { getClub } from "@/lib/mock/clubs";
import { matches as allMatches } from "@/lib/mock/matches";
import { scorePrediction } from "@/lib/scoring";
import { PageContainer, SectionHeading } from "@/components/layout/PageContainer";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { ClubBadge } from "@/components/club/ClubBadge";
import { Settings } from "lucide-react";

export default function ProfilePage() {
  const { user } = useLocalUser();
  const club = getClub(user.clubId);
  const predictions = Object.values(user.predictions);
  const finishedPredictions = predictions
    .map((p) => ({ p, m: allMatches.find((m) => m.id === p.matchId) }))
    .filter((x) => x.m?.status === "finished");

  const wins = finishedPredictions.filter(
    (x) => scorePrediction(x.p, x.m!).total > 0
  ).length;
  const accuracy = finishedPredictions.length
    ? Math.round((wins / finishedPredictions.length) * 100)
    : 0;

  return (
    <PageContainer width="md" className="space-y-12">
      <header className="flex items-center gap-5 border-b border-[var(--color-line)] pb-8">
        <Avatar name={user.displayName} logo={club?.logo} emoji={club?.crestEmoji} size="xl" ring />
        <div className="flex-1 min-w-0">
          <h1 className="font-display text-3xl font-bold leading-tight tracking-[-0.02em] md:text-4xl">
            {user.displayName}
          </h1>
          {club ? (
            <p className="mt-1 font-mono-label text-[10px] text-[var(--color-text-muted)]">
              {club.name} / {club.shortName}
            </p>
          ) : (
            <p className="mt-1 font-mono-label text-[10px] text-[var(--color-text-muted)]">
              No club adopted yet.
            </p>
          )}
        </div>
        <Link href="/profile/settings" aria-label="Settings">
          <Button variant="ghost" size="icon"><Settings size={16} /></Button>
        </Link>
      </header>

      <section className="grid grid-cols-3 divide-x divide-[var(--color-line)] border-y border-[var(--color-line)]">
        <Stat label="Points" value={user.points.toLocaleString()} />
        <Stat label="Predictions" value={`${predictions.length}`} />
        <Stat label="Hit rate" value={`${accuracy}%`} />
      </section>

      {club && (
        <section className="border-y border-[var(--color-line)] py-6">
          <p className="font-mono-label text-[10px] text-[var(--color-text-faint)]">
            My club
          </p>
          <div className="mt-4 flex items-center gap-5">
            <ClubBadge club={club} size="lg" />
            <div className="min-w-0">
              <p className="font-display text-2xl font-bold leading-tight tracking-[-0.02em]">
                {club.name}
              </p>
              <p className="prose-line mt-1 text-sm italic text-[var(--color-text-muted)]">
                "{club.motto}"
              </p>
              <p className="mt-2 font-mono-label text-[10px] text-[var(--color-text-faint)]">
                {club.region} / est. {club.founded}
              </p>
            </div>
          </div>
        </section>
      )}

      <section>
        <SectionHeading title="Recent predictions" />
        {finishedPredictions.length === 0 ? (
          <div className="border border-dashed border-[var(--color-line)] py-12 text-center font-mono-label text-xs text-[var(--color-text-muted)]">
            No completed predictions yet. Start with the next fixture.
          </div>
        ) : (
          <ul className="divide-y divide-[var(--color-line)] border-y border-[var(--color-line)]">
            {finishedPredictions.slice(0, 5).map(({ p, m }) => {
              if (!m) return null;
              const home = getClub(m.homeId);
              const away = getClub(m.awayId);
              const points = scorePrediction(p, m).total;
              return (
                <li key={p.matchId}>
                  <Link
                    href={`/matches/${m.id}/result`}
                    className="group flex items-center justify-between gap-4 py-4 transition"
                  >
                    <div className="min-w-0">
                      <p className="font-display text-base font-bold tracking-[-0.01em] transition group-hover:text-[var(--color-primary)]">
                        {home?.shortName} {m.finalScore?.home}.{m.finalScore?.away} {away?.shortName}
                      </p>
                      <p className="mt-1 font-mono-label text-[10px] text-[var(--color-text-faint)]">
                        Your call {p.score.home}.{p.score.away} / ×{p.confidence}
                      </p>
                    </div>
                    <span
                      className={
                        points > 0
                          ? "font-display text-lg font-bold tabular-nums text-[var(--color-primary)]"
                          : "font-display text-lg font-bold tabular-nums text-[var(--color-text-faint)]"
                      }
                    >
                      {points > 0 ? `+${points}` : "0"}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </PageContainer>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-4 py-5 text-center">
      <p className="font-mono-label text-[10px] text-[var(--color-text-faint)]">
        {label}
      </p>
      <p className="mt-2 font-display text-3xl font-bold tabular-nums leading-none tracking-[-0.02em]">
        {value}
      </p>
    </div>
  );
}
