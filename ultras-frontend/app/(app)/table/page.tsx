"use client";

import Link from "next/link";
import { PageContainer, PageHeader } from "@/components/layout/PageContainer";
import { useStandings } from "@/hooks/useStandings";
import { getClub } from "@/lib/mock/clubs";
import { cn } from "@/lib/utils";
import type { TeamStanding } from "@/app/types";

/**
 * Liga 1 league table. One fetch from /api/standings, one row per club.
 * Each row links into /teams/{teamId} so users can drill into recent and
 * upcoming fixtures for that side without going back through the global list.
 *
 * Form is rendered as five tiny dots (W=primary, D=muted, L=faint) so the
 * column stays readable at narrow widths. Columns collapse on mobile — only
 * P / W / D / L / GD / Pts are essential, the rest hide.
 */
export default function TablePage() {
  const standings = useStandings();
  const rows = standings.status === "success" ? standings.data : [];

  return (
    <PageContainer width="lg" className="space-y-10">
      <PageHeader
        eyebrow="Liga 1 / Indonesia"
        title={<>Table.</>}
        lede="Standings as of the last completed matchday. Tap a club to see their fixtures."
      />

      {standings.status === "loading" && (
        <div className="border border-dashed border-[var(--color-line)] py-16 text-center font-mono-label text-xs text-[var(--color-text-muted)]">
          Loading standings…
        </div>
      )}

      {standings.status === "error" && (
        <div
          role="alert"
          className="border border-[var(--color-primary)] py-10 px-5 font-mono-label text-xs text-[var(--color-primary)]"
        >
          {standings.error.status === 0
            ? "Couldn't reach the backend. Make sure Spring Boot is running on port 8080."
            : `Failed to load standings: ${standings.error.message}`}
        </div>
      )}

      {standings.status === "success" && rows.length === 0 && (
        <div className="border border-dashed border-[var(--color-line)] py-16 text-center font-mono-label text-xs text-[var(--color-text-muted)]">
          No standings yet — the season may not have started.
        </div>
      )}

      {standings.status === "success" && rows.length > 0 && (
        <div className="border-y border-[var(--color-line)]">
          {/* header */}
          <div className="grid grid-cols-[2.5rem_1fr_2rem_2rem_2rem_2rem_3rem_3rem] items-center gap-2 border-b border-[var(--color-line)] py-3 font-mono-label text-[10px] text-[var(--color-text-faint)] sm:grid-cols-[2.5rem_1fr_2.5rem_2.5rem_2.5rem_2.5rem_3.5rem_3.5rem_5rem]">
            <span className="pl-2">#</span>
            <span>Team</span>
            <span className="text-right">P</span>
            <span className="text-right">W</span>
            <span className="text-right">D</span>
            <span className="text-right">L</span>
            <span className="text-right">GD</span>
            <span className="pr-2 text-right">Pts</span>
            <span className="hidden pr-2 text-right sm:block">Form</span>
          </div>

          <ul>
            {rows.map((row) => (
              <li key={row.teamId} className="border-b border-[var(--color-line)] last:border-b-0">
                <StandingRow row={row} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </PageContainer>
  );
}

function StandingRow({ row }: { row: TeamStanding }) {
  // Prefer the local clubs.ts entry for crest + short name (richer art) and fall
  // back to whatever the API gave us if this team isn't mapped yet.
  const club = getClub(row.teamId);
  const displayLogo = club?.logo ?? row.teamLogo;
  const displayName = club?.name ?? row.teamName;
  const shortName = club?.shortName ?? abbreviate(row.teamName);

  // Top 3 / bottom 3 markers — light visual cue, no real meaning beyond
  // "championship contention" vs "relegation zone". Liga 1 doesn't have
  // continental qualification slots that we render specifically.
  const positionAccent =
    row.rank <= 3
      ? "text-[var(--color-primary)]"
      : "text-[var(--color-text)]";

  return (
    <Link
      href={`/teams/${row.teamId}`}
      className="group grid grid-cols-[2.5rem_1fr_2rem_2rem_2rem_2rem_3rem_3rem] items-center gap-2 py-3 transition hover:bg-[var(--color-line)]/30 sm:grid-cols-[2.5rem_1fr_2.5rem_2.5rem_2.5rem_2.5rem_3.5rem_3.5rem_5rem]"
    >
      <span
        className={cn(
          "pl-2 font-display text-base font-bold tabular-nums tracking-[-0.02em]",
          positionAccent,
        )}
      >
        {row.rank}
      </span>

      <div className="flex min-w-0 items-center gap-3">
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full ring-1 ring-[var(--color-line)]">
          {displayLogo ? (
            <img src={displayLogo} alt="" className="h-4/5 w-4/5 object-contain" />
          ) : (
            <span aria-hidden className="text-sm">{club?.crestEmoji ?? "—"}</span>
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold tracking-tight transition group-hover:text-[var(--color-primary)]">
            <span className="hidden sm:inline">{displayName}</span>
            <span className="sm:hidden">{shortName}</span>
          </p>
        </div>
      </div>

      <span className="text-right font-mono-label text-xs tabular-nums text-[var(--color-text-muted)]">
        {row.played}
      </span>
      <span className="text-right font-mono-label text-xs tabular-nums text-[var(--color-text-muted)]">
        {row.win}
      </span>
      <span className="text-right font-mono-label text-xs tabular-nums text-[var(--color-text-muted)]">
        {row.draw}
      </span>
      <span className="text-right font-mono-label text-xs tabular-nums text-[var(--color-text-muted)]">
        {row.lose}
      </span>
      <span className="text-right font-mono-label text-xs tabular-nums text-[var(--color-text-muted)]">
        {row.goalsDiff > 0 ? `+${row.goalsDiff}` : row.goalsDiff}
      </span>
      <span className="pr-2 text-right font-display text-sm font-bold tabular-nums tracking-[-0.02em]">
        {row.points}
      </span>
      <span className="hidden pr-2 sm:block">
        {row.form ? <FormDots form={row.form} /> : null}
      </span>
    </Link>
  );
}

/** Five-character W/D/L streak as colored dots. Reads left-to-right oldest-to-newest. */
function FormDots({ form }: { form: string }) {
  // API-Football returns most-recent-first sometimes — keep the chars in the
  // order they came in and let the user infer orientation from context.
  const chars = form.slice(0, 5).split("");
  return (
    <div className="flex justify-end gap-1">
      {chars.map((c, i) => {
        const color =
          c === "W"
            ? "bg-[var(--color-primary)]"
            : c === "D"
              ? "bg-[var(--color-text-muted)]"
              : c === "L"
                ? "bg-[var(--color-text-faint)]"
                : "bg-[var(--color-line)]";
        return <span key={i} className={cn("h-2 w-2 rounded-full", color)} aria-hidden />;
      })}
    </div>
  );
}

function abbreviate(name: string): string {
  if (!name) return "—";
  // Use first 3 chars uppercase as a pragmatic short form when no club mapping exists.
  return name.length > 3 ? name.slice(0, 3).toUpperCase() : name.toUpperCase();
}