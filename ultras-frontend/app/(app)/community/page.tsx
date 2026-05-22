"use client";

import { useState, useEffect, useCallback } from "react";
import { PageContainer, PageHeader } from "@/components/layout/PageContainer";
import { Tabs } from "@/components/ui/Tabs";
import { ThreadCard } from "@/components/community/ThreadCard";
import { Composer } from "@/components/community/Composer";
import { useLocalUser } from "@/hooks/useLocalUser";
import { getClub } from "@/lib/mock/clubs";
import { getThreads, type ApiThread, ApiError } from "@/lib/api";
import { usePollingFetch } from "@/hooks/usePollingFetch";

type Filter = "club" | "all";

export default function CommunityPage() {
  const { user } = useLocalUser();
  const club = getClub(user.clubId);
  const [filter, setFilter] = useState<Filter>(club ? "club" : "all");
  const [threads, setThreads] = useState<ApiThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  /**
   * Memoized so we can call it from useEffect, Composer's onPosted, ThreadCard's
   * onUpvoteChange and onDeleted callbacks, and from the background poll.
   *
   * `silent` skips the loading spinner — used by the polling tick so the
   * list doesn't flash empty every 10 seconds.
   */
  const refetch = useCallback(async (silent: boolean = false) => {
    if (!silent) setLoading(true);
    if (!silent) setErrorMsg(null);
    try {
      const data = await getThreads({
        clubTag: filter === "club" && club ? club.id : undefined,
        limit: 30,
      });
      setThreads(data);
      if (silent) setErrorMsg(null);
    } catch (err) {
      // Stay quiet on poll failures so a single flaky request doesn't blow
      // away the loaded list — next tick will recover or the user will
      // see the error on the next manual action.
      if (silent) {
        console.warn("Background community poll failed; will retry", err);
        return;
      }
      const apiErr = err instanceof ApiError ? err : new ApiError(String(err), 0);
      setErrorMsg(
        apiErr.status === 0
          ? "Couldn't reach the server. Is the backend running?"
          : `Failed to load threads: ${apiErr.message}`,
      );
      setThreads([]);
    } finally {
      if (!silent) setLoading(false);
    }
  }, [filter, club]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { refetch(false); }, [refetch]);

  // Slower poll than thread detail (15s vs 7s) — the list view is browsing,
  // not active conversation, so a longer interval is fine and keeps server load down.
  usePollingFetch(() => refetch(true), 15000, true);

  return (
    <PageContainer width="md" className="space-y-10">
      <PageHeader
        eyebrow="The terraces"
        title={<>Community.</>}
        lede="Loud takes welcome. Personal attacks aren't."
      />

      <Tabs<Filter>
        value={filter}
        onChange={setFilter}
        options={[
          { id: "club", label: club ? `My club / ${club.shortName}` : "My club" },
          { id: "all", label: "All Liga 1" },
        ]}
      />

      <Composer onPosted={() => refetch(false)} defaultClubTag={club?.id} authorClubTag={user.clubId} />

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
            <ThreadCard
              key={t.id}
              thread={t}
              onUpvoteChange={() => refetch(true)}
              onDeleted={() => refetch(false)}
            />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
