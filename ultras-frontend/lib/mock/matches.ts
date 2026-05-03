import type { Match } from "@/app/types";

export const matches: Match[] = [
  {
    id: "m_001",
    homeId: "persija",
    awayId: "persib",
    kickoffISO: "2026-05-02T19:30:00+07:00",
    venue: "Stadion Utama GBK",
    matchday: 28,
    status: "upcoming",
  },
  {
    id: "m_002",
    homeId: "arema",
    awayId: "psssleman",
    kickoffISO: "2026-05-03T15:30:00+07:00",
    venue: "Stadion Kanjuruhan",
    matchday: 28,
    status: "upcoming",
  },
  {
    id: "m_003",
    homeId: "bali",
    awayId: "psm",
    kickoffISO: "2026-05-05T20:00:00+07:00",
    venue: "Kapten I Wayan Dipta",
    matchday: 28,
    status: "upcoming",
  },
  {
    id: "m_004",
    homeId: "psis",
    awayId: "psbs",
    kickoffISO: "2026-04-26T19:00:00+07:00",
    venue: "Stadion Jatidiri",
    matchday: 27,
    status: "finished",
    finalScore: { home: 2, away: 1 },
    events: [
      { minute: 14, type: "goal", side: "home", player: "Carlos Fortes" },
      { minute: 31, type: "yellow", side: "away", player: "Fatih Sasmaz" },
      { minute: 58, type: "goal", side: "away", player: "Yohanes Pahabol" },
      { minute: 76, type: "goal", side: "home", player: "Vitinho" },
      { minute: 82, type: "yellow", side: "home", player: "Adam Mitter" },
    ],
  },
  {
    id: "m_005",
    homeId: "persib",
    awayId: "arema",
    kickoffISO: "2026-04-25T20:30:00+07:00",
    venue: "Stadion Si Jalak Harupat",
    matchday: 27,
    status: "finished",
    finalScore: { home: 3, away: 0 },
    events: [
      { minute: 12, type: "goal", side: "home", player: "Ciro Alves" },
      { minute: 44, type: "goal", side: "home", player: "David da Silva" },
      { minute: 67, type: "yellow", side: "away", player: "Hanif Sjahbandi" },
      { minute: 89, type: "goal", side: "home", player: "Beckham Putra" },
    ],
  },
  {
    id: "m_006",
    homeId: "psm",
    awayId: "persija",
    kickoffISO: "2026-04-24T19:00:00+07:00",
    venue: "Stadion Batakan",
    matchday: 27,
    status: "finished",
    finalScore: { home: 1, away: 1 },
    events: [
      { minute: 22, type: "goal", side: "away", player: "Gustavo Almeida" },
      { minute: 53, type: "yellow", side: "home", player: "Yuran Fernandes" },
      { minute: 71, type: "goal", side: "home", player: "Yakob Sayuri" },
      { minute: 84, type: "yellow", side: "away", player: "Rio Fahmi" },
      { minute: 90, type: "yellow", side: "home", player: "Everton Nascimento" },
    ],
  },
];

export const matchesById: Record<string, Match> = Object.fromEntries(
  matches.map((m) => [m.id, m])
);

export function getMatch(id: string | undefined): Match | undefined {
  if (!id) return undefined;
  return matchesById[id];
}

export function upcomingMatches(): Match[] {
  return matches.filter((m) => m.status === "upcoming").sort((a, b) =>
    a.kickoffISO.localeCompare(b.kickoffISO)
  );
}

export function finishedMatches(): Match[] {
  return matches.filter((m) => m.status === "finished").sort((a, b) =>
    b.kickoffISO.localeCompare(a.kickoffISO)
  );
}
