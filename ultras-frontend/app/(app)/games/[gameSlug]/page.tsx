import { notFound } from "next/navigation";
import { getGame } from "@/lib/mock/games";
import { TriviaGame } from "./trivia";
import { CrestGame } from "./crest";
import { MemoryGame } from "./memory";

export default async function GamePage({
  params,
}: {
  params: Promise<{ gameSlug: string }>;
}) {
  const { gameSlug } = await params;
  const game = getGame(gameSlug);
  if (!game) notFound();

  if (game.slug === "liga-1-trivia") return <TriviaGame game={game} />;
  if (game.slug === "guess-the-crest") return <CrestGame game={game} />;
  if (game.slug === "squad-memory") return <MemoryGame game={game} />;
  notFound();
}
