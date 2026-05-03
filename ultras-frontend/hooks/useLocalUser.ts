"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import type { LocalUser, Prediction } from "@/app/types";

const STORAGE_KEY = "ultras:user:v1";

const DEFAULT_USER: LocalUser = {
  displayName: "Supporter",
  clubId: undefined,
  points: 1250,
  redeemedRewardIds: [],
  predictions: {},
  reactionsByMatch: {},
  threadVotes: {},
  gameHighScores: {},
  prefersAutoReveal: false,
};

const listeners = new Set<() => void>();
let cache: LocalUser | null = null;

function read(): LocalUser {
  if (typeof window === "undefined") return DEFAULT_USER;
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      cache = DEFAULT_USER;
      return cache;
    }
    const parsed = JSON.parse(raw) as Partial<LocalUser>;
    cache = { ...DEFAULT_USER, ...parsed };
    return cache;
  } catch {
    cache = DEFAULT_USER;
    return cache;
  }
}

function write(next: LocalUser) {
  cache = next;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getServerSnapshot(): LocalUser {
  return DEFAULT_USER;
}

export function useLocalUser() {
  const user = useSyncExternalStore(subscribe, read, getServerSnapshot);

  const update = useCallback((patch: Partial<LocalUser> | ((prev: LocalUser) => Partial<LocalUser>)) => {
    const prev = read();
    const next = typeof patch === "function" ? patch(prev) : patch;
    write({ ...prev, ...next });
  }, []);

  const adoptClub = useCallback((clubId: string) => {
    update({ clubId });
  }, [update]);

  const addPoints = useCallback((delta: number) => {
    const prev = read();
    write({ ...prev, points: Math.max(0, prev.points + delta) });
  }, []);

  const savePrediction = useCallback((prediction: Prediction) => {
    const prev = read();
    write({
      ...prev,
      predictions: { ...prev.predictions, [prediction.matchId]: prediction },
    });
  }, []);

  const setReaction = useCallback((matchId: string, emoji: string) => {
    const prev = read();
    const current = prev.reactionsByMatch[matchId];
    const nextMap = { ...prev.reactionsByMatch };
    if (current === emoji) {
      delete nextMap[matchId];
    } else {
      nextMap[matchId] = emoji;
    }
    write({ ...prev, reactionsByMatch: nextMap });
  }, []);

  const toggleVote = useCallback((threadId: string, dir: 1 | -1) => {
    const prev = read();
    const cur = prev.threadVotes[threadId];
    const nextMap = { ...prev.threadVotes };
    if (cur === dir) {
      delete nextMap[threadId];
    } else {
      nextMap[threadId] = dir;
    }
    write({ ...prev, threadVotes: nextMap });
  }, []);

  const redeem = useCallback((rewardId: string, cost: number) => {
    const prev = read();
    if (prev.points < cost) return false;
    write({
      ...prev,
      points: prev.points - cost,
      redeemedRewardIds: [...prev.redeemedRewardIds, rewardId],
    });
    return true;
  }, []);

  const recordGameScore = useCallback((slug: string, score: number, reward: number) => {
    const prev = read();
    const best = Math.max(prev.gameHighScores[slug] ?? 0, score);
    write({
      ...prev,
      gameHighScores: { ...prev.gameHighScores, [slug]: best },
      points: prev.points + reward,
    });
  }, []);

  return {
    user,
    update,
    adoptClub,
    addPoints,
    savePrediction,
    setReaction,
    toggleVote,
    redeem,
    recordGameScore,
  };
}

export function useHydrated(): boolean {
  const get = () => true;
  const getServer = () => false;
  return useSyncExternalStore(
    () => () => undefined,
    get,
    getServer,
  );
}

export function useResetUser() {
  return useCallback(() => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    cache = null;
    listeners.forEach((l) => l());
  }, []);
}

export function useEnsureCache() {
  useEffect(() => {
    read();
  }, []);
}
