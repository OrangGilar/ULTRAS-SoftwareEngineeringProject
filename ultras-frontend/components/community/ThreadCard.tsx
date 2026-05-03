"use client";

import Link from "next/link";
import { ArrowBigUp, MessageSquare } from "lucide-react";
import type { Thread } from "@/app/types";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
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
    <Card variant="interactive" className="flex gap-3 p-4">
      <div className="flex flex-col items-center gap-1">
        <button
          type="button"
          aria-pressed={userVote === 1}
          onClick={(e) => {
            e.preventDefault();
            toggleVote(thread.id, 1);
          }}
          className={cn(
            "rounded-lg p-1 transition",
            userVote === 1 ? "text-[var(--color-primary)]" : "text-[var(--color-text-faint)] hover:text-[var(--color-text-muted)]"
          )}
        >
          <ArrowBigUp size={20} fill={userVote === 1 ? "currentColor" : "none"} />
        </button>
        <span className="font-display text-sm tabular-nums">{liveVotes}</span>
      </div>

      <Link href={`/community/${thread.id}`} className="flex-1">
        <div className="mb-2 flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
          <Avatar name={thread.authorName} logo={authorClub?.logo} emoji={authorClub?.crestEmoji} size="xs" />
          <span className="font-medium text-[var(--color-text)]">{thread.authorName}</span>
          <span>·</span>
          <span suppressHydrationWarning>{formatRelative(thread.createdAtISO)}</span>
          {threadClub && (
            <Badge variant="club" size="sm" className="ml-auto">
              {threadClub.shortName}
            </Badge>
          )}
        </div>
        <h3 className="text-base font-bold leading-snug">{thread.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-[var(--color-text-muted)]">{thread.body}</p>
        <div className="mt-3 flex items-center gap-1.5 text-xs text-[var(--color-text-faint)]">
          <MessageSquare size={14} />
          <span>{thread.replyCount} replies</span>
        </div>
      </Link>
    </Card>
  );
}
