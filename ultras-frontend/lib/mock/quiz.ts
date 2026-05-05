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
      { id: "e", label: "Anywhere. I follow vibes", weights: { underdog: 1 } },
    ],
  },
  {
    id: "q3",
    prompt: "Trophies vs the long climb?",
    choices: [
      { id: "a", label: "Give me history, banners, the lot", weights: { history: 3, veteran: 1 } },
      { id: "b", label: "I'm here for the underdog story", weights: { underdog: 3, youth: 1 } },
      { id: "c", label: "Mix. Proud history but rebuilding", weights: { history: 1, underdog: 1 } },
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
  {
    id: "q6",
    prompt: "Press shape, in or out of possession?",
    helper: "How does your team want the ball back?",
    choices: [
      { id: "a", label: "High press from the front, suffocate them", weights: { attacking: 3, ultras: 1 } },
      { id: "b", label: "Mid block, spring the counter", weights: { pragmatic: 3 } },
      { id: "c", label: "Compact low block, soak and strike", weights: { pragmatic: 2, veteran: 1 } },
      { id: "d", label: "Possession, pass them dizzy", weights: { youth: 2, attacking: 1 } },
    ],
  },
  {
    id: "q7",
    prompt: "Pick a stadium feel.",
    choices: [
      { id: "a", label: "Cauldron at full capacity, terrace bouncing", weights: { ultras: 3 } },
      { id: "b", label: "Old ground, peeling paint, pure history", weights: { history: 3, veteran: 1 } },
      { id: "c", label: "Modern build, families and away end mixed", weights: { family: 3 } },
      { id: "d", label: "Out-of-town concrete bowl, regional pride", weights: { underdog: 2, ultras: 1 } },
    ],
  },
  {
    id: "q8",
    prompt: "The player you build around?",
    choices: [
      { id: "a", label: "The veteran general, calls every shape", weights: { veteran: 3 } },
      { id: "b", label: "The 19-year-old breakout, nothing to lose", weights: { youth: 3 } },
      { id: "c", label: "The set-piece specialist, ice in their veins", weights: { pragmatic: 2 } },
      { id: "d", label: "The local kid, made through the academy", weights: { youth: 2, family: 1 } },
    ],
  },
  {
    id: "q9",
    prompt: "Manager you'd hire today?",
    choices: [
      { id: "a", label: "Firebrand, presser-room storms, alive on the touchline", weights: { ultras: 2, attacking: 1 } },
      { id: "b", label: "Cool head, blueprint manager, decade-long plan", weights: { pragmatic: 2, veteran: 1 } },
      { id: "c", label: "Academy lifer, knows every kid by name", weights: { youth: 3 } },
      { id: "d", label: "Returning legend, motto written in their handwriting", weights: { history: 2, veteran: 1 } },
    ],
  },
  {
    id: "q10",
    prompt: "Which Liga 1 era pulls you?",
    helper: "Football you'd happily rewatch on a rainy Sunday.",
    choices: [
      { id: "a", label: "1990s Galatama nostalgia, grainy VHS magic", weights: { history: 3, veteran: 1 } },
      { id: "b", label: "Mid-2000s Persija and Persib supremacy", weights: { history: 2, ultras: 1 } },
      { id: "c", label: "2010s rebuild years, foreigners and fresh faces", weights: { underdog: 2, attacking: 1 } },
      { id: "d", label: "Right now, the league as it stands", weights: { youth: 2, attacking: 1 } },
    ],
  },
  {
    id: "q11",
    prompt: "Away days, where do you stand?",
    choices: [
      { id: "a", label: "Every away, anywhere, even Papua", weights: { ultras: 3 } },
      { id: "b", label: "Pick the rivalries, skip the dead rubbers", weights: { ultras: 1, pragmatic: 1 } },
      { id: "c", label: "Home end only, that's the pact", weights: { family: 2, veteran: 1 } },
      { id: "d", label: "Stream from the warung with the regulars", weights: { family: 1, underdog: 1 } },
    ],
  },
  {
    id: "q12",
    prompt: "Pre-match meal of choice?",
    helper: "Regional pull. We see you.",
    choices: [
      { id: "a", label: "Soto Betawi, Jakarta to the bone", weights: { java: 2 } },
      { id: "b", label: "Nasi pecel, Malang or nothing", weights: { java: 2, ultras: 1 } },
      { id: "c", label: "Coto Makassar, no apologies", weights: { sulawesi: 3 } },
      { id: "d", label: "Babi guling at the warung after kickoff", weights: { bali: 3 } },
      { id: "e", label: "Soto Padang, broth that builds men", weights: { sumatra: 3 } },
      { id: "f", label: "Nasi kuning Banjar, Kalimantan side of the family", weights: { kalimantan: 3 } },
    ],
  },
  {
    id: "q13",
    prompt: "Win the league or be the people's club?",
    choices: [
      { id: "a", label: "Trophies. Banners on the wall. End of story.", weights: { history: 3, veteran: 1 } },
      { id: "b", label: "People's club. The terrace is the trophy.", weights: { ultras: 3, family: 1 } },
      { id: "c", label: "Both, somehow, give us a decade", weights: { history: 1, ultras: 1, youth: 1 } },
    ],
  },
  {
    id: "q14",
    prompt: "Rivalry energy?",
    helper: "How much heat is too much?",
    choices: [
      { id: "a", label: "Lean all the way in, the calendar revolves around it", weights: { ultras: 3 } },
      { id: "b", label: "Loud on the day, civil after", weights: { ultras: 1, family: 2 } },
      { id: "c", label: "Above it. Football is enough", weights: { pragmatic: 2, family: 1 } },
    ],
  },
  {
    id: "q15",
    prompt: "Squad rotation philosophy?",
    choices: [
      { id: "a", label: "Best XI every week, ride or die", weights: { veteran: 2, pragmatic: 1 } },
      { id: "b", label: "Rotate hard, fresh legs win Aprils", weights: { pragmatic: 2, attacking: 1 } },
      { id: "c", label: "Throw the kids in, sink or swim", weights: { youth: 3 } },
    ],
  },
  {
    id: "q16",
    prompt: "Set-piece routine, what's yours?",
    choices: [
      { id: "a", label: "Whipped near post, target the centre-half", weights: { attacking: 2, veteran: 1 } },
      { id: "b", label: "Short corner, work the overload", weights: { pragmatic: 3 } },
      { id: "c", label: "Direct on goal, dare the keeper", weights: { attacking: 3 } },
      { id: "d", label: "Trick play, free-kick over the wall", weights: { youth: 1, attacking: 2 } },
    ],
  },
  {
    id: "q17",
    prompt: "Promotion and relegation drama, your stance?",
    choices: [
      { id: "a", label: "Bring the chaos, last-day survival is theatre", weights: { underdog: 3, ultras: 1 } },
      { id: "b", label: "Stable mid-table, a season without ulcers", weights: { pragmatic: 2, family: 1 } },
      { id: "c", label: "Title race or nothing, every match a final", weights: { history: 2, attacking: 1 } },
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
