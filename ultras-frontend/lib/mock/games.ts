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
    prompt: "Which club is based in Gianyar, Bali?",
    choices: ["PSBS Biak", "Bali United", "PSIS Semarang", "Persija"],
    answerIndex: 1,
  },
  {
    prompt: "Which club's supporters are known as 'Bobotoh'?",
    choices: ["Persija", "Persib", "PSM", "Arema"],
    answerIndex: 1,
  },
  {
    prompt: "Persija Jakarta play their home matches at which stadium?",
    choices: ["Stadion Gelora Bung Karno", "Stadion Si Jalak Harupat", "Stadion Kanjuruhan", "Stadion Kapten I Wayan Dipta"],
    answerIndex: 0,
  },
  {
    prompt: "Which Liga 1 club goes by the nickname 'Bajul Ijo'?",
    choices: ["Arema FC", "Persebaya Surabaya", "PSS Sleman", "Bali United"],
    answerIndex: 1,
  },
  {
    prompt: "In which year was Persib Bandung founded?",
    choices: ["1928", "1933", "1927", "1915"],
    answerIndex: 1,
  },
  {
    prompt: "Which club's ultras group is called 'Jakmania'?",
    choices: ["Persija Jakarta", "Arema FC", "Persebaya Surabaya", "PSM Makassar"],
    answerIndex: 0,
  },
  {
    prompt: "PSS Sleman's nickname is?",
    choices: ["Laskar Mataram", "Super Elja", "Singo Edan", "Macan Kemayoran"],
    answerIndex: 1,
  },
  {
    prompt: "Which club was founded first?",
    choices: ["Persib Bandung", "Persija Jakarta", "PSM Makassar", "Persebaya Surabaya"],
    answerIndex: 2,
  },
  {
    prompt: "Arema FC is based in which city?",
    choices: ["Surabaya", "Bandung", "Malang", "Semarang"],
    answerIndex: 2,
  },
  {
    prompt: "Which Liga 1 club is nicknamed 'Singo Edan' (Crazy Lion)?",
    choices: ["PSM Makassar", "Bali United", "Arema FC", "Borneo FC"],
    answerIndex: 2,
  },
  {
    prompt: "Borneo FC represents which city?",
    choices: ["Pontianak", "Balikpapan", "Banjarmasin", "Samarinda"],
    answerIndex: 3,
  },
  {
    prompt: "Which club's motto is 'Laskar Sambernyawa'?",
    choices: ["Persis Solo", "PSIM Yogyakarta", "Persik Kediri", "Madura United"],
    answerIndex: 0,
  },
  {
    prompt: "PSIS Semarang's nickname is?",
    choices: ["Laskar Cisadane", "Mahesa Jenar", "Kabau Sirah", "Badai Pasifik"],
    answerIndex: 1,
  },
  {
    prompt: "Which club is nicknamed 'Kabau Sirah'?",
    choices: ["Malut United", "PSBS Biak", "Semen Padang", "Bhayangkara Presisi"],
    answerIndex: 2,
  },
  {
    prompt: "Madura United is based in which city?",
    choices: ["Surabaya", "Gresik", "Pamekasan", "Bangkalan"],
    answerIndex: 2,
  },
  {
    prompt: "Which Liga 1 club has 'Pesut Etam' as its motto?",
    choices: ["Malut United", "Borneo FC", "PSBS Biak", "Dewa United"],
    answerIndex: 1,
  },
  {
    prompt: "PSBS Biak represents which Indonesian province?",
    choices: ["Maluku", "Kalimantan Timur", "Papua", "Sulawesi Utara"],
    answerIndex: 2,
  },
];

export const crestQuestions: { clubId: string; choices: string[]; answerIndex: number }[] = [
  { clubId: "persija",    choices: ["Persib Bandung", "Persija Jakarta", "PSM Makassar", "Arema FC"],       answerIndex: 1 },
  { clubId: "persib",     choices: ["Persebaya Surabaya", "Persib Bandung", "PSIS Semarang", "Persija"],    answerIndex: 1 },
  { clubId: "arema",      choices: ["Bali United", "PSS Sleman", "Arema FC", "Persija"],                    answerIndex: 2 },
  { clubId: "psm",        choices: ["PSM Makassar", "PSBS Biak", "Persib", "PSIS Semarang"],                answerIndex: 0 },
  { clubId: "bali",       choices: ["Bali United", "Persib", "PSS Sleman", "Arema FC"],                     answerIndex: 0 },
  { clubId: "persebaya",  choices: ["Arema FC", "Persija", "Madura United", "Persebaya Surabaya"],          answerIndex: 3 },
  { clubId: "borneo",     choices: ["Borneo FC", "Malut United", "Dewa United", "Bhayangkara Presisi"],     answerIndex: 0 },
  { clubId: "persis",     choices: ["Persik Kediri", "Persis Solo", "PSIM Yogyakarta", "Persita"],          answerIndex: 1 },
  { clubId: "psssleman",  choices: ["PSS Sleman", "PSIS Semarang", "PSIM Yogyakarta", "Persijap"],         answerIndex: 0 },
  { clubId: "madura",     choices: ["Persita Tangerang", "Madura United", "Dewa United", "Borneo FC"],      answerIndex: 1 },
  { clubId: "semenpadang",choices: ["Malut United", "PSBS Biak", "Semen Padang", "PSM Makassar"],          answerIndex: 2 },
  { clubId: "psbs",       choices: ["Borneo FC", "Malut United", "Bhayangkara Presisi", "PSBS Biak"],      answerIndex: 3 },
];
