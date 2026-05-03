import Link from "next/link";
import type { Game } from "@/app/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export function GameTile({ game, highScore }: { game: Game; highScore?: number }) {
  return (
    <Link href={`/games/${game.slug}`} className="block">
      <Card variant="interactive" className="flex h-full flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--color-surface-2)] text-3xl">
            {game.emoji}
          </span>
          <Badge variant="warning">+{game.rewardPerWin} pts</Badge>
        </div>
        <div>
          <h3 className="text-base font-semibold">{game.name}</h3>
          <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">{game.description}</p>
        </div>
        <div className="mt-auto flex items-center justify-between text-xs text-[var(--color-text-faint)]">
          <span>{highScore ? `Best: ${highScore}` : "No score yet"}</span>
          <span className="text-[var(--color-text)]">Play →</span>
        </div>
      </Card>
    </Link>
  );
}
