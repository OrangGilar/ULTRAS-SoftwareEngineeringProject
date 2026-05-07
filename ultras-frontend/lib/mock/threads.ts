import type { Thread } from "@/app/types";
import { getThread } from "@/lib/mock/threads";

export const threads: Thread[] = [
  {
    id: "t_001",
    clubId: "persija",
    title: "Three at the back vs Persib. Yes or no?",
    body: "We've been better with a back four since matchday 22. Why are we even discussing this?",
    authorName: "JakMania_88",
    authorClubId: "persija",
    upvotes: 142,
    replyCount: 38,
    createdAtISO: "2026-04-28T08:12:00+07:00",
  },
  {
    id: "t_002",
    clubId: undefined,
    title: "Liga 1 weekend tifo of the round?",
    body: "Drop your photos. The Aremania choreo last week was a 10/10.",
    authorName: "TerasUtara",
    authorClubId: "arema",
    upvotes: 89,
    replyCount: 21,
    createdAtISO: "2026-04-28T11:30:00+07:00",
  },
  {
    id: "t_003",
    clubId: "persib",
    title: "David da Silva contract. Extend or move on?",
    body: "Numbers say extend. Vibes say it's time to bring through the youth. Where do you stand?",
    authorName: "BobotohSelatan",
    authorClubId: "persib",
    upvotes: 64,
    replyCount: 47,
    createdAtISO: "2026-04-27T19:50:00+07:00",
  },
  {
    id: "t_004",
    clubId: undefined,
    title: "Predict-king of the season so far?",
    body: "Anyone else hit a triple-confidence exact this week? Show your screenshots.",
    authorName: "TerracesAdmin",
    upvotes: 201,
    replyCount: 12,
    createdAtISO: "2026-04-28T06:00:00+07:00",
  },
  {
    id: "t_005",
    clubId: "bali",
    title: "Can Bali still chase a top-four spot?",
    body: "Two wins from the next three and we're right there. The fixture list is friendly.",
    authorName: "TridatuLoyal",
    authorClubId: "bali",
    upvotes: 33,
    replyCount: 9,
    createdAtISO: "2026-04-26T15:40:00+07:00",
  },
];

export function threadsForClub(clubId?: string): Thread[] {
  if (!clubId) return threads;
  return threads.filter((t) => !t.clubId || t.clubId === clubId);
}

export function getThread(id: string): Thread | undefined {
  return threads.find((t) => t.id === id);
}
