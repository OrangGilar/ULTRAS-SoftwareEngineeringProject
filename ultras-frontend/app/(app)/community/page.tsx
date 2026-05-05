"use client";

import { useState, useMemo } from "react";
import { threads, threadsForClub } from "@/lib/mock/threads";
import { PageContainer, PageHeader } from "@/components/layout/PageContainer";
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

      <Composer />

      {filtered.length === 0 ? (
        <div className="border border-dashed border-[var(--color-line)] py-16 text-center font-mono-label text-xs text-[var(--color-text-muted)]">
          No threads here yet. Be the first to say something.
        </div>
      ) : (
        <div>
          {filtered.map((t) => (
            <ThreadCard key={t.id} thread={t} />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
