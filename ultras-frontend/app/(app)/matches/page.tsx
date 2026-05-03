"use client";

import { useState, useMemo } from "react";
import { matches } from "@/lib/mock/matches";
import { PageContainer } from "@/components/layout/PageContainer";
import { Tabs } from "@/components/ui/Tabs";
import { MatchCard } from "@/components/match/MatchCard";
import { useLocalUser } from "@/hooks/useLocalUser";

type Filter = "upcoming" | "live" | "finished";

export default function MatchesPage() {
  const [filter, setFilter] = useState<Filter>("upcoming");
  const { user } = useLocalUser();

  const counts = useMemo(
    () => ({
      upcoming: matches.filter((m) => m.status === "upcoming").length,
      live: matches.filter((m) => m.status === "live").length,
      finished: matches.filter((m) => m.status === "finished").length,
    }),
    []
  );

  const filtered = matches
    .filter((m) => m.status === filter)
    .sort((a, b) =>
      filter === "finished"
        ? b.kickoffISO.localeCompare(a.kickoffISO)
        : a.kickoffISO.localeCompare(b.kickoffISO)
    );

  return (
    <PageContainer width="lg" className="space-y-5">
      <div>
        <h1 className="font-display text-3xl">Fixtures</h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Predict, replay reveals, ride the season with the rest of the terrace.
        </p>
      </div>

      <Tabs<Filter>
        value={filter}
        onChange={setFilter}
        options={[
          { id: "upcoming", label: "Upcoming", count: counts.upcoming },
          { id: "live", label: "Live", count: counts.live },
          { id: "finished", label: "Finished", count: counts.finished },
        ]}
      />

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--color-line)] bg-[var(--color-surface)] p-8 text-center text-sm text-[var(--color-text-muted)]">
          {filter === "live"
            ? "No live matches right now. Check back at kickoff."
            : "Nothing here yet."}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
