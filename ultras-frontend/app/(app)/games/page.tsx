"use client";

import { useGames } from "@/components/providers/GamesProvider";
import { PageContainer, PageHeader } from "@/components/layout/PageContainer";
import { GameTile } from "@/components/games/GameTile";
import { Skeleton } from "@/components/ui/Skeleton";
import { useLocalUser } from "@/hooks/useLocalUser";

export default function GamesPage() {
  const { user } = useLocalUser();
  const { games, loading } = useGames();

  return (
    <PageContainer width="md" className="space-y-10">
      <PageHeader
        eyebrow="Daily rounds"
        title={<>Mini-games.</>}
        lede="Quick rounds. Real points. Bragging rights forever."
      />

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-32" rounded="lg" />
          <Skeleton className="h-32" rounded="lg" />
          <Skeleton className="h-32" rounded="lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {games.map((g) => (
            <GameTile key={g.slug} game={g} highScore={user.gameHighScores[g.slug]} />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
