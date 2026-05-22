"use client";

import { use, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/PageContainer";
import { ThreadCard } from "@/components/community/ThreadCard";
import { Composer } from "@/components/community/Composer";
import { useLocalUser } from "@/hooks/useLocalUser";
import { getClub, GENERAL_COMMUNITY_TAG } from "@/lib/mock/clubs";
import { getThreads, type ApiThread, ApiError } from "@/lib/api";

/**
 * Per-community feed. The URL slug is either a known club id (from clubs.ts)
 * or the literal "general" — which we translate to the backend's
 * GENERAL_COMMUNITY_TAG sentinel so we fetch threads with no clubTag.
 *
 * The composer here is *locked* to the current community: users browsing
 * Persib see their post go to Persib, no club-picker required.
 */
export default function ClubCommunityPage({
  params,
}: {
  params: Promise<{ clubId: string }>;
}) {
  const { clubId } = use(params);
  const { user } = useLocalUser();

  const isGeneral = clubId === "general";
  const club = isGeneral ? null : getClub(clubId);

  // Unknown slug — 404 instead of silently showing an empty list.
  if (!isGeneral && !club) notFound();

  // Backend query tag: real club id, or the GENERAL sentinel for null-tag threads.
  const filterTag = isGeneral ? GENERAL_COMMUNITY_TAG : club!.id;

  const [threads, setThreads] = useState<ApiThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await getThreads({ clubTag: filterTag, limit: 30 });
      setThreads(data);
    } catch (err) {
      const apiErr = err instanceof ApiError ? err : new ApiError(String(err), 0);
      setErrorMsg(
        apiErr.status === 0
          ? "Couldn't reach the server. Is the backend running?"
          : `Failed to load threads: ${apiErr.message}`,
      );
      setThreads([]);
    } finally {
      setLoading(false);
    }
  }, [filterTag]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { refetch(); }, [refetch]);

  const title = isGeneral ? "General" : club!.name;
  const eyebrow = isGeneral ? "Off-topic / Liga 1" : club!.motto;
  const lede = isGeneral
    ? "Anything that doesn't fit a club community. League talk, refs, transfers, whatever."
    : `Everything ${club!.name}.`;

  return (
    <PageContainer width="md" className="space-y-10">
      <Link
        href="/community"
        className="inline-flex items-center gap-1 font-mono-label text-[10px] text-[var(--color-text-muted)] transition hover:text-[var(--color-primary)]"
      >
        <ChevronLeft size={14} />
        All communities
      </Link>

      <PageHeader
        eyebrow={eyebrow}
        title={
          <span className="flex items-center gap-4">
            {club?.logo ? (
              <Image
                src={club.logo}
                alt={`${club.name} crest`}
                width={56}
                height={56}
                className="h-14 w-14 object-contain"
              />
            ) : null}
            {title}
          </span>
        }
        lede={lede}
      />

      <Composer
        onPosted={refetch}
        defaultClubTag={filterTag}
        authorClubTag={user.clubId}
        lockedClubTag
      />

      {errorMsg && (
        <div role="alert" className="border border-[var(--color-primary)] py-10 px-5 font-mono-label text-xs text-[var(--color-primary)]">
          {errorMsg}
        </div>
      )}

      {loading ? (
        <div className="border border-dashed border-[var(--color-line)] py-16 text-center font-mono-label text-xs text-[var(--color-text-muted)]">
          Loading threads…
        </div>
      ) : threads.length === 0 ? (
        <div className="border border-dashed border-[var(--color-line)] py-16 text-center font-mono-label text-xs text-[var(--color-text-muted)]">
          No threads here yet. Be the first to say something.
        </div>
      ) : (
        <div>
          {threads.map((t) => (
            <ThreadCard key={t.id} thread={t} onUpvoteChange={refetch} />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
