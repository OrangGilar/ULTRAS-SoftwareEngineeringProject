"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { PageContainer, PageHeader, SectionHeading } from "@/components/layout/PageContainer";
import { ThreadCard } from "@/components/community/ThreadCard";
import { clubs } from "@/lib/mock/clubs";
import { getThreads, type ApiThread, ApiError } from "@/lib/api";
import { usePollingFetch } from "@/hooks/usePollingFetch";

/**
 * Community landing. Two stacked sections:
 *   1. A grid of every Liga 1 club community + a "General" bucket for off-topic.
 *   2. A read-only "Recent across Liga 1" feed of the latest threads from any club.
 *
 * Posting happens inside a specific community (/community/c/[clubId]) so threads
 * always have a home — this page intentionally has no composer.
 */
export default function CommunityPage() {
  const [recent, setRecent] = useState<ApiThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const refetch = useCallback(async (silent: boolean = false) => {
    if (!silent) setLoading(true);
    if (!silent) setErrorMsg(null);
    try {
      const data = await getThreads({ limit: 10 });
      setRecent(data);
    } catch (err) {
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
      setRecent([]);
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { refetch(false); }, [refetch]);

  // Slower poll than thread detail (15s vs 7s) — the list view is browsing,
  // not active conversation, so a longer interval is fine and keeps server load down.
  usePollingFetch(() => refetch(true), 15000, true);

  return (
    <PageContainer width="lg" className="space-y-12">
      <PageHeader
        eyebrow="The terraces"
        title={<>Community.</>}
        lede="Pick a club, join the chant. Each side has its own corner — keep your takes on-topic and your name on the team sheet."
      />

      <section>
        <SectionHeading title="Communities" hint={`${clubs.length} Liga 1 clubs + General`} />
        <ul className="grid grid-cols-2 gap-px bg-[var(--color-line)] sm:grid-cols-3 md:grid-cols-4">
          <li className="bg-[var(--color-bg)]">
            <Link
              href="/community/c/general"
              className="flex h-full flex-col items-center justify-center gap-2 p-5 text-center transition hover:bg-[var(--color-surface)]"
            >
              <span
                className="grid h-12 w-12 place-items-center rounded-full font-display text-lg font-bold text-[var(--color-pure-white)]"
                style={{ backgroundColor: "var(--color-text-faint)" }}
              >
                #
              </span>
              <span className="font-display text-sm font-bold leading-tight tracking-[-0.01em]">
                General
              </span>
              <span className="font-mono-label text-[9px] text-[var(--color-text-faint)]">
                Off-topic / Liga 1
              </span>
            </Link>
          </li>
          {clubs.map((c) => (
            <li key={c.id} className="bg-[var(--color-bg)]">
              <Link
                href={`/community/c/${c.id}`}
                className="flex h-full flex-col items-center justify-center gap-2 p-5 text-center transition hover:bg-[var(--color-surface)]"
              >
                {c.logo ? (
                  <Image
                    src={c.logo}
                    alt={`${c.name} crest`}
                    width={48}
                    height={48}
                    className="h-12 w-12 object-contain"
                  />
                ) : (
                  <span
                    className="grid h-12 w-12 place-items-center rounded-full font-display text-lg font-bold text-[var(--color-pure-white)]"
                    style={{ backgroundColor: c.colors[0] }}
                  >
                    {c.shortName.slice(0, 2)}
                  </span>
                )}
                <span className="font-display text-sm font-bold leading-tight tracking-[-0.01em]">
                  {c.shortName}
                </span>
                <span className="font-mono-label text-[9px] text-[var(--color-text-faint)] line-clamp-1">
                  {c.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <SectionHeading title="Recent across Liga 1" hint="Newest threads from every community" />

        {errorMsg && (
          <div role="alert" className="border border-[var(--color-primary)] py-10 px-5 font-mono-label text-xs text-[var(--color-primary)]">
            {errorMsg}
          </div>
        )}

        {loading ? (
          <div className="border border-dashed border-[var(--color-line)] py-16 text-center font-mono-label text-xs text-[var(--color-text-muted)]">
            Loading threads…
          </div>
        ) : recent.length === 0 ? (
          <div className="border border-dashed border-[var(--color-line)] py-16 text-center font-mono-label text-xs text-[var(--color-text-muted)]">
            No threads anywhere yet. Pick a community and break the silence.
          </div>
        ) : (
          <div>
            {recent.map((t) => (
              <ThreadCard key={t.id} thread={t} onUpvoteChange={refetch} />
            ))}
          </div>
        )}
      </section>
    </PageContainer>
  );
}
