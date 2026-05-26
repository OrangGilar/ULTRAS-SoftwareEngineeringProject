"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Club } from "@/app/types";
import { getClubs } from "@/lib/api/clubs";

/**
 * App-wide club catalog. The list is fetched once on first mount and cached
 * in context, so the rest of the app can call `useClubs().getClub(id)`
 * synchronously the way it used to with the static mock data.
 *
 * While the initial fetch is in flight, `clubs` is an empty array and
 * `loading` is true. Components that render *only* a club logo should
 * gracefully handle `undefined` returns from `getClub` during that window.
 */

type ClubsState = {
  clubs: Club[];
  clubsById: Record<string, Club>;
  getClub: (id: string | undefined) => Club | undefined;
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

const ClubsContext = createContext<ClubsState | null>(null);

export function ClubsProvider({ children }: { children: ReactNode }) {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getClubs()
      .then((data) => {
        if (!cancelled) {
          setClubs(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load clubs");
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, [tick]);

  const value = useMemo<ClubsState>(() => {
    const clubsById = Object.fromEntries(clubs.map((c) => [c.id, c]));
    return {
      clubs,
      clubsById,
      getClub: (id) => (id ? clubsById[id] : undefined),
      loading,
      error,
      refetch: () => setTick((n) => n + 1),
    };
  }, [clubs, loading, error]);

  return <ClubsContext.Provider value={value}>{children}</ClubsContext.Provider>;
}

export function useClubs(): ClubsState {
  const ctx = useContext(ClubsContext);
  if (!ctx) {
    throw new Error("useClubs must be used within a ClubsProvider");
  }
  return ctx;
}

/** Sentinel for the "General" community — threads with no clubTag. */
export const GENERAL_COMMUNITY_TAG = "__general__";
