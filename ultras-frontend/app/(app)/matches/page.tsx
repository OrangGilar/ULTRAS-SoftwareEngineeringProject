"use client";

import { useState, useMemo } from "react";
import { PageContainer, PageHeader } from "@/components/layout/PageContainer";
import { Tabs } from "@/components/ui/Tabs";
import { MatchCard } from "@/components/match/MatchCard";
import { useLocalUser } from "@/hooks/useLocalUser";
import { useMatches } from "@/hooks/useMatches";

type Filter = "upcoming" | "live" | "finished";

export default function MatchesPage() {
  const [filter, setFilter] = useState<Filter>("upcoming");
  const { user } = useLocalUser();

  // One fetch for the whole list (tiny payload, easy to client-filter).
  // If the list grows large, switch to per-tab fetches against /api/matches/live etc.
  const matchesState = useMatches("all");
  const matches = matchesState.status === "success" ? matchesState.data : [];

  const counts = useMemo(
    () => ({
      upcoming: matches.filter((m) => m.status === "upcoming").length,
      live:     matches.filter((m) => m.status === "live").length,
      finished: matches.filter((m) => m.status === "finished").length,
    }),
    [matches],
  );

  const filtered = useMemo(
    () => matches
      .filter((m) => m.status === filter)
      .sort((a, b) =>
        filter === "finished"
          ? b.kickoffISO.localeCompare(a.kickoffISO)
          : a.kickoffISO.localeCompare(b.kickoffISO),
      ),
    [matches, filter],
  );

  return (
    <PageContainer width="lg" className="space-y-10">
      <PageHeader
        eyebrow="Liga 1 / Indonesia"
        title={<>Fixtures.</>}
        lede="Predict, replay reveals, ride the season with the rest of the terrace."
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

      {matchesState.status === "loading" && (
        <div className="border border-dashed border-[var(--color-line)] py-16 text-center font-mono-label text-xs text-[var(--color-text-muted)]">
          Loading fixtures…
        </div>
      )}

      {matchesState.status === "error" && (
        <div
          role="alert"
          className="border border-[var(--color-primary)] py-10 px-5 font-mono-label text-xs text-[var(--color-primary)]"
        >
          {matchesState.error.status === 0
            ? "Couldn't reach the backend. Make sure Spring Boot is running on port 8080 and CORS is configured."
            : `Failed to load fixtures: ${matchesState.error.message}`}
        </div>
      )}

      {matchesState.status === "success" && filtered.length === 0 && (
        <div className="border border-dashed border-[var(--color-line)] py-16 text-center font-mono-label text-xs text-[var(--color-text-muted)]">
          {filter === "live"
            ? "No live matches right now. Check back at kickoff."
            : "Nothing here yet."}
        </div>
      )}

      {matchesState.status === "success" && filtered.length > 0 && (
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
