"use client";

import { useEffect, useState } from "react";
import {
  getStandings,
  getTeamStanding,
  getTeamMatches,
  ApiError,
  type ApiMatch,
} from "@/lib/api";
import type { TeamStanding } from "@/app/types";

/**
 * Same fetch-state pattern useMatches uses — kept deliberately consistent so
 * page-level branching (loading / error / success) reads the same everywhere.
 * If we ever swap to SWR or React Query, all of these collapse together.
 */

type State<T> =
  | { status: "loading"; data: null; error: null }
  | { status: "success"; data: T;    error: null }
  | { status: "error";   data: null; error: ApiError };

const LOADING: State<never> = { status: "loading", data: null, error: null };

export function useStandings() {
  const [state, setState] = useState<State<TeamStanding[]>>(LOADING);

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(LOADING);

    getStandings()
      .then((data: any) => {
        if (!cancelled) setState({ status: "success", data, error: null });
      })
      .catch((err: any) => {
        if (!cancelled) {
          const apiErr = err instanceof ApiError ? err : new ApiError(String(err), 0);
          setState({ status: "error", data: null, error: apiErr });
        }
      });

    return () => { cancelled = true; };
  }, []);

  return state;
}

export function useTeamStanding(slug: string | undefined) {
  const [state, setState] = useState<State<TeamStanding>>(LOADING);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(LOADING);

    getTeamStanding(slug)
      .then((data: any) => {
        if (!cancelled) setState({ status: "success", data, error: null });
      })
      .catch((err: any) => {
        if (!cancelled) {
          const apiErr = err instanceof ApiError ? err : new ApiError(String(err), 0);
          setState({ status: "error", data: null, error: apiErr });
        }
      });

    return () => { cancelled = true; };
  }, [slug]);

  return state;
}

export function useTeamMatches(slug: string | undefined) {
  const [state, setState] = useState<State<ApiMatch[]>>(LOADING);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(LOADING);

    getTeamMatches(slug)
      .then((data: any) => {
        if (!cancelled) setState({ status: "success", data, error: null });
      })
      .catch((err: any) => {
        if (!cancelled) {
          const apiErr = err instanceof ApiError ? err : new ApiError(String(err), 0);
          setState({ status: "error", data: null, error: apiErr });
        }
      });

    return () => { cancelled = true; };
  }, [slug]);

  return state;
}