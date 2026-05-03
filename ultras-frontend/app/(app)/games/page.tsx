"use client";

import { games } from "@/lib/mock/games";
import { PageContainer } from "@/components/layout/PageContainer";
import { GameTile } from "@/components/games/GameTile";
import { useLocalUser } from "@/hooks/useLocalUser";

export default function GamesPage() {
  const { user } = useLocalUser();

  return (
    <PageContainer width="md" className="space-y-5">
      <div>
        <h1 className="font-display text-3xl">Mini-games</h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Quick rounds. Real points. Bragging rights forever.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {games.map((g) => (
          <GameTile key={g.slug} game={g} highScore={user.gameHighScores[g.slug]} />
        ))}
      </div>
    </PageContainer>
  );
}
