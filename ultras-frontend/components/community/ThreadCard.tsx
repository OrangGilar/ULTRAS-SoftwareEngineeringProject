"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowBigUp, Trash2, MoveRight } from "lucide-react";
import type { ApiThread } from "@/lib/api";
import { toggleUpvote, deleteThread, moveThread, ApiError } from "@/lib/api";
import { Avatar } from "@/components/ui/Avatar";
import { getClub } from "@/lib/mock/clubs";
import { useAuth } from "@/hooks/useAuth";
import { cn, formatRelative } from "@/lib/utils";

/**
 * Thread row in the community list.
 *
 * The community page passes `onUpvoteChange` (re-fetch after upvote) and
 * `onDeleted` (re-fetch after delete, OR splice the deleted thread out of
 * the local list — see the list page for which it chose).
 *
 * Delete button only appears when the locally-cached userId matches the
 * thread.authorId returned by the API. The backend also enforces
 * author-only deletion (403 otherwise), so a savvy user can't bypass the
 * UI — this check is just to avoid showing buttons that would always fail.
 */
export function ThreadCard({
  thread,
  onUpvoteChange,
  onDeleted,
}: {
  thread: ApiThread;
  onUpvoteChange?: () => void;
  onDeleted?: () => void;
}) {
  const router = useRouter();
  const { isAuthenticated, auth } = useAuth();
  const authorClub = getClub(thread.authorClubId);
  const threadClub = getClub(thread.clubId);

  // Optimistic UI: flip the heart immediately, snap back if the request fails.
  const [optimisticVoted, setOptimisticVoted] = useState(thread.viewerHasUpvoted);
  const [optimisticCount, setOptimisticCount] = useState(thread.upvotes);
  const [busy, setBusy] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [moving, setMoving] = useState(false);

  const isOwner = !!auth?.userId && auth.userId === thread.authorId;

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

  const onMoveToGeneralClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (moving) return;
    if (!window.confirm("Move this thread to General?")) return;
    setMoving(true);
    try {
      await moveThread(thread.id, null);
      onDeleted?.(); // re-fetch or splice — same callback as delete
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Move failed";
      console.error(msg);
      setMoving(false);
    }
  };

  const onDeleteClick = async (e: React.MouseEvent) => {
    e.preventDefault();      // we're inside a <Link>; stop the navigation
    e.stopPropagation();
    if (deleting) return;
    if (!window.confirm("Delete this thread? This can't be undone.")) return;
    setDeleting(true);
    try {
      await deleteThread(thread.id);
      onDeleted?.();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Delete failed";
      console.error(msg);
      // Note: not surfacing this to the user inline because the list is the
      // wrong place for a per-row error — the user can retry from the
      // thread detail page where it'll show properly.
      setDeleting(false);
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

      <Link href={`/community/t/${thread.id}`} className="flex-1 min-w-0">
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
        <div className="mt-3 flex items-center gap-3 font-mono-label text-[10px] text-[var(--color-text-faint)]">
          <span>
            {thread.replyCount} {thread.replyCount === 1 ? "reply" : "replies"}
          </span>
          {isOwner && (
            <span className="ml-auto flex items-center gap-3">
              {thread.clubId && (
                <button
                  type="button"
                  onClick={onMoveToGeneralClick}
                  disabled={moving}
                  aria-label="Move to General"
                  className="inline-flex items-center gap-1 transition hover:text-[var(--color-primary)] disabled:opacity-40"
                >
                  <MoveRight size={11} />
                  <span>{moving ? "Moving…" : "Move to General"}</span>
                </button>
              )}
              <button
                type="button"
                onClick={onDeleteClick}
                disabled={deleting}
                aria-label="Delete thread"
                className="inline-flex items-center gap-1 transition hover:text-[var(--color-primary)] disabled:opacity-40"
              >
                <Trash2 size={11} />
                <span>{deleting ? "Deleting…" : "Delete"}</span>
              </button>
            </span>
          )}
        </div>
      </Link>
    </article>
  );
}
