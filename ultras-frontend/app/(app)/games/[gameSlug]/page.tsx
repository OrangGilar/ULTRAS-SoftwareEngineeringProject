"use client";

import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { useGames } from "@/components/providers/GamesProvider";
import { TriviaGame } from "./trivia";
import { CrestGame } from "./crest";
import { MemoryGame } from "./memory";
import { Skeleton } from "@/components/ui/Skeleton";

export default function GamePage() {
  const { gameSlug } = useParams<{ gameSlug: string }>();
  const { getGame, loading } = useGames();

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-64 w-full" rounded="lg" />
      </div>
    );
  }

  const game = getGame(gameSlug);
  if (!game) notFound();

  if (game.slug === "liga-1-trivia") return <TriviaGame game={game} />;
  if (game.slug === "guess-the-crest") return <CrestGame game={game} />;
  if (game.slug === "squad-memory") return <MemoryGame game={game} />;
  return null;
}
