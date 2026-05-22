"use client";

import { useEffect, useRef } from "react";

/**
 * Calls `fetcher` immediately, then on an interval, until the component
 * unmounts. The polling pauses automatically when the browser tab is
 * hidden — the standard pattern — and resumes when it becomes visible
 * again. Saves bandwidth, battery, and stops new tabs from racking up
 * useless requests.
 *
 * Note this is NOT a real-time channel. The thread page uses it to give
 * the "feels live" UX (new replies appear within ~7 seconds) without
 * standing up a WebSocket. For true server-push, an STOMP/SockJS or
 * SSE layer is needed.
 *
 * `intervalMs` is the polling cadence. 7000ms is a good default for
 * a chat-style view — short enough that the UI feels responsive,
 * long enough that idle threads don't hammer the backend. Bumping it
 * up if many users are online is fine; this is a soft, best-effort sync.
 *
 * The `enabled` flag lets callers conditionally turn polling off
 * (e.g. while a modal is open or during an offline state).
 */
export function usePollingFetch(
  fetcher: () => void | Promise<unknown>,
  intervalMs: number,
  enabled: boolean = true,
) {
  // Keep the latest fetcher in a ref so that if the caller passes a new
  // closure on every render we don't blow away the interval. Without this,
  // every parent re-render would reset the timer to 0 and the interval
  // would never actually fire.
  const fetcherRef = useRef(fetcher);
  useEffect(() => { fetcherRef.current = fetcher; }, [fetcher]);

  useEffect(() => {
    if (!enabled) return;

    let intervalId: ReturnType<typeof setInterval> | null = null;

    const tick = () => {
      // Don't fire while the tab is hidden — wastes requests and can stack
      // up in flight if the user comes back after a long absence.
      if (typeof document !== "undefined" && document.hidden) return;
      try {
        // Intentionally don't await — concurrent polls are caller's problem
        // to handle (the thread page handles it via a `cancelled` flag).
        void fetcherRef.current();
      } catch {
        // Swallow synchronous throws; async ones are the fetcher's responsibility.
      }
    };

    intervalId = setInterval(tick, intervalMs);

    // When the tab becomes visible again, fire one extra tick immediately
    // so the user doesn't have to wait up to `intervalMs` for the next refresh.
    const onVisibility = () => { if (!document.hidden) tick(); };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      if (intervalId !== null) clearInterval(intervalId);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [intervalMs, enabled]);
}