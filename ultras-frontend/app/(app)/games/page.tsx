"use client";

import { games } from "@/lib/mock/games";
import { PageContainer, PageHeader } from "@/components/layout/PageContainer";
import { GameTile } from "@/components/games/GameTile";
import { useLocalUser } from "@/hooks/useLocalUser";

export default function GamesPage() {
  const { user } = useLocalUser();

  return (
    <PageContainer width="md" className="space-y-10">
      <PageHeader
        eyebrow="Daily rounds"
        title={<>Mini-games.</>}
        lede="Quick rounds. Real points. Bragging rights forever."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {games.map((g) => (
          <GameTile key={g.slug} game={g} highScore={user.gameHighScores[g.slug]} />
        ))}
      </div>
    </PageContainer>
  );
}
