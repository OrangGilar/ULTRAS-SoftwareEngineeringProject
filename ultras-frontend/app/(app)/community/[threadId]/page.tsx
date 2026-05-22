"use client";

import Link from "next/link";
import { useEffect, useState, use } from "react";
import { notFound, useRouter } from "next/navigation";
import { getClub } from "@/lib/mock/clubs";
import { PageContainer } from "@/components/layout/PageContainer";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { ChevronLeft } from "lucide-react";
import { formatRelative } from "@/lib/utils";
import { getThread, createReply, type ApiThreadDetail, ApiError } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

export default function ThreadPage({
  params,
}: {
  params: Promise<{ threadId: string }>;
}) {
  // Next.js 16 params are a Promise — `use()` unwraps in a client component.
  const { threadId } = use(params);
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [data, setData] = useState<ApiThreadDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [notFoundFlag, setNotFoundFlag] = useState(false);

  // Reply composer state
  const [replyBody, setReplyBody] = useState("");
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);

  const refetch = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const detail = await getThread(threadId);
      setData(detail);
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setNotFoundFlag(true);
        return;
      }
      const apiErr = err instanceof ApiError ? err : new ApiError(String(err), 0);
      setErrorMsg(apiErr.status === 0 ? "Couldn't reach the server." : apiErr.message);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { refetch(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [threadId]);

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
      await refetch();
    } catch (err) {
      const apiErr = err instanceof ApiError ? err : new ApiError(String(err), 0);
      setPostError(apiErr.status === 0 ? "Couldn't reach the server." : apiErr.message);
    } finally {
      setPosting(false);
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

  return (
    <PageContainer width="md" className="space-y-10">
      <Link
        href="/community"
        className="inline-flex items-center gap-1 font-mono-label text-[10px] text-[var(--color-text-muted)] transition hover:text-[var(--color-primary)]"
      >
        <ChevronLeft size={14} />
        Back to community
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
            {replies.map((r) => (
              <li key={r.id} className="py-5">
                <div className="mb-2 flex items-center gap-2 font-mono-label text-[10px] text-[var(--color-text-muted)]">
                  <Avatar name={r.authorName} size="xs" />
                  <span className="text-[var(--color-text)]">{r.authorName}</span>
                  <span className="text-[var(--color-text-faint)]">/</span>
                  <span suppressHydrationWarning>{formatRelative(r.createdAtISO)}</span>
                </div>
                <p className="prose-line text-sm leading-snug whitespace-pre-wrap">{r.body}</p>
              </li>
            ))}
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
