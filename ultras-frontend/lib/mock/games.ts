import type { Game } from "@/app/types";

export const games: Game[] = [
  {
    slug: "guess-the-crest",
    name: "Guess the Crest",
    emoji: "",
    description: "A blurred Liga 1 crest. You have 10 seconds.",
    rewardPerWin: 25,
  },
  {
    slug: "liga-1-trivia",
    name: "Liga 1 Trivia",
    emoji: "",
    description: "Five questions on Indonesian football history.",
    rewardPerWin: 40,
  },
  {
    slug: "squad-memory",
    name: "Squad Memory",
    emoji: "",
    description: "Match the players to their clubs before the timer hits zero.",
    rewardPerWin: 30,
  },
];

export function getGame(slug: string): Game | undefined {
  return games.find((g) => g.slug === slug);
}

export const triviaQuestions: { prompt: string; choices: string[]; answerIndex: number }[] = [
  {
    prompt: "Which Liga 1 club is nicknamed 'Maung Bandung'?",
    choices: ["Persib Bandung", "PSIS Semarang", "Arema FC", "PSM Makassar"],
    answerIndex: 0,
  },
  {
    prompt: "PSM Makassar's traditional home colour?",
    choices: ["Blue", "Red", "Green", "White"],
    answerIndex: 1,
  },
  {
    prompt: "Stadion Kanjuruhan is the home of which side?",
    choices: ["Persija", "Bali United", "Arema FC", "PSS Sleman"],
    answerIndex: 2,
  },
  {
    prompt: "Which club is based in Gianyar?",
    choices: ["PSBS Biak", "Bali United", "PSIS Semarang", "Persija"],
    answerIndex: 1,
  },
  {
    prompt: "Which club's supporters are known as 'Bobotoh'?",
    choices: ["Persija", "Persib", "PSM", "Arema"],
    answerIndex: 1,
  },
];

export const crestQuestions: { clubId: string; choices: string[]; answerIndex: number }[] = [
  { clubId: "persija", choices: ["Persib Bandung", "Persija Jakarta", "PSM Makassar", "Arema FC"], answerIndex: 1 },
  { clubId: "arema", choices: ["Bali United", "PSS Sleman", "Arema FC", "Persija"], answerIndex: 2 },
  { clubId: "psm", choices: ["PSM Makassar", "PSBS Biak", "Persib", "PSIS Semarang"], answerIndex: 0 },
  { clubId: "bali", choices: ["Bali United", "Persib", "PSS Sleman", "Arema FC"], answerIndex: 0 },
];
