"use client";

import Link from "next/link";
import { useLocalUser } from "@/hooks/useLocalUser";
import { getClub } from "@/lib/mock/clubs";
import { matches as allMatches } from "@/lib/mock/matches";
import { scorePrediction } from "@/lib/scoring";
import { PageContainer, SectionHeading } from "@/components/layout/PageContainer";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
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
    <PageContainer width="md" className="space-y-6">
      <Card variant="elevated" className="flex items-center gap-4 p-5">
        <Avatar name={user.displayName} logo={club?.logo} emoji={club?.crestEmoji} size="xl" ring />
        <div className="flex-1">
          <h1 className="font-display text-2xl">{user.displayName}</h1>
          {club ? (
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-[var(--color-text-muted)]">
              <span>{club.name}</span>
              <Badge variant="club">{club.shortName}</Badge>
            </div>
          ) : (
            <p className="text-sm text-[var(--color-text-muted)]">No club adopted yet.</p>
          )}
        </div>
        <Link href="/profile/settings" aria-label="Settings">
          <Button variant="ghost" size="icon"><Settings size={16} /></Button>
        </Link>
      </Card>

      <section className="grid grid-cols-3 gap-3">
        <Stat label="Points" value={user.points.toLocaleString()} />
        <Stat label="Predictions" value={`${predictions.length}`} />
        <Stat label="Hit rate" value={`${accuracy}%`} />
      </section>

      {club && (
        <section className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-5">
          <SectionHeading title="My club" />
          <div className="flex items-center gap-4">
            <ClubBadge club={club} size="lg" />
            <div>
              <p className="text-base font-semibold">{club.name}</p>
              <p className="text-sm italic text-[var(--color-text-muted)]">"{club.motto}"</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-[var(--color-text-faint)]">
                {club.region} · est. {club.founded}
              </p>
            </div>
          </div>
        </section>
      )}

      <section>
        <SectionHeading title="Recent predictions" />
        {finishedPredictions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--color-line)] p-6 text-center text-sm text-[var(--color-text-muted)]">
            No completed predictions yet. Start with the next fixture.
          </div>
        ) : (
          <ul className="space-y-2">
            {finishedPredictions.slice(0, 5).map(({ p, m }) => {
              if (!m) return null;
              const home = getClub(m.homeId);
              const away = getClub(m.awayId);
              const points = scorePrediction(p, m).total;
              return (
                <li key={p.matchId}>
                  <Link
                    href={`/matches/${m.id}/result`}
                    className="flex items-center justify-between rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3 transition hover:border-[var(--color-surface-3)]"
                  >
                    <div>
                      <p className="text-sm font-semibold">
                        {home?.shortName} {m.finalScore?.home}–{m.finalScore?.away} {away?.shortName}
                      </p>
                      <p className="text-xs text-[var(--color-text-muted)]">
                        Your call: {p.score.home}–{p.score.away} · ×{p.confidence}
                      </p>
                    </div>
                    <Badge variant={points > 0 ? "success" : "neutral"}>
                      {points > 0 ? `+${points} pts` : "0 pts"}
                    </Badge>
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
    <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-4 text-center">
      <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-faint)]">{label}</p>
      <p className="mt-1 font-display text-2xl tabular-nums">{value}</p>
    </div>
  );
}
