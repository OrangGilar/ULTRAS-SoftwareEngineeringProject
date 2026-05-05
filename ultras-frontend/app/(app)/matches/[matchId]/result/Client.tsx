"use client";

import { useMemo, useRef } from "react";
import type { Club, Match } from "@/app/types";
import { ResultReveal } from "@/components/match/ResultReveal";
import { MatchHeader } from "@/components/match/MatchHeader";
import { scorePrediction } from "@/lib/scoring";
import { useLocalUser } from "@/hooks/useLocalUser";

export function MatchResultClient({
  match,
  home,
  away,
}: {
  match: Match;
  home: Club;
  away: Club;
}) {
  const { user, addPoints } = useLocalUser();
  const prediction = user.predictions[match.id];
  const awarded = useMemo(() => scorePrediction(prediction, match), [prediction, match]);
  const grantedRef = useRef(false);

  if (!match.finalScore) return null;

  const sessionGrantKey = `ultras:granted:${match.id}`;
  const handleSettled = () => {
    if (grantedRef.current) return;
    grantedRef.current = true;
    if (typeof window !== "undefined" && window.sessionStorage.getItem(sessionGrantKey)) {
      return;
    }
    if (awarded.total > 0) {
      addPoints(awarded.total);
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(sessionGrantKey, "1");
      }
    }
  };

  return (
    <>
      <MatchHeader match={match} hideScore />
      <ResultReveal
        matchId={match.id}
        home={home}
        away={away}
        finalScore={match.finalScore}
        prediction={prediction}
        pointsAwarded={awarded.total}
        breakdown={awarded.lines}
        autoReveal={user.prefersAutoReveal}
        onSettled={handleSettled}
      />
    </>
  );
}
