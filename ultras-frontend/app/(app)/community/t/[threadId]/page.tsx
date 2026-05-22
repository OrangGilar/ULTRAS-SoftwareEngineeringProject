"use client";

import Link from "next/link";
import { useEffect, useState, use, useCallback } from "react";
import { notFound, useRouter } from "next/navigation";
import { getClub } from "@/lib/mock/clubs";
import { PageContainer } from "@/components/layout/PageContainer";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, Trash2 } from "lucide-react";
import { formatRelative } from "@/lib/utils";
import {
  getThread,
  createReply,
  deleteThread,
  deleteReply,
  type ApiThreadDetail,
  ApiError,
} from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { usePollingFetch } from "@/hooks/usePollingFetch";

/**
 * Thread detail page.
 *
 * Three behaviors worth knowing about:
 *
 * 1. The page polls GET /api/threads/{id} every 7 seconds via usePollingFetch.
 *    This is the "feels live" trick: new replies posted by other users show
 *    up automatically within ~7s without a WebSocket. The poll pauses while
 *    the tab is hidden so backgrounded tabs don't burn requests.
 *
 * 2. Delete buttons are only rendered when the locally-cached user.userId
 *    matches the thread/reply's authorId. The backend enforces author-only
 *    deletion server-side too (403 otherwise), so a savvy user can't bypass
 *    the UI — this check is just to avoid showing buttons that would fail.
 *
 * 3. Replies and thread refetch through one function so the UI stays in sync
 *    after delete, post, or background poll without duplicate state paths.
 */
