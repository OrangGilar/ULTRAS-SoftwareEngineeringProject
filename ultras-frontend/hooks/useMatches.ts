"use client";

import { useEffect, useState } from "react";
import { getMatches, getLiveMatches, getMatch, type ApiMatch } from "@/lib/api";
import { ApiError } from "@/lib/api";

/**
 * Tiny fetch hook for the matches list. Deliberately not pulling in SWR / React
 * Query yet — this app has three GET endpoints and the boilerplate for one
 * effect is shorter than the boilerplate for setting up a query client.
 *
 * If the backend is unreachable (CORS misconfig, wrong port, container not up),
 * `error` will be a network-level ApiError with status: 0. Render state in the
 * UI accordingly — the matches page falls back to an empty list with a message.
 */

type State<T> =
  | { status: "loading"; data: null; error: null }
  | { status: "success"; data: T;    error: null }
  | { status: "error";   data: null; error: ApiError };

const LOADING: State<never> = { status: "loading", data: null, error: null };

export function useMatches(filter: "all" | "live" = "all") {
  const [state, setState] = useState<State<ApiMatch[]>>(LOADING);

  useEffect(() => {
    let cancelled = false;
    setState(LOADING);

    const fetcher = filter === "live" ? getLiveMatches : getMatches;
    fetcher()
      .then((data) => {
        if (!cancelled) setState({ status: "success", data, error: null });
      })
      .catch((err) => {
        if (!cancelled) {
          const apiErr = err instanceof ApiError ? err : new ApiError(String(err), 0);
          setState({ status: "error", data: null, error: apiErr });
        }
      });

    return () => { cancelled = true; };
  }, [filter]);

  return state;
}

export function useMatch(id: string | undefined) {
  const [state, setState] = useState<State<ApiMatch>>(LOADING);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setState(LOADING);

    getMatch(id)
      .then((data) => {
        if (!cancelled) setState({ status: "success", data, error: null });
      })
      .catch((err) => {
        if (!cancelled) {
          const apiErr = err instanceof ApiError ? err : new ApiError(String(err), 0);
          setState({ status: "error", data: null, error: apiErr });
        }
      });

    return () => { cancelled = true; };
  }, [id]);

  return state;
}