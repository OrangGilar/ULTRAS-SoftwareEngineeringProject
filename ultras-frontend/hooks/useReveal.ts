"use client";

import { useCallback, useEffect, useState } from "react";

export type RevealPhase =
  | "idle"
  | "revealingScore"
  | "revealingOutcome"
  | "revealingBreakdown"
  | "settled";

const ORDER: RevealPhase[] = [
  "idle",
  "revealingScore",
  "revealingOutcome",
  "revealingBreakdown",
  "settled",
];

const TIMINGS: Record<RevealPhase, number> = {
  idle: 0,
  revealingScore: 750,
  revealingOutcome: 650,
  revealingBreakdown: 550,
  settled: 0,
};

export function useReveal(autoReveal: boolean, sessionKey?: string) {
  const initial: RevealPhase = (() => {
    if (typeof window === "undefined") return "idle";
    if (!sessionKey) return "idle";
    const persisted = window.sessionStorage.getItem(sessionKey);
    if (persisted === "settled") return "settled";
    return "idle";
  })();

  const [phase, setPhase] = useState<RevealPhase>(initial);

  useEffect(() => {
    if (autoReveal && phase === "idle") {
      const t = setTimeout(() => setPhase("revealingScore"), 800);
      return () => clearTimeout(t);
    }
    return;
  }, [autoReveal, phase]);

  useEffect(() => {
    if (phase === "idle" || phase === "settled") return;
    const t = setTimeout(() => {
      const idx = ORDER.indexOf(phase);
      const next = ORDER[idx + 1] ?? "settled";
      setPhase(next);
    }, TIMINGS[phase]);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (sessionKey && typeof window !== "undefined") {
      window.sessionStorage.setItem(sessionKey, phase);
    }
  }, [phase, sessionKey]);

  const start = useCallback(() => {
    setPhase((p) => (p === "idle" ? "revealingScore" : p));
  }, []);

  const replay = useCallback(() => {
    setPhase("idle");
    setTimeout(() => setPhase("revealingScore"), 100);
  }, []);

  return { phase, start, replay };
}
