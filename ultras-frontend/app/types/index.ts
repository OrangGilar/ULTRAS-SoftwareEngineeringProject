export type Confidence = 1 | 2 | 3;

export type Club = {
  id: string;
  name: string;
  shortName: string;
  city: string;
  region: "Java" | "Sumatra" | "Sulawesi" | "Bali" | "Kalimantan" | "Other";
  founded: number;
  colors: [string, string];
  crestEmoji: string;
  logo?: string;
  vibe: ("attacking" | "pragmatic" | "youth" | "veteran" | "ultras" | "family")[];
  motto: string;
};

export type MatchStatus = "upcoming" | "live" | "finished" | "postponed";

export type Match = {
  id: string;
  homeId: string;
  awayId: string;
  kickoffISO: string;
  venue: string;
  matchday: number;
  status: MatchStatus;
  finalScore?: { home: number; away: number };
  events?: MatchEvent[];
};

export type MatchEvent = {
  minute: number;
  type: "goal" | "yellow" | "red" | "sub";
  side: "home" | "away";
  player: string;
};

export type Prediction = {
  matchId: string;
  score: { home: number; away: number };
  firstScorerId?: string;
  totalCards?: "under" | "over";
  confidence: Confidence;
  submittedAt: string;
};

export type PointsLine = {
  label: string;
  points: number;
  hit: boolean;
};

export type LocalUser = {
  displayName: string;
  clubId?: string;
  points: number;
  redeemedRewardIds: string[];
  predictions: Record<string, Prediction>;
  reactionsByMatch: Record<string, string>;
  threadVotes: Record<string, 1 | -1>;
  gameHighScores: Record<string, number>;
  prefersAutoReveal: boolean;
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  helper?: string;
  choices: { id: string; label: string; emoji?: string; weights: Partial<QuizWeights> }[];
};

export type QuizWeights = {
  attacking: number;
  pragmatic: number;
  youth: number;
  veteran: number;
  ultras: number;
  family: number;
  java: number;
  sumatra: number;
  sulawesi: number;
  bali: number;
  kalimantan: number;
  underdog: number;
  history: number;
};

export type Thread = {
  id: string;
  clubId?: string;
  title: string;
  body: string;
  authorName: string;
  authorClubId?: string;
  upvotes: number;
  replyCount: number;
  createdAtISO: string;
};

export type Reward = {
  id: string;
  name: string;
  description: string;
  cost: number;
  emoji: string;
  category: "merch" | "experience" | "digital";
};

export type Game = {
  slug: string;
  name: string;
  emoji: string;
  description: string;
  rewardPerWin: number;
};
