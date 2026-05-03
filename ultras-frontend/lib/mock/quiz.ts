import type { Club, QuizQuestion, QuizWeights } from "@/app/types";
import { clubs } from "./clubs";

export const quizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    prompt: "What kind of football makes you stand up?",
    helper: "Pick whatever pulls you out of your seat.",
    choices: [
      { id: "a", label: "Goal-fest, foot on the gas", weights: { attacking: 3 } },
      { id: "b", label: "Tactical, smart, low-block heroics", weights: { pragmatic: 3 } },
      { id: "c", label: "Physical, set-piece warfare", weights: { veteran: 2, pragmatic: 1 } },
      { id: "d", label: "Free-flowing youth project", weights: { youth: 3 } },
    ],
  },
  {
    id: "q2",
    prompt: "Where does your heart already live?",
    helper: "Cultural pull matters as much as standings.",
    choices: [
      { id: "a", label: "West Java", weights: { java: 3 } },
      { id: "b", label: "East Java", weights: { java: 2, ultras: 1 } },
      { id: "c", label: "Sulawesi", weights: { sulawesi: 3 } },
      { id: "d", label: "Bali / Nusa Tenggara", weights: { bali: 3 } },
      { id: "e", label: "Anywhere — I follow vibes", weights: { underdog: 1 } },
    ],
  },
  {
    id: "q3",
    prompt: "Trophies vs the long climb?",
    choices: [
      { id: "a", label: "Give me history, banners, the lot", weights: { history: 3, veteran: 1 } },
      { id: "b", label: "I'm here for the underdog story", weights: { underdog: 3, youth: 1 } },
      { id: "c", label: "Mix — proud history but rebuilding", weights: { history: 1, underdog: 1 } },
    ],
  },
  {
    id: "q4",
    prompt: "How loud is the away end?",
    helper: "Rivalries and tifo culture.",
    choices: [
      { id: "a", label: "Full ultras experience, smoke and all", weights: { ultras: 3 } },
      { id: "b", label: "Loud but family-friendly", weights: { ultras: 1, family: 2 } },
      { id: "c", label: "I'm the calm one in the stand", weights: { family: 3 } },
    ],
  },
  {
    id: "q5",
    prompt: "Match day vibe of choice?",
    choices: [
      { id: "a", label: "Tifo, drums, chants from minute one", weights: { ultras: 3, attacking: 1 } },
      { id: "b", label: "Tactical chess on the touchline", weights: { pragmatic: 2, veteran: 1 } },
      { id: "c", label: "Bring the kids, have a sambal", weights: { family: 3 } },
      { id: "d", label: "Watch the next gen break out", weights: { youth: 3 } },
    ],
  },
];

const REGION_KEY: Record<Club["region"], keyof QuizWeights | null> = {
  Java: "java",
  Sumatra: "sumatra",
  Sulawesi: "sulawesi",
  Bali: "bali",
  Kalimantan: "kalimantan",
  Other: null,
};

export type QuizAnswer = { questionId: string; choiceId: string };

export type QuizMatch = {
  club: Club;
  matchPercent: number;
  reasons: string[];
};

export function recommendClubs(answers: QuizAnswer[]): QuizMatch[] {
  const totals: Partial<QuizWeights> = {};
  for (const a of answers) {
    const q = quizQuestions.find((qq) => qq.id === a.questionId);
    const choice = q?.choices.find((c) => c.id === a.choiceId);
    if (!choice) continue;
    for (const k of Object.keys(choice.weights) as (keyof QuizWeights)[]) {
      totals[k] = (totals[k] ?? 0) + (choice.weights[k] ?? 0);
    }
  }

  const scored = clubs.map((club) => {
    let score = 0;
    const reasons: string[] = [];
    for (const v of club.vibe) {
      const bonus = totals[v as keyof QuizWeights] ?? 0;
      if (bonus > 0) {
        score += bonus * 1.25;
        reasons.push(`Plays ${v} football`);
      }
    }
    const regionKey = REGION_KEY[club.region];
    if (regionKey && totals[regionKey]) {
      score += (totals[regionKey] ?? 0) * 1.4;
      reasons.push(`Based in ${club.city}`);
    }
    if ((totals.history ?? 0) > 0 && club.founded < 1970) {
      score += (totals.history ?? 0) * 1.2;
      reasons.push("Decades of history");
    }
    if ((totals.underdog ?? 0) > 0 && club.founded > 1980) {
      score += (totals.underdog ?? 0) * 1.1;
      reasons.push("Modern-era rebuilders");
    }
    return { club, score, reasons: dedupe(reasons) };
  });

  const max = Math.max(1, ...scored.map((s) => s.score));
  return scored
    .map((s) => ({
      club: s.club,
      matchPercent: Math.round(Math.min(99, 45 + (s.score / max) * 54)),
      reasons: s.reasons.slice(0, 4),
    }))
    .sort((a, b) => b.matchPercent - a.matchPercent)
    .slice(0, 3);
}

function dedupe(arr: string[]): string[] {
  const seen = new Set<string>();
  return arr.filter((x) => {
    if (seen.has(x)) return false;
    seen.add(x);
    return true;
  });
}
