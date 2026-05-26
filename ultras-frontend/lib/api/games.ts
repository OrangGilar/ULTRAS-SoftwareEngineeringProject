import { api } from "./client";
import type { Game } from "@/app/types";

export type ApiTriviaQuestion = {
  prompt: string;
  choices: string[];
  answerIndex: number;
};

export type ApiCrestQuestion = {
  clubId: string;
  choices: string[];
  answerIndex: number;
};

/** GET /api/games — full game catalog. Public. */
export async function getGames(): Promise<Game[]> {
  const { data } = await api.get<Game[]>("/api/games");
  return data;
}

/** GET /api/games/{slug} — single game metadata. Public. */
export async function getGame(slug: string): Promise<Game> {
  const { data } = await api.get<Game>(`/api/games/${encodeURIComponent(slug)}`);
  return data;
}

/** GET /api/games/trivia/questions — all trivia questions. Public. */
export async function getTriviaQuestions(): Promise<ApiTriviaQuestion[]> {
  const { data } = await api.get<ApiTriviaQuestion[]>("/api/games/trivia/questions");
  return data;
}

/** GET /api/games/crest/questions — all crest quiz questions. Public. */
export async function getCrestQuestions(): Promise<ApiCrestQuestion[]> {
  const { data } = await api.get<ApiCrestQuestion[]>("/api/games/crest/questions");
  return data;
}
