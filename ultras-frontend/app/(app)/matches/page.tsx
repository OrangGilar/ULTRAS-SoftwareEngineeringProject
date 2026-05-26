"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { PageContainer, PageHeader } from "@/components/layout/PageContainer";
import { Tabs } from "@/components/ui/Tabs";
import { MatchCard } from "@/components/match/MatchCard";
import { useLocalUser } from "@/hooks/useLocalUser";
import { useMatches } from "@/hooks/useMatches";
import { upcomingFixtures } from "@/lib/mock/upcomingFixtures";

type Filter = "upcoming" | "live" | "finished";

/**
 * Note on data sources: this page combines two streams.
 *
 *   1. API matches (useMatches) — real fixtures from the backend's synced
 *      api-football data. As of the 2024/25 season sync these are all FT,
 *      so the Upcoming and Live tabs would be empty.
 *
 *   2. upcomingFixtures (mock) — the hardcoded 2025/26 slate. Slotted into
 *      the Upcoming tab so users have something to predict on. Each card
 *      routes to the existing predict page; lib/mock/matches.ts has these
 *      registered so the predict page resolves them via getMatch().
 *
 * When the backend gets real upcoming data, drop the upcomingFixtures import
 * and the merge below — nothing else needs to change.
 */
export default function MatchesPage() {
  const [filter, setFilter] = useState<Filter>("upcoming");
  const { user } = useLocalUser();

  const matchesState = useMatches("all");
  const apiMatches = matchesState.status === "success" ? matchesState.data : [];

  // Mock upcoming fixtures are only relevant for the Upcoming tab. We don't
  // merge them in for Live/Finished — there's no concept of a mock match
  // being "live" or having a result.
  const counts = useMemo(
    () => ({
      upcoming:
        apiMatches.filter((m) => m.status === "upcoming").length +
        upcomingFixtures.length,
      live:     apiMatches.filter((m) => m.status === "live").length,
      finished: apiMatches.filter((m) => m.status === "finished").length,
    }),
    [apiMatches],
  );

  const filtered = useMemo(() => {
    if (filter === "upcoming") {
      // Merge the two upcoming sources and sort by kickoff. Mock matches use
      // today/tomorrow timestamps, so they naturally land at or near the top
      // when there's no overlap with real upcoming data.
      const merged = [
        ...apiMatches.filter((m) => m.status === "upcoming"),
        ...upcomingFixtures,
      ];
      return merged.sort((a, b) => a.kickoffISO.localeCompare(b.kickoffISO));
    }
    return apiMatches
      .filter((m) => m.status === filter)
      .sort((a, b) =>
        filter === "finished"
          ? b.kickoffISO.localeCompare(a.kickoffISO)
          : a.kickoffISO.localeCompare(b.kickoffISO),
      );
  }, [apiMatches, filter]);

  return (
    <PageContainer width="lg" className="space-y-10">
      <PageHeader
        eyebrow="Liga 1 / Indonesia"
        title={<>Fixtures.</>}
        lede="Predict, replay reveals, ride the season with the rest of the terrace."
        action={
          // Entry point to the league table. Kept in the header (not BottomNav)
          // because nav is full and "Table" lives logically next to fixtures.
          <Link
            href="/table"
            className="font-mono-label text-[10px] text-[var(--color-text-muted)] transition hover:text-[var(--color-primary)]"
          >
            View table →
          </Link>
        }
      />

      <Tabs<Filter>
        value={filter}
        onChange={setFilter}
        options={[
          { id: "upcoming", label: "Upcoming", count: counts.upcoming },
          { id: "live",     label: "Live",     count: counts.live },
          { id: "finished", label: "Finished", count: counts.finished },
        ]}
      />

      {/* Loading + error states are only meaningful for API-sourced tabs.
          The Upcoming tab always has the mock fixtures, so we skip the
          "loading…" spinner there to avoid a flash before the mocks render. */}
      {matchesState.status === "loading" && filter !== "upcoming" && (
        <div className="border border-dashed border-[var(--color-line)] py-16 text-center font-mono-label text-xs text-[var(--color-text-muted)]">
          Loading fixtures…
        </div>
      )}

      {matchesState.status === "error" && filter !== "upcoming" && (
        <div
          role="alert"
          className="border border-[var(--color-primary)] py-10 px-5 font-mono-label text-xs text-[var(--color-primary)]"
        >
          {matchesState.error.status === 0
            ? "Couldn't reach the backend. Make sure Spring Boot is running on port 8080 and CORS is configured."
            : `Failed to load fixtures: ${matchesState.error.message}`}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="border border-dashed border-[var(--color-line)] py-16 text-center font-mono-label text-xs text-[var(--color-text-muted)]">
          {filter === "live"
            ? "No live matches right now. Check back at kickoff."
            : "Nothing here yet."}
        </div>
      )}

      {filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-8 xl:grid-cols-3">
          {filtered.map((m) => (
            <MatchCard
              key={m.id}
              match={m}
              userPrediction={user.predictions[m.id]?.score}
            />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
