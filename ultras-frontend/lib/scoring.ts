import type { Match, PointsLine, Prediction } from "@/app/types";

const POINTS = {
  exact: 50,
  outcome: 20,
  oneSideCorrect: 8,
  scorer: 15,
  cardsBucket: 10,
};

export function outcomeOf(home: number, away: number): "home" | "away" | "draw" {
  if (home > away) return "home";
  if (away > home) return "away";
  return "draw";
}

export function scorePrediction(
  prediction: Prediction | undefined,
  match: Match
): { lines: PointsLine[]; total: number } {
  if (!match.finalScore || !prediction) {
    return { lines: [], total: 0 };
  }
  const lines: PointsLine[] = [];
  const exactHit =
    prediction.score.home === match.finalScore.home &&
    prediction.score.away === match.finalScore.away;
  const outcomeHit =
    outcomeOf(prediction.score.home, prediction.score.away) ===
    outcomeOf(match.finalScore.home, match.finalScore.away);
  const homeScoreHit = prediction.score.home === match.finalScore.home;
  const awayScoreHit = prediction.score.away === match.finalScore.away;

  if (exactHit) {
    lines.push({ label: "Exact scoreline", points: POINTS.exact, hit: true });
  } else if (outcomeHit) {
    lines.push({ label: "Correct outcome", points: POINTS.outcome, hit: true });
    if (homeScoreHit) {
      lines.push({ label: `Home goals (${match.finalScore.home})`, points: POINTS.oneSideCorrect, hit: true });
    }
    if (awayScoreHit) {
      lines.push({ label: `Away goals (${match.finalScore.away})`, points: POINTS.oneSideCorrect, hit: true });
    }
  } else {
    lines.push({ label: "Outcome", points: POINTS.outcome, hit: false });
    if (homeScoreHit) {
      lines.push({ label: `Home goals (${match.finalScore.home})`, points: POINTS.oneSideCorrect, hit: true });
    }
    if (awayScoreHit) {
      lines.push({ label: `Away goals (${match.finalScore.away})`, points: POINTS.oneSideCorrect, hit: true });
    }
  }

  if (prediction.firstScorerId) {
    const firstGoal = match.events?.find((e) => e.type === "goal");
    const scorerHit = firstGoal?.player === prediction.firstScorerId;
    lines.push({
      label: `First scorer${scorerHit ? "" : " (missed)"}`,
      points: scorerHit ? POINTS.scorer : 0,
      hit: !!scorerHit,
    });
  }

  if (prediction.totalCards) {
    const cards =
      match.events?.filter((e) => e.type === "yellow" || e.type === "red").length ?? 0;
    const actualBucket = cards >= 4 ? "over" : "under";
    const cardsHit = prediction.totalCards === actualBucket;
    lines.push({
      label: `Cards ${prediction.totalCards} 3.5${cardsHit ? "" : " (missed)"}`,
      points: cardsHit ? POINTS.cardsBucket : 0,
      hit: cardsHit,
    });
  }

  const subtotal = lines.reduce((acc, l) => acc + (l.hit ? l.points : 0), 0);
  const multiplied = Math.round(subtotal * prediction.confidence);
  if (prediction.confidence > 1 && subtotal > 0) {
    lines.push({
      label: `Confidence ×${prediction.confidence}`,
      points: multiplied - subtotal,
      hit: true,
    });
  }
  return { lines, total: multiplied };
}