export default function ThreadPage({
  params,
}: {
  params: Promise<{ threadId: string }>;
}) {
  // Next.js 16 params are a Promise — `use()` unwraps in a client component.
  const { threadId } = use(params);
  const router = useRouter();
  const { isAuthenticated, auth } = useAuth();

  const [data, setData] = useState<ApiThreadDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [notFoundFlag, setNotFoundFlag] = useState(false);

  // Reply composer state
  const [replyBody, setReplyBody] = useState("");
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);

  // Delete state — separate flags so the thread vs an individual reply can
  // both be in-flight independently (rare but possible).
  const [deletingThread, setDeletingThread] = useState(false);
  const [deletingReplyId, setDeletingReplyId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  /**
   * Fetcher used by both the initial load and the polling tick.
   *
   * The `silent` param controls whether the loading spinner shows — polls
   * pass true so the page doesn't flash a "Loading…" state every 7s, which
   * would be visually jarring. Manual refetches (after a post/delete) pass
   * false so the user sees that something is happening.
   */
  const refetch = useCallback(async (silent: boolean = false) => {
    if (!silent) setLoading(true);
    if (!silent) setErrorMsg(null);
    try {
      const detail = await getThread(threadId);
      setData(detail);
      if (silent) setErrorMsg(null); // clear stale errors on a successful poll
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setNotFoundFlag(true);
        return;
      }
      // Don't blast errors during a silent poll — that would replace the
      // happily-loaded content with an alert just because one poll missed.
      // We log instead and let the next tick recover.
      if (silent) {
        console.warn("Background poll failed; will retry on next tick", err);
        return;
      }
      const apiErr = err instanceof ApiError ? err : new ApiError(String(err), 0);
      setErrorMsg(apiErr.status === 0 ? "Couldn't reach the server." : apiErr.message);
    } finally {
      if (!silent) setLoading(false);
    }
  }, [threadId]);

  // Initial load. Re-runs only if the thread id changes.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { refetch(false); }, [refetch]);

  // Background poll — every 7 seconds, only while data is loaded. We don't
  // poll while in the initial load (no point, the manual fetch is already
  // in flight) or after a 404 (poll would just keep 404-ing).
  usePollingFetch(
    () => refetch(true),
    7000,
    data !== null && !notFoundFlag,
  );

  if (notFoundFlag) notFound();

  const onSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyBody.trim() || posting) return;
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    setPosting(true);
    setPostError(null);
    try {
      await createReply(threadId, { body: replyBody.trim() });
      setReplyBody("");
      await refetch(false);
    } catch (err) {
      const apiErr = err instanceof ApiError ? err : new ApiError(String(err), 0);
      setPostError(apiErr.status === 0 ? "Couldn't reach the server." : apiErr.message);
    } finally {
      setPosting(false);
    }
  };

  const onDeleteThread = async () => {
    if (deletingThread) return;
    // Native confirm is the simplest UX for a class project. Replace with a
    // custom modal if the design system has one later.
    if (!window.confirm("Delete this thread? This can't be undone.")) return;
    setDeletingThread(true);
    setDeleteError(null);
    try {
      await deleteThread(threadId);
      // The thread is gone — bounce back to the list. We can't refetch since
      // the resource no longer exists.
      router.push("/community");
    } catch (err) {
      const apiErr = err instanceof ApiError ? err : new ApiError(String(err), 0);
      setDeleteError(apiErr.status === 0 ? "Couldn't reach the server." : apiErr.message);
      setDeletingThread(false);
    }
  };

  const onDeleteReply = async (replyId: string) => {
    if (deletingReplyId) return;
    if (!window.confirm("Delete this reply?")) return;
    setDeletingReplyId(replyId);
    setDeleteError(null);
    try {
      await deleteReply(threadId, replyId);
      await refetch(false);
    } catch (err) {
      const apiErr = err instanceof ApiError ? err : new ApiError(String(err), 0);
      setDeleteError(apiErr.status === 0 ? "Couldn't reach the server." : apiErr.message);
    } finally {
      setDeletingReplyId(null);
    }
  };

  if (loading || !data) {
    return (
      <PageContainer width="md" className="space-y-10">
        <Link href="/community" className="inline-flex items-center gap-1 font-mono-label text-[10px] text-[var(--color-text-muted)] transition hover:text-[var(--color-primary)]">
          <ChevronLeft size={14} /> Back to community
        </Link>
        <div className="border border-dashed border-[var(--color-line)] py-16 text-center font-mono-label text-xs text-[var(--color-text-muted)]">
          {errorMsg ?? "Loading…"}
        </div>
      </PageContainer>
    );
  }

  const { thread, replies } = data;
  const authorClub = getClub(thread.authorClubId);
  const threadClub = getClub(thread.clubId);
  const backHref = threadClub ? `/community/c/${threadClub.id}` : "/community/c/general";
  const backLabel = threadClub ? `Back to ${threadClub.shortName}` : "Back to General";

  const viewerId = auth?.userId;
  const isThreadOwner = !!viewerId && viewerId === thread.authorId;

  return (
    <PageContainer width="md" className="space-y-10">
      <Link
        href={backHref}
        className="inline-flex items-center gap-1 font-mono-label text-[10px] text-[var(--color-text-muted)] transition hover:text-[var(--color-primary)]"
      >
        <ChevronLeft size={14} />
        {backLabel}
      </Link>

      <article className="space-y-5 border-b border-[var(--color-line)] pb-8">
        <div className="flex items-center gap-3 font-mono-label text-[10px] text-[var(--color-text-muted)]">
          <Avatar
            name={thread.authorName}
            logo={authorClub?.logo}
            emoji={authorClub?.crestEmoji}
            size="sm"
          />
          <span className="text-[var(--color-text)]">{thread.authorName}</span>
          <span className="text-[var(--color-text-faint)]">/</span>
          <span suppressHydrationWarning>{formatRelative(thread.createdAtISO)}</span>
          {threadClub && (
            <span className="ml-auto text-[var(--color-text-muted)]">
              {threadClub.shortName}
            </span>
          )}
        </div>
        <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-[-0.02em] md:text-5xl">
          {thread.title}
        </h1>
        <p className="prose-line text-base leading-snug text-[var(--color-text-muted)] md:text-lg whitespace-pre-wrap">
          {thread.body}
        </p>

        {isThreadOwner && (
          <div className="pt-2">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={onDeleteThread}
              loading={deletingThread}
              disabled={deletingThread}
              leftIcon={<Trash2 size={14} />}
            >
              Delete thread
            </Button>
          </div>
        )}
        {deleteError && (
          <p role="alert" className="font-mono-label text-[10px] text-[var(--color-primary)]">
            {deleteError}
          </p>
        )}
      </article>

      <section>
        <h2 className="mb-2 border-b border-[var(--color-line)] pb-2 font-mono-label text-[10px] text-[var(--color-text-muted)]">
          {replies.length} {replies.length === 1 ? "reply" : "replies"}
        </h2>

        {replies.length === 0 ? (
          <div className="py-8 text-center font-mono-label text-[10px] text-[var(--color-text-faint)]">
            No replies yet. Set the tone.
          </div>
        ) : (
          <ul className="divide-y divide-[var(--color-line)]">
            {replies.map((r) => {
              const isReplyOwner = !!viewerId && viewerId === r.authorId;
              const isThisReplyDeleting = deletingReplyId === r.id;
              return (
                <li key={r.id} className="py-5">
                  <div className="mb-2 flex items-center gap-2 font-mono-label text-[10px] text-[var(--color-text-muted)]">
                    <Avatar name={r.authorName} size="xs" />
                    <span className="text-[var(--color-text)]">{r.authorName}</span>
                    <span className="text-[var(--color-text-faint)]">/</span>
                    <span suppressHydrationWarning>{formatRelative(r.createdAtISO)}</span>
                    {isReplyOwner && (
                      <button
                        type="button"
                        onClick={() => onDeleteReply(r.id)}
                        disabled={isThisReplyDeleting}
                        aria-label="Delete reply"
                        className="ml-auto inline-flex items-center gap-1 text-[var(--color-text-faint)] transition hover:text-[var(--color-primary)] disabled:opacity-40"
                      >
                        <Trash2 size={12} />
                        <span>{isThisReplyDeleting ? "Deleting…" : "Delete"}</span>
                      </button>
                    )}
                  </div>
                  <p className="prose-line text-sm leading-snug whitespace-pre-wrap">{r.body}</p>
                </li>
              );
            })}
          </ul>
        )}

        {/* Reply composer */}
        <form onSubmit={onSubmitReply} className="mt-8 space-y-3 border-t border-[var(--color-line)] pt-6">
          <label className="font-mono-label text-[10px] text-[var(--color-text-faint)]">
            Add a reply
          </label>
          <textarea
            value={replyBody}
            onChange={(e) => setReplyBody(e.target.value)}
            rows={3}
            placeholder={isAuthenticated ? "Keep it civil." : "Log in to reply."}
            disabled={!isAuthenticated || posting}
            className="w-full border-0 border-b border-[var(--color-line-strong)] bg-transparent px-0 py-2 text-sm placeholder:text-[var(--color-text-faint)] focus:border-[var(--color-primary)] focus:outline-none disabled:opacity-50"
          />
          {postError && (
            <p role="alert" className="font-mono-label text-[10px] text-[var(--color-primary)]">{postError}</p>
          )}
          <div className="flex justify-end">
            <Button
              type="submit"
              size="sm"
              variant="primary"
              loading={posting}
              disabled={!replyBody.trim() || posting || !isAuthenticated}
            >
              {isAuthenticated ? "Post reply" : "Log in to reply"}
            </Button>
          </div>
        </form>
      </section>
    </PageContainer>
  );
}
