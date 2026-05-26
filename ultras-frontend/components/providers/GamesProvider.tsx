"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Game } from "@/app/types";
import type { ApiTriviaQuestion, ApiCrestQuestion } from "@/lib/api/games";
import { getGames, getTriviaQuestions, getCrestQuestions } from "@/lib/api/games";

type GamesState = {
  games: Game[];
  triviaQuestions: ApiTriviaQuestion[];
  crestQuestions: ApiCrestQuestion[];
  getGame: (slug: string) => Game | undefined;
  loading: boolean;
  error: string | null;
};

const GamesContext = createContext<GamesState | null>(null);

export function GamesProvider({ children }: { children: ReactNode }) {
  const [games, setGames] = useState<Game[]>([]);
  const [triviaQuestions, setTriviaQuestions] = useState<ApiTriviaQuestion[]>([]);
  const [crestQuestions, setCrestQuestions] = useState<ApiCrestQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    Promise.all([getGames(), getTriviaQuestions(), getCrestQuestions()])
      .then(([g, t, c]) => {
        if (!cancelled) {
          setGames(g);
          setTriviaQuestions(t);
          setCrestQuestions(c);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load games");
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, []);

  const value = useMemo<GamesState>(() => ({
    games,
    triviaQuestions,
    crestQuestions,
    getGame: (slug) => games.find((g) => g.slug === slug),
    loading,
    error,
  }), [games, triviaQuestions, crestQuestions, loading, error]);

  return <GamesContext.Provider value={value}>{children}</GamesContext.Provider>;
}

export function useGames(): GamesState {
  const ctx = useContext(GamesContext);
  if (!ctx) throw new Error("useGames must be used within a GamesProvider");
  return ctx;
}
