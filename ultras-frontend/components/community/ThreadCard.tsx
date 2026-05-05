"use client";

import Link from "next/link";
import { ArrowBigUp, MessageSquare } from "lucide-react";
import type { Thread } from "@/app/types";
import { Avatar } from "@/components/ui/Avatar";
import { getClub } from "@/lib/mock/clubs";
import { useLocalUser } from "@/hooks/useLocalUser";
import { cn, formatRelative } from "@/lib/utils";

export function ThreadCard({ thread }: { thread: Thread }) {
  const { user, toggleVote } = useLocalUser();
  const authorClub = getClub(thread.authorClubId);
  const threadClub = getClub(thread.clubId);
  const userVote = user.threadVotes[thread.id];
  const liveVotes = thread.upvotes + (userVote === 1 ? 1 : 0) + (userVote === -1 ? -1 : 0);

  return (
    <article className="group flex gap-4 border-b border-[var(--color-line)] py-5 transition hover:border-[var(--color-text)]">
      <button
        type="button"
        aria-pressed={userVote === 1}
        aria-label="Upvote"
        onClick={(e) => {
          e.preventDefault();
          toggleVote(thread.id, 1);
        }}
        className={cn(
          "flex flex-col items-center gap-1 transition",
          userVote === 1
            ? "text-[var(--color-primary)]"
            : "text-[var(--color-text-faint)] hover:text-[var(--color-text)]",
        )}
      >
        <ArrowBigUp size={22} fill={userVote === 1 ? "currentColor" : "none"} />
        <span className="font-display text-sm font-bold tabular-nums">{liveVotes}</span>
      </button>

      <Link href={`/community/${thread.id}`} className="flex-1 min-w-0">
        <div className="mb-2 flex items-center gap-2 font-mono-label text-[10px] text-[var(--color-text-faint)]">
          <Avatar name={thread.authorName} logo={authorClub?.logo} emoji={authorClub?.crestEmoji} size="xs" />
          <span className="text-[var(--color-text-muted)]">{thread.authorName}</span>
          <span>/</span>
          <span suppressHydrationWarning>{formatRelative(thread.createdAtISO)}</span>
          {threadClub && (
            <span className="ml-auto text-[var(--color-text-muted)]">
              {threadClub.shortName}
            </span>
          )}
        </div>
        <h3 className="font-display text-lg font-bold leading-tight tracking-[-0.01em] transition group-hover:text-[var(--color-primary)]">
          {thread.title}
        </h3>
        <p className="prose-line mt-1 line-clamp-2 text-sm leading-snug text-[var(--color-text-muted)]">
          {thread.body}
        </p>
        <div className="mt-3 flex items-center gap-1.5 font-mono-label text-[10px] text-[var(--color-text-faint)]">
          <MessageSquare size={12} />
          <span>{thread.replyCount} replies</span>
        </div>
      </Link>
    </article>
  );
}
