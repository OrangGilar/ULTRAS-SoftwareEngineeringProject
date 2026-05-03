import Link from "next/link";
import { notFound } from "next/navigation";
import { getThread } from "@/lib/mock/threads";
import { getClub } from "@/lib/mock/clubs";
import { PageContainer } from "@/components/layout/PageContainer";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ChevronLeft } from "lucide-react";
import { formatRelative } from "@/lib/utils";

const MOCK_REPLIES = [
  { id: "r1", author: "PangeranTimur", body: "Three at the back is fine for one game, not a system.", upvotes: 28 },
  { id: "r2", author: "TerrasUtara", body: "Disagree — wing-backs are key to our press right now.", upvotes: 14 },
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
    <PageContainer width="md" className="space-y-5">
      <Link href="/community">
        <Button variant="ghost" leftIcon={<ChevronLeft size={16} />}>Back to community</Button>
      </Link>

      <article className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-5">
        <div className="mb-3 flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
          <Avatar name={thread.authorName} logo={authorClub?.logo} emoji={authorClub?.crestEmoji} size="sm" />
          <span className="font-semibold text-[var(--color-text)]">{thread.authorName}</span>
          <span>·</span>
          <span>{formatRelative(thread.createdAtISO)}</span>
          {threadClub && (
            <Badge variant="club" className="ml-auto">{threadClub.shortName}</Badge>
          )}
        </div>
        <h1 className="font-display text-2xl leading-tight">{thread.title}</h1>
        <p className="mt-3 text-sm text-[var(--color-text-muted)]">{thread.body}</p>
      </article>

      <section>
        <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
          {thread.replyCount} replies
        </h2>
        <div className="space-y-3">
          {MOCK_REPLIES.map((r) => (
            <div key={r.id} className="rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] p-4">
              <div className="mb-2 flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
                <Avatar name={r.author} size="xs" />
                <span className="font-semibold text-[var(--color-text)]">{r.author}</span>
              </div>
              <p className="text-sm">{r.body}</p>
              <p className="mt-2 text-[10px] uppercase tracking-wider text-[var(--color-text-faint)]">
                {r.upvotes} upvotes
              </p>
            </div>
          ))}
        </div>
      </section>
    </PageContainer>
  );
}
