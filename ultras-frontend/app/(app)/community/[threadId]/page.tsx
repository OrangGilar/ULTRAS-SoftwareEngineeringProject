import Link from "next/link";
import { notFound } from "next/navigation";
import { getThread } from "@/lib/mock/threads";
import { getClub } from "@/lib/mock/clubs";
import { PageContainer } from "@/components/layout/PageContainer";
import { Avatar } from "@/components/ui/Avatar";
import { ChevronLeft } from "lucide-react";
import { formatRelative } from "@/lib/utils";

const MOCK_REPLIES = [
  { id: "r1", author: "PangeranTimur", body: "Three at the back is fine for one game, not a system.", upvotes: 28 },
  { id: "r2", author: "TerrasUtara", body: "Disagree. Wing-backs are key to our press right now.", upvotes: 14 },
  { id: "r3", author: "JakOnline", body: "We're better with a midfield three. Settle this once and for all.", upvotes: 7 },
];

export default async function ThreadPage({
  params,
}: {
  params: Promise<{ threadId: string }>;
}) {
  const { threadId } = await params;
  const thread = getThread(threadId);
  if (!thread) notFound();
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
        <p className="prose-line text-base leading-snug text-[var(--color-text-muted)] md:text-lg">
          {thread.body}
        </p>
      </article>

      <section>
        <h2 className="mb-2 border-b border-[var(--color-line)] pb-2 font-mono-label text-[10px] text-[var(--color-text-muted)]">
          {thread.replyCount} replies
        </h2>
        <ul className="divide-y divide-[var(--color-line)]">
          {MOCK_REPLIES.map((r) => (
            <li key={r.id} className="py-5">
              <div className="mb-2 flex items-center gap-2 font-mono-label text-[10px] text-[var(--color-text-muted)]">
                <Avatar name={r.author} size="xs" />
                <span className="text-[var(--color-text)]">{r.author}</span>
              </div>
              <p className="prose-line text-sm leading-snug">{r.body}</p>
              <p className="mt-3 font-mono-label text-[10px] text-[var(--color-text-faint)]">
                {r.upvotes} upvotes
              </p>
            </li>
          ))}
        </ul>
      </section>
    </PageContainer>
  );
}
