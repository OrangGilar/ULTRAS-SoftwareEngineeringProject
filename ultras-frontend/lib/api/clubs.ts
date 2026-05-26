import { api } from "./client";
import type { Club } from "@/app/types";

/** GET /api/clubs — full Liga 1 club catalog. Public; no auth required. */
export async function getClubs(): Promise<Club[]> {
  const { data } = await api.get<Club[]>("/api/clubs");
  return data;
}

/** GET /api/clubs/{id} — single club by slug. */
export async function getClubById(id: string): Promise<Club> {
  const { data } = await api.get<Club>(`/api/clubs/${encodeURIComponent(id)}`);
  return data;
}
