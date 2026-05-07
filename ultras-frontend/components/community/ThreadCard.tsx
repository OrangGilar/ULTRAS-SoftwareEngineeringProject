"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowBigUp } from "lucide-react";
import type { ApiThread } from "@/lib/api";
import { toggleUpvote, ApiError } from "@/lib/api";
import { Avatar } from "@/components/ui/Avatar";
import { getClub } from "@/lib/mock/clubs";
import { useAuth } from "@/hooks/useAuth";
import { cn, formatRelative } from "@/lib/utils";

/**
 * The community page passes a refetch callback so the parent can re-pull threads
 * after an upvote — keeps the count canonical without us having to splice the
 * local copy. Also handles the "not logged in → bounce to /login" case.
 */
export function ThreadCard({
  thread,
  onUpvoteChange,
}: {
  thread: ApiThread;
  onUpvoteChange?: () => void;
}) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const authorClub = getClub(thread.authorClubId);
  const threadClub = getClub(thread.clubId);

  // Optimistic UI: flip the heart immediately, snap back if the request fails.
  const [optimisticVoted, setOptimisticVoted] = useState(thread.viewerHasUpvoted);
  const [optimisticCount, setOptimisticCount] = useState(thread.upvotes);
  const [busy, setBusy] = useState(false);

  const onUpvoteClick = async (e: React.MouseEvent) => {
    e.preventDefault();   // we're inside a <Link>; stop the navigation
    e.stopPropagation();
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (busy) return;

    // Optimistic flip
    const wasVoted = optimisticVoted;
    setOptimisticVoted(!wasVoted);
    setOptimisticCount((c) => (wasVoted ? c - 1 : c + 1));
    setBusy(true);

    try {
      const res = await toggleUpvote(thread.id);
      // Reconcile to server truth in case it's drifted from our optimistic guess.
      setOptimisticVoted(res.viewerHasUpvoted);
      setOptimisticCount(res.upvoteCount);
      onUpvoteChange?.();
    } catch (err) {
      // Roll back on failure.
      setOptimisticVoted(wasVoted);
      setOptimisticCount((c) => (wasVoted ? c + 1 : c - 1));
      const msg = err instanceof ApiError ? err.message : "Upvote failed";
      console.error(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <article className="group flex gap-4 border-b border-[var(--color-line)] py-5 transition hover:border-[var(--color-text)]">
      <button
        type="button"
        aria-pressed={optimisticVoted}
        aria-label="Upvote"
        onClick={onUpvoteClick}
        disabled={busy}
        className={cn(
          "flex flex-col items-center gap-1 transition",
          optimisticVoted
            ? "text-[var(--color-primary)]"
            : "text-[var(--color-text-faint)] hover:text-[var(--color-text)]",
          busy && "opacity-60",
        )}
      >
        <ArrowBigUp size={22} fill={optimisticVoted ? "currentColor" : "none"} />
        <span className="font-display text-sm font-bold tabular-nums">{optimisticCount}</span>
      </button>

      <Link href={`/community/${thread.id}`} className="flex-1 min-w-0">
        <div className="mb-2 flex items-center gap-2 font-mono-label text-[10px] text-[var(--color-text-faint)]">
          <Avatar
            name={thread.authorName}
            logo={authorClub?.logo}
            emoji={authorClub?.crestEmoji}
            size="xs"
          />
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
        <p className="mt-1 line-clamp-2 text-sm text-[var(--color-text-muted)]">
          {thread.body}
        </p>
        <p className="mt-3 font-mono-label text-[10px] text-[var(--color-text-faint)]">
          {thread.replyCount} {thread.replyCount === 1 ? "reply" : "replies"}
        </p>
      </Link>
    </article>
  );
}
