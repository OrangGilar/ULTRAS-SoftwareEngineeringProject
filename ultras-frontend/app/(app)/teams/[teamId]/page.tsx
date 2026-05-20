"use client";

import Link from "next/link";
import { use, useMemo, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Tabs } from "@/components/ui/Tabs";
import { MatchCard } from "@/components/match/MatchCard";
import { ClubBadge } from "@/components/club/ClubBadge";
import { useLocalUser } from "@/hooks/useLocalUser";
import { useTeamMatches, useTeamStanding } from "@/hooks/useStandings";
import { getClub } from "@/lib/mock/clubs";
import type { ApiMatch } from "@/lib/api";
import type { Club, TeamStanding } from "@/app/types";

type TabId = "upcoming" | "recent";

/**
 * Team detail. The "team" here is identified by the slug shared across
 * MatchEntity.homeId/awayId, clubs.ts, and standings rows.
 *
 * Layout:
 *   [back link]
 *   [crest, name, current standing summary]
 *   [tabs: Upcoming | Recent]
 *   [match cards]
 *
 * Both tabs come from one /api/teams/{slug}/matches fetch — we just split
 * client-side. Live matches are folded into Upcoming so a user opening the
 * page mid-match can still find the fixture they're looking for.
 */
export default function TeamPage({
  params,
}: {
  params: Promise<{ teamId: string }>;
}) {
  const { teamId } = use(params);
  const [tab, setTab] = useState<TabId>("upcoming");
  const { user } = useLocalUser();

  const matchesState = useTeamMatches(teamId);
  const standingState = useTeamStanding(teamId);

  // Local clubs.ts is the source of truth for branding when available; fall
  // back to whatever the API returned via the standings/match payloads.
  const club = getClub(teamId);
  const apiName =
    standingState.status === "success" ? standingState.data.teamName : undefined;
  const apiLogo =
    standingState.status === "success" ? standingState.data.teamLogo : undefined;

  // Derive a Club-shaped object for the badge/header even if this team isn't
  // mapped in clubs.ts yet — keeps unmapped sides from showing a blank crest.
  const displayClub: Club | null = club ?? fallbackClub(teamId, apiName, apiLogo);

  const matches = matchesState.status === "success" ? matchesState.data : [];

  const counts = useMemo(
    () => ({
      // Live counts as upcoming for the purposes of "what fixture is on next"
      upcoming: matches.filter((m) => m.status === "upcoming" || m.status === "live").length,
      recent: matches.filter((m) => m.status === "finished").length,
    }),
    [matches],
  );

  const filtered = useMemo(() => {
    if (tab === "upcoming") {
      return matches
        .filter((m) => m.status === "upcoming" || m.status === "live")
        .sort((a, b) => a.kickoffISO.localeCompare(b.kickoffISO));
    }
    return matches
      .filter((m) => m.status === "finished")
      .sort((a, b) => b.kickoffISO.localeCompare(a.kickoffISO));
  }, [matches, tab]);

  return (
    <PageContainer width="lg" className="space-y-10">
      <Link
        href="/table"
        className="inline-flex items-center gap-1 font-mono-label text-[10px] text-[var(--color-text-muted)] transition hover:text-[var(--color-primary)]"
      >
        <ChevronLeft size={14} />
        Back to table
      </Link>

      <TeamHeader
        club={displayClub}
        standing={standingState.status === "success" ? standingState.data : null}
        standingError={standingState.status === "error" ? standingState.error.status : null}
      />

      <Tabs<TabId>
        value={tab}
        onChange={setTab}
        options={[
          { id: "upcoming", label: "Upcoming", count: counts.upcoming },
          { id: "recent",   label: "Recent",   count: counts.recent },
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
            ? "Couldn't reach the backend. Make sure Spring Boot is running on port 8080."
            : `Failed to load fixtures: ${matchesState.error.message}`}
        </div>
      )}

      {matchesState.status === "success" && filtered.length === 0 && (
        <div className="border border-dashed border-[var(--color-line)] py-16 text-center font-mono-label text-xs text-[var(--color-text-muted)]">
          {tab === "upcoming"
            ? "No upcoming fixtures scheduled."
            : "No completed matches yet this season."}
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

function TeamHeader({
  club,
  standing,
  standingError,
}: {
  club: Club | null;
  standing: TeamStanding | null;
  standingError: number | null;
}) {
  if (!club) {
    return (
      <header className="border-b border-[var(--color-line)] pb-8">
        <p className="font-mono-label text-[10px] text-[var(--color-text-faint)]">
          Unknown team
        </p>
      </header>
    );
  }

  return (
    <header className="flex flex-col gap-6 border-b border-[var(--color-line)] pb-8 sm:flex-row sm:items-center sm:gap-8">
      <ClubBadge club={club} size="xl" />
      <div className="min-w-0 flex-1">
        <h1 className="font-display text-4xl font-bold leading-[0.95] tracking-[-0.02em] md:text-5xl">
          {club.name}
        </h1>
        {club.motto && (
          <p className="prose-line mt-2 text-base italic text-[var(--color-text-muted)]">
            “{club.motto}”
          </p>
        )}
        {(club.city || club.founded > 0) && (
          <p className="mt-2 font-mono-label text-[10px] text-[var(--color-text-faint)]">
            {[club.city, club.founded > 0 ? `est. ${club.founded}` : null]
              .filter(Boolean)
              .join(" / ")}
          </p>
        )}

        {/* Standing summary. Only renders if the team has a row; a 404 from the
            standing endpoint is normal for clubs not yet in the table. */}
        {standing && (
          <div className="mt-5 grid grid-cols-3 divide-x divide-[var(--color-line)] border border-[var(--color-line)] sm:max-w-md">
            <Stat label="Position" value={`${ordinal(standing.rank)}`} />
            <Stat label="Points" value={`${standing.points}`} />
            <Stat
              label="Record"
              value={`${standing.win}–${standing.draw}–${standing.lose}`}
              hint="W–D–L"
            />
          </div>
        )}
        {!standing && standingError !== null && standingError !== 404 && (
          <p className="mt-3 font-mono-label text-[10px] text-[var(--color-text-faint)]">
            Standing unavailable.
          </p>
        )}
      </div>
    </header>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="px-4 py-4 text-center">
      <p className="font-mono-label text-[10px] text-[var(--color-text-faint)]">
        {label}
        {hint ? ` / ${hint}` : ""}
      </p>
      <p className="mt-2 font-display text-2xl font-bold tabular-nums leading-none tracking-[-0.02em]">
        {value}
      </p>
    </div>
  );
}

function ordinal(n: number): string {
  if (n <= 0) return "—";
  const v = n % 100;
  if (v >= 11 && v <= 13) return `${n}th`;
  switch (n % 10) {
    case 1: return `${n}st`;
    case 2: return `${n}nd`;
    case 3: return `${n}rd`;
    default: return `${n}th`;
  }
}

/**
 * Build a Club-shaped fallback so unmapped clubs still get a header. Mirrors
 * the fallback in MatchCard.tsx — same justification: a thin object beats
 * showing the user nothing.
 */
function fallbackClub(id: string, name?: string, logo?: string): Club | null {
  if (!name) {
    // We literally have nothing — show the slug back as a placeholder so the
    // page doesn't 404 for unknown teams; the empty-state matches will explain.
    return {
      id,
      name: id,
      shortName: id.slice(0, 3).toUpperCase(),
      city: "",
      region: "Other",
      founded: 0,
      colors: ["#888888", "#cccccc"],
      crestEmoji: "",
      vibe: [],
      motto: "",
    };
  }
  return {
    id,
    name,
    shortName: name.length > 12 ? name.slice(0, 3).toUpperCase() : name,
    city: "",
    region: "Other",
    founded: 0,
    colors: ["#888888", "#cccccc"],
    crestEmoji: "",
    logo,
    vibe: [],
    motto: "",
  };
}