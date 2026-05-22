import type { Club, QuizQuestion, QuizWeights } from "@/app/types";
import { clubs } from "./clubs";

export const quizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    prompt: "What kind of football that you like?",
    helper: "Select the style that best describes your preference.",
    choices: [
      { id: "a", label: "Possession-based, control the tempo", weights: { pragmatic: 2, youth: 1 } },
      { id: "b", label: "Counter-attacking, haram ball", weights: { pragmatic: 3 } },
      { id: "c", label: "High pressing, playing all out", weights: { attacking: 3 } },
      { id: "d", label: "Direct / long ball, bypass the midfield, go forward fast", weights: { attacking: 2, veteran: 1 } },
    ],
  },
  {
    id: "q2",
    prompt: "Where are you come from?",
    helper: "Pick your province, then your city.",
    choices: [],
    provinces: [
      // ── Java ──────────────────────────────────────────────
      { id: "dki-jakarta", label: "DKI Jakarta", cities: [
        { id: "jakarta", label: "Jakarta", weights: { java: 3 } },
      ]},
      { id: "jawa-barat", label: "Jawa Barat", cities: [
        { id: "bandung",     label: "Bandung",     weights: { java: 3 } },
        { id: "bekasi",      label: "Bekasi",      weights: { java: 2 } },
        { id: "bogor",       label: "Bogor",       weights: { java: 2 } },
        { id: "cimahi",      label: "Cimahi",      weights: { java: 2 } },
        { id: "cirebon",     label: "Cirebon",     weights: { java: 2 } },
        { id: "depok",       label: "Depok",       weights: { java: 2 } },
        { id: "sukabumi",    label: "Sukabumi",    weights: { java: 2 } },
        { id: "tasikmalaya", label: "Tasikmalaya", weights: { java: 2 } },
        { id: "banjar",      label: "Banjar",      weights: { java: 1 } },
      ]},
      { id: "jawa-tengah", label: "Jawa Tengah", cities: [
        { id: "semarang",   label: "Semarang",   weights: { java: 3 } },
        { id: "solo",       label: "Solo",        weights: { java: 3 } },
        { id: "magelang",   label: "Magelang",   weights: { java: 2 } },
        { id: "pekalongan", label: "Pekalongan", weights: { java: 2 } },
        { id: "salatiga",   label: "Salatiga",   weights: { java: 2 } },
        { id: "tegal",      label: "Tegal",      weights: { java: 2 } },
      ]},
      { id: "di-yogyakarta", label: "DI Yogyakarta", cities: [
        { id: "yogyakarta", label: "Yogyakarta", weights: { java: 3 } },
      ]},
      { id: "jawa-timur", label: "Jawa Timur", cities: [
        { id: "surabaya",   label: "Surabaya",   weights: { java: 3, ultras: 1 } },
        { id: "malang",     label: "Malang",     weights: { java: 3, ultras: 1 } },
        { id: "blitar",     label: "Blitar",     weights: { java: 2 } },
        { id: "batu",       label: "Batu",       weights: { java: 2 } },
        { id: "kediri",     label: "Kediri",     weights: { java: 2 } },
        { id: "madiun",     label: "Madiun",     weights: { java: 2 } },
        { id: "mojokerto",  label: "Mojokerto",  weights: { java: 2 } },
        { id: "pasuruan",   label: "Pasuruan",   weights: { java: 2 } },
        { id: "probolinggo",label: "Probolinggo",weights: { java: 2 } },
      ]},
      { id: "banten", label: "Banten", cities: [
        { id: "serang",         label: "Serang",           weights: { java: 2 } },
        { id: "cilegon",        label: "Cilegon",          weights: { java: 2 } },
        { id: "tangerang",      label: "Tangerang",        weights: { java: 2 } },
        { id: "tangerang-sel",  label: "Tangerang Selatan",weights: { java: 2 } },
      ]},
      // ── Sumatra ───────────────────────────────────────────
      { id: "aceh", label: "Aceh", cities: [
        { id: "banda-aceh",    label: "Banda Aceh",    weights: { sumatra: 3 } },
        { id: "langsa",        label: "Langsa",        weights: { sumatra: 2 } },
        { id: "lhokseumawe",   label: "Lhokseumawe",   weights: { sumatra: 2 } },
        { id: "sabang",        label: "Sabang",        weights: { sumatra: 1 } },
        { id: "subulussalam",  label: "Subulussalam",  weights: { sumatra: 1 } },
      ]},
      { id: "sumatera-utara", label: "Sumatera Utara", cities: [
        { id: "medan",             label: "Medan",             weights: { sumatra: 3 } },
        { id: "binjai",            label: "Binjai",            weights: { sumatra: 2 } },
        { id: "gunungsitoli",      label: "Gunungsitoli",      weights: { sumatra: 1 } },
        { id: "padangsidempuan",   label: "Padangsidempuan",   weights: { sumatra: 2 } },
        { id: "pematangsiantar",   label: "Pematangsiantar",   weights: { sumatra: 2 } },
        { id: "sibolga",           label: "Sibolga",           weights: { sumatra: 1 } },
        { id: "tanjungbalai",      label: "Tanjungbalai",      weights: { sumatra: 2 } },
        { id: "tebing-tinggi",     label: "Tebing Tinggi",     weights: { sumatra: 2 } },
      ]},
      { id: "sumatera-barat", label: "Sumatera Barat", cities: [
        { id: "padang",        label: "Padang",        weights: { sumatra: 3 } },
        { id: "bukittinggi",   label: "Bukittinggi",   weights: { sumatra: 2 } },
        { id: "padangpanjang", label: "Padangpanjang", weights: { sumatra: 2 } },
        { id: "pariaman",      label: "Pariaman",      weights: { sumatra: 1 } },
        { id: "payakumbuh",    label: "Payakumbuh",    weights: { sumatra: 2 } },
        { id: "sawahlunto",    label: "Sawahlunto",    weights: { sumatra: 1 } },
        { id: "solok",         label: "Solok",         weights: { sumatra: 1 } },
      ]},
      { id: "riau", label: "Riau", cities: [
        { id: "pekanbaru", label: "Pekanbaru", weights: { sumatra: 3 } },
        { id: "dumai",     label: "Dumai",     weights: { sumatra: 2 } },
      ]},
      { id: "jambi", label: "Jambi", cities: [
        { id: "jambi",       label: "Jambi",       weights: { sumatra: 2 } },
        { id: "sungai-penuh",label: "Sungai Penuh",weights: { sumatra: 1 } },
      ]},
      { id: "sumatera-selatan", label: "Sumatera Selatan", cities: [
        { id: "palembang",   label: "Palembang",   weights: { sumatra: 3 } },
        { id: "lubuklinggau",label: "Lubuklinggau",weights: { sumatra: 2 } },
        { id: "pagar-alam",  label: "Pagar Alam",  weights: { sumatra: 1 } },
        { id: "prabumulih",  label: "Prabumulih",  weights: { sumatra: 2 } },
      ]},
      { id: "bengkulu", label: "Bengkulu", cities: [
        { id: "bengkulu", label: "Bengkulu", weights: { sumatra: 2 } },
      ]},
      { id: "lampung", label: "Lampung", cities: [
        { id: "bandar-lampung", label: "Bandar Lampung", weights: { sumatra: 3 } },
        { id: "metro",          label: "Metro",          weights: { sumatra: 1 } },
      ]},
      { id: "bangka-belitung", label: "Kep. Bangka Belitung", cities: [
        { id: "pangkalpinang", label: "Pangkalpinang", weights: { sumatra: 2 } },
      ]},
      { id: "kepri", label: "Kepulauan Riau", cities: [
        { id: "batam",         label: "Batam",         weights: { sumatra: 3 } },
        { id: "tanjungpinang", label: "Tanjungpinang", weights: { sumatra: 2 } },
      ]},
      // ── Kalimantan ────────────────────────────────────────
      { id: "kalimantan-barat", label: "Kalimantan Barat", cities: [
        { id: "pontianak",  label: "Pontianak",  weights: { kalimantan: 3 } },
        { id: "singkawang", label: "Singkawang", weights: { kalimantan: 2 } },
      ]},
      { id: "kalimantan-tengah", label: "Kalimantan Tengah", cities: [
        { id: "palangkaraya", label: "Palangkaraya", weights: { kalimantan: 3 } },
      ]},
      { id: "kalimantan-selatan", label: "Kalimantan Selatan", cities: [
        { id: "banjarmasin", label: "Banjarmasin", weights: { kalimantan: 3 } },
        { id: "banjarbaru",  label: "Banjarbaru",  weights: { kalimantan: 2 } },
      ]},
      { id: "kalimantan-timur", label: "Kalimantan Timur", cities: [
        { id: "balikpapan", label: "Balikpapan", weights: { kalimantan: 3 } },
        { id: "bontang",    label: "Bontang",    weights: { kalimantan: 2 } },
        { id: "samarinda",  label: "Samarinda",  weights: { kalimantan: 3 } },
      ]},
      { id: "kalimantan-utara", label: "Kalimantan Utara", cities: [
        { id: "tarakan", label: "Tarakan", weights: { kalimantan: 2 } },
      ]},
      // ── Sulawesi ──────────────────────────────────────────
      { id: "sulawesi-utara", label: "Sulawesi Utara", cities: [
        { id: "bitung",      label: "Bitung",      weights: { sulawesi: 2 } },
        { id: "kotamobagu",  label: "Kotamobagu",  weights: { sulawesi: 2 } },
        { id: "manado",      label: "Manado",      weights: { sulawesi: 3 } },
        { id: "tomohon",     label: "Tomohon",     weights: { sulawesi: 1 } },
      ]},
      { id: "sulawesi-tengah", label: "Sulawesi Tengah", cities: [
        { id: "palu", label: "Palu", weights: { sulawesi: 3 } },
      ]},
      { id: "sulawesi-selatan", label: "Sulawesi Selatan", cities: [
        { id: "makassar", label: "Makassar", weights: { sulawesi: 3 } },
        { id: "palopo",   label: "Palopo",   weights: { sulawesi: 2 } },
        { id: "parepare", label: "Parepare", weights: { sulawesi: 2 } },
      ]},
      { id: "sulawesi-tenggara", label: "Sulawesi Tenggara", cities: [
        { id: "bau-bau", label: "Bau-Bau", weights: { sulawesi: 2 } },
        { id: "kendari", label: "Kendari", weights: { sulawesi: 3 } },
      ]},
      { id: "gorontalo-prov", label: "Gorontalo", cities: [
        { id: "gorontalo", label: "Gorontalo", weights: { sulawesi: 3 } },
      ]},
      // ── Bali & Nusa Tenggara ──────────────────────────────
      { id: "bali", label: "Bali", cities: [
        { id: "denpasar", label: "Denpasar", weights: { bali: 3 } },
      ]},
      { id: "ntb", label: "Nusa Tenggara Barat", cities: [
        { id: "bima",    label: "Bima",    weights: { bali: 2 } },
        { id: "mataram", label: "Mataram", weights: { bali: 3 } },
      ]},
      { id: "ntt", label: "Nusa Tenggara Timur", cities: [
        { id: "kupang", label: "Kupang", weights: { bali: 2 } },
      ]},
      // ── Maluku ────────────────────────────────────────────
      { id: "maluku", label: "Maluku", cities: [
        { id: "ambon", label: "Ambon", weights: { underdog: 2 } },
        { id: "tual",  label: "Tual",  weights: { underdog: 1 } },
      ]},
      { id: "maluku-utara", label: "Maluku Utara", cities: [
        { id: "ternate", label: "Ternate",          weights: { underdog: 2 } },
        { id: "tidore",  label: "Tidore Kepulauan", weights: { underdog: 1 } },
      ]},
      // ── Papua ─────────────────────────────────────────────
      { id: "papua-barat", label: "Papua Barat", cities: [
        { id: "manokwari", label: "Manokwari", weights: { underdog: 2 } },
        { id: "sorong",    label: "Sorong",    weights: { underdog: 2 } },
      ]},
      { id: "papua", label: "Papua", cities: [
        { id: "jayapura", label: "Jayapura", weights: { underdog: 2 } },
      ]},
      // ── Catch-all ─────────────────────────────────────────
      { id: "__vibes__", label: "Nowhere specific", cities: [
        { id: "vibes", label: "I follow vibes", weights: { underdog: 1 } },
      ]},
    ],
  },
  {
    id: "q3",
    prompt: "Trophy Hunter vs The underdog?",
    choices: [
      { id: "a", label: "Teams with history", weights: { history: 3, veteran: 1 } },
      { id: "b", label: "The unestablished team", weights: { underdog: 3, youth: 1 } },
      { id: "c", label: "Mix. Decent history but currently rebuilding", weights: { history: 1, underdog: 1 } },
    ],
  },
  {
    id: "q4",
    prompt: "What kind of atmosphere do you prefer?",
    helper: "Choose the matchday experience that suits you.",
    choices: [
      { id: "a", label: "Loud and intense, banter everywhere", weights: { ultras: 3 } },
      { id: "b", label: "Loud, but chill", weights: { ultras: 1, family: 2 } },
      { id: "c", label: "Enjoy the game", weights: { family: 3 } },
    ],
  },
  {
    id: "q7",
    prompt: "What kind of stadium do you prefer?",
    choices: [
      { id: "a", label: "Packed and loud, full capacity", weights: { ultras: 3 } },
      { id: "b", label: "Classic old stadium with history", weights: { history: 3, veteran: 1 } },
      { id: "c", label: "Modern stadium, comfortable for everyone", weights: { family: 3 } },
      { id: "d", label: "Small regional stadium, strong local pride", weights: { underdog: 2, ultras: 1 } },
    ],
  },
  {
    id: "q8",
    prompt: "What kind of squad do you prefer?",
    choices: [
      { id: "a", label: "Trust the youngsters", weights: { youth: 3 } },
      { id: "b", label: "The more experience the better", weights: { veteran: 3 } },
      { id: "c", label: "Balance", weights: { youth: 1, veteran: 1 } },
    ],
  },
  {
    id: "q9",
    prompt: "What kind of manager do you prefer?",
    choices: [
      { id: "a", label: "Passionate and intense, leads from the front", weights: { ultras: 2, attacking: 1 } },
      { id: "b", label: "Calm and tactical, long-term thinker", weights: { pragmatic: 2, veteran: 1 } },
      { id: "c", label: "Youth developer, focuses on bringing up young players", weights: { youth: 3 } },
      { id: "d", label: "Club legend, knows the culture inside out", weights: { history: 2, veteran: 1 } },
    ],
  },
  {
    id: "q10",
    prompt: "Which era of Indonesian football interests you most?",
    choices: [
      { id: "a", label: "The 1990s Galatama era", weights: { history: 3, veteran: 1 } },
      { id: "b", label: "The 2000s, when Persija and Persib dominated", weights: { history: 2, ultras: 1 } },
      { id: "c", label: "The 2010s rebuilding period", weights: { underdog: 2, attacking: 1 } },
      { id: "d", label: "The current Liga 1", weights: { youth: 2, attacking: 1 } },
    ],
  },
  {
    id: "q12",
    prompt: "Pre-match meal of choice?",
    choices: [
      { id: "a", label: "Soto Betawi", weights: { java: 2 } },
      { id: "b", label: "Nasi Pecel", weights: { java: 2, ultras: 1 } },
      { id: "c", label: "Coto Makassar", weights: { sulawesi: 3 } },
      { id: "d", label: "Babi Guling", weights: { bali: 3 } },
      { id: "e", label: "Soto Padang", weights: { sumatra: 3 } },
      { id: "f", label: "Nasi Kuning Banjar", weights: { kalimantan: 3 } },
    ],
  },
  {
    id: "q13",
    prompt: "Win the league or be the people's club?",
    choices: [
      { id: "a", label: "Win trophies, that's what matters", weights: { history: 3, veteran: 1 } },
      { id: "b", label: "Be the club everyone loves, results aside", weights: { ultras: 3, family: 1 } },
      { id: "c", label: "Both", weights: { history: 1, ultras: 1, youth: 1 } },
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
    let choice = q?.choices.find((c) => c.id === a.choiceId);
    if (!choice && q?.provinces) {
      for (const p of q.provinces) {
        const city = p.cities.find((c) => c.id === a.choiceId);
        if (city) { choice = city; break; }
      }
    }
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
