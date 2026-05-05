import Link from "next/link";
import type { Game } from "@/app/types";

export function GameTile({ game, highScore }: { game: Game; highScore?: number }) {
  return (
    <Link
      href={`/games/${game.slug}`}
      className="group flex h-full flex-col justify-between gap-6 border border-[var(--color-line)] p-5 transition hover:border-[var(--color-text)] hover:bg-[var(--color-surface)]"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-4xl leading-none" aria-hidden>
          {game.emoji}
        </span>
        <span className="font-mono-label text-[10px] text-[var(--color-primary)]">
          +{game.rewardPerWin} pts
        </span>
      </div>

      <div>
        <h3 className="font-display text-xl font-bold leading-tight tracking-[-0.01em]">
          {game.name}
        </h3>
        <p className="prose-line mt-1 text-sm leading-snug text-[var(--color-text-muted)]">
          {game.description}
        </p>
      </div>

      <div className="flex items-center justify-between font-mono-label text-[10px] text-[var(--color-text-faint)]">
        <span>{highScore ? `Best ${highScore}` : "No score yet"}</span>
        <span className="transition group-hover:text-[var(--color-primary)]">Play →</span>
      </div>
    </Link>
  );
}
