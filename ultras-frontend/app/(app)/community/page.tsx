"use client";

import { useState, useMemo } from "react";
import { threads, threadsForClub } from "@/lib/mock/threads";
import { PageContainer } from "@/components/layout/PageContainer";
import { Tabs } from "@/components/ui/Tabs";
import { ThreadCard } from "@/components/community/ThreadCard";
import { Composer } from "@/components/community/Composer";
import { useLocalUser } from "@/hooks/useLocalUser";
import { getClub } from "@/lib/mock/clubs";

type Filter = "club" | "all";

export default function CommunityPage() {
  const { user } = useLocalUser();
  const club = getClub(user.clubId);
  const [filter, setFilter] = useState<Filter>(club ? "club" : "all");

  const filtered = useMemo(() => {
    if (filter === "club" && club) return threadsForClub(club.id);
    return threads;
  }, [filter, club]);

  return (
    <PageContainer width="md" className="space-y-5">
      <div>
        <h1 className="font-display text-3xl">Community</h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Loud takes welcome. Personal attacks aren't.
        </p>
      </div>

      <Tabs<Filter>
        value={filter}
        onChange={setFilter}
        options={[
          { id: "club", label: club ? `My club · ${club.shortName}` : "My club" },
          { id: "all", label: "All Liga 1" },
        ]}
      />

      <Composer />

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--color-line)] bg-[var(--color-surface)] p-8 text-center text-sm text-[var(--color-text-muted)]">
          No threads here yet. Be the first to say something.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((t) => (
            <ThreadCard key={t.id} thread={t} />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
