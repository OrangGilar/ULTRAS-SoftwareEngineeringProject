import { api } from "./client";
import type { TeamStanding } from "@/app/types";
import type { ApiMatch } from "./matches";

/** GET /api/standings — full Liga 1 league table. Public; no auth required. */
export async function getStandings(): Promise<TeamStanding[]> {
  const { data } = await api.get<TeamStanding[]>("/api/standings");
  return data;
}

/** GET /api/teams/{slug}/standing — one row of the table. Public. */
export async function getTeamStanding(slug: string): Promise<TeamStanding> {
  const { data } = await api.get<TeamStanding>(
    `/api/teams/${encodeURIComponent(slug)}/standing`,
  );
  return data;
}

/**
 * GET /api/teams/{slug}/matches — every Liga 1 fixture for the given team,
 * sorted by kickoff ascending. Backend returns the same FrontendMatch shape
 * /api/matches uses, so we reuse ApiMatch and let the team-page tabs split
 * the list into Recent (finished) vs Upcoming (upcoming + live) client-side.
 */
export async function getTeamMatches(slug: string): Promise<ApiMatch[]> {
  const { data } = await api.get<ApiMatch[]>(
    `/api/teams/${encodeURIComponent(slug)}/matches`,
  );
  return data;
}