import type { Reward } from "@/app/types";

export const rewards: Reward[] = [
  {
    id: "r_001",
    name: "Match-day scarf",
    description: "Limited edition supporter scarf in your club's colours.",
    cost: 1800,
    emoji: "🧣",
    category: "merch",
  },
  {
    id: "r_002",
    name: "Stadium tour entry",
    description: "Skip-the-line entry for one stadium tour.",
    cost: 3500,
    emoji: "🏟️",
    category: "experience",
  },
  {
    id: "r_003",
    name: "Animated profile flair",
    description: "A flame icon next to your name in community threads.",
    cost: 800,
    emoji: "🔥",
    category: "digital",
  },
  {
    id: "r_004",
    name: "Signed match photo",
    description: "Numbered print of a goal celebration this season.",
    cost: 2400,
    emoji: "🖼️",
    category: "merch",
  },
  {
    id: "r_005",
    name: "Pre-match warm-up access",
    description: "Pitchside warm-up viewing pass for one supporter.",
    cost: 6000,
    emoji: "🎟️",
    category: "experience",
  },
  {
    id: "r_006",
    name: "Custom prediction badge",
    description: "Pick a one-time custom badge that survives losing streaks.",
    cost: 1200,
    emoji: "🎖️",
    category: "digital",
  },
];

export function getReward(id: string): Reward | undefined {
  return rewards.find((r) => r.id === id);
}
