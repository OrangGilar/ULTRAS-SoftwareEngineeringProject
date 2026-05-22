import type { Match } from "@/app/types";

/**
 * Hardcoded slate of upcoming Super League 2025/26 fixtures.
 *
 * These exist as a frontend-only mock because the backend's synced data is
 * the 2024/25 season (all matches FT). Until we re-sync against a season
 * with future fixtures, we slot these in to give the Upcoming tab and the
 * onboarding flow something real-feeling to show.
 *
 * Kickoff timestamps are computed relative to "now" so the matches always
 * appear as Today / Tomorrow rather than going stale. Recomputed at module
 * load — i.e. on each fresh page navigation, which is fine for a mock.
 *
 * Match IDs use the `mock_upcoming_` prefix so the predict page can route
 * to them without colliding with backend-issued IDs (which are either
 * numeric api-football fixture IDs or UUIDs).
 *
 * When real upstream data lands, delete this file and remove the calls
 * to it from the matches page, predict page, onboarding result, and
 * lib/mock/matches.ts.
 */

/** Local-time helper. Picks today or tomorrow at a given hour:minute, returns ISO with +07:00 offset. */
function kickoff(dayOffset: 0 | 1, hour: number, minute: number): string {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  d.setHours(hour, minute, 0, 0);
  // Western Indonesia Time (WIB) is UTC+7 — match the rest of the codebase's
  // convention. toISOString would give us UTC; we build the local string by hand.
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(hour).padStart(2, "0");
  const mn = String(minute).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}T${hh}:${mn}:00+07:00`;
}

export const upcomingFixtures: Match[] = [
  // ---- Today ----
  {
    id: "mock_upcoming_001",
    homeId: "arema",
    awayId: "psim",
    kickoffISO: kickoff(0, 15, 30),
    venue: "Stadion Kanjuruhan",
    matchday: 1,
    status: "upcoming",
  },
  {
    id: "mock_upcoming_002",
    homeId: "dewa",
    awayId: "bali",
    kickoffISO: kickoff(0, 19, 0),
    venue: "Indomilk Arena",
    matchday: 1,
    status: "upcoming",
  },
  // ---- Tomorrow ----
  {
    id: "mock_upcoming_003",
    homeId: "madura",
    awayId: "psm",
    kickoffISO: kickoff(1, 16, 0),
    venue: "Stadion Gelora Madura",
    matchday: 1,
    status: "upcoming",
  },
  {
    id: "mock_upcoming_004",
    homeId: "bhayangkara",
    awayId: "psbs",
    kickoffISO: kickoff(1, 16, 0),
    venue: "PTIK Jakarta",
    matchday: 1,
    status: "upcoming",
  },
  {
    id: "mock_upcoming_005",
    homeId: "borneo",
    awayId: "malut",
    kickoffISO: kickoff(1, 16, 0),
    venue: "Stadion Batakan",
    matchday: 1,
    status: "upcoming",
  },
  {
    id: "mock_upcoming_006",
    homeId: "persija",
    awayId: "semenpadang",
    kickoffISO: kickoff(1, 16, 0),
    venue: "Stadion Utama GBK",
    matchday: 1,
    status: "upcoming",
  },
  {
    id: "mock_upcoming_007",
    homeId: "persita",
    awayId: "persis",
    kickoffISO: kickoff(1, 16, 0),
    venue: "Indomilk Arena",
    matchday: 1,
    status: "upcoming",
  },
  {
    id: "mock_upcoming_008",
    homeId: "persebaya",
    awayId: "persik",
    kickoffISO: kickoff(1, 16, 0),
    venue: "Stadion Gelora Bung Tomo",
    matchday: 1,
    status: "upcoming",
  },
  {
    id: "mock_upcoming_009",
    homeId: "persib",
    awayId: "persijap",
    kickoffISO: kickoff(1, 16, 0),
    venue: "Stadion Si Jalak Harupat",
    matchday: 1,
    status: "upcoming",
  },
];

/** Set of mock IDs for fast O(1) "is this one of ours?" checks in the predict page. */
export const upcomingFixtureIds: Set<string> = new Set(
  upcomingFixtures.map((m) => m.id),
);

/**
 * Find the first upcoming fixture involving the given club slug (home or away).
 * Used by the onboarding result page to surface "your team's next match" right
 * after the quiz reveal. Returns undefined if the club isn't in the slate —
 * the result page handles that gracefully.
 */
export function findFixtureForClub(clubId: string | undefined): Match | undefined {
  if (!clubId) return undefined;
  return upcomingFixtures.find(
    (m) => m.homeId === clubId || m.awayId === clubId,
  );
}