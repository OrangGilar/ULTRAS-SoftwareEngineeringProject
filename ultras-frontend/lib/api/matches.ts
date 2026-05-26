import { api } from "./client";
import type { Match } from "@/app/types";

/**
 * The backend's FrontendMatch DTO is a superset of the frontend's Match type
 * (it adds homeName/awayName/homeLogo/awayLogo for fallbacks when the slug
 * isn't in the clubs catalog).
 */
export type ApiMatch = Match & {
  homeName?: string;
  awayName?: string;
  homeLogo?: string;
  awayLogo?: string;
};

/** GET /api/matches — full Liga 1 fixture list. Public; no auth required. */
export async function getMatches(): Promise<ApiMatch[]> {
  const { data } = await api.get<ApiMatch[]>("/api/matches");
  return data;
}

/** GET /api/matches/live — only currently-live matches. Public. */
export async function getLiveMatches(): Promise<ApiMatch[]> {
  const { data } = await api.get<ApiMatch[]>("/api/matches/live");
  return data;
}

/** GET /api/matches/{id} — single match. ID is the API-Football fixture ID as a string. */
export async function getMatch(id: string): Promise<ApiMatch> {
  const { data } = await api.get<ApiMatch>(`/api/matches/${encodeURIComponent(id)}`);
  return data;
}

/**
 * POST /api/matches/sync — force refresh from the upstream API. Auth required
 * (anyone authenticated; tighten to ADMIN once role claims land in the JWT).
 */
export async function forceSyncMatches(): Promise<{ synced: number }> {
  const { data } = await api.post<{ synced: number }>("/api/matches/sync");
  return data;
}