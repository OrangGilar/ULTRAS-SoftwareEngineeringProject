"use client";

import { useMemo, useState } from "react";
import type { Confidence, Match } from "@/app/types";
import { getClub } from "@/lib/mock/clubs";
import { ScorePicker } from "./ScorePicker";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { useLocalUser } from "@/hooks/useLocalUser";
import { cn } from "@/lib/utils";

export type PredictionFormProps = {
  match: Match;
  onSaved?: () => void;
};

export function PredictionForm({ match, onSaved }: PredictionFormProps) {
  const home = getClub(match.homeId);
  const away = getClub(match.awayId);
  const { user, savePrediction } = useLocalUser();
  const existing = user.predictions[match.id];

  const [score, setScore] = useState<{ home: number; away: number }>(
    existing?.score ?? { home: 1, away: 1 }
  );
  const [confidence, setConfidence] = useState<Confidence>(existing?.confidence ?? 1);
  const [scorer, setScorer] = useState<string>(existing?.firstScorerId ?? "");
  const [cards, setCards] = useState<"under" | "over" | "">(
    existing?.totalCards ?? ""
  );
  const [confirm, setConfirm] = useState(false);
  const [saved, setSaved] = useState(false);

  const scorerOptions = useMemo(
    () => [
      { id: "Vitinho", side: "home" as const },
      { id: "David da Silva", side: "home" as const },
      { id: "Beckham Putra", side: "home" as const },
      { id: "Carlos Fortes", side: "away" as const },
      { id: "Gustavo Almeida", side: "away" as const },
      { id: "Yakob Sayuri", side: "away" as const },
    ],
    []
  );

  const submit = () => {
    savePrediction({
      matchId: match.id,
      score,
      firstScorerId: scorer || undefined,
      totalCards: cards || undefined,
      confidence,
      submittedAt: new Date().toISOString(),
    });
    setSaved(true);
    setConfirm(false);
    onSaved?.();
  };

  if (!home || !away) return null;

  return (
    <div className="space-y-4">
      <ScorePicker
        value={score}
        onChange={setScore}
        homeLabel={home.shortName}
        awayLabel={away.shortName}
      />

      <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-4">
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
          Bonus — first scorer
        </p>
        <select
          value={scorer}
          onChange={(e) => setScorer(e.target.value)}
          className="h-11 w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-surface-2)] px-3 text-sm"
        >
          <option value="">Skip — no pick</option>
          {scorerOptions.map((s) => (
            <option key={s.id} value={s.id}>
              {s.id} ({s.side === "home" ? home.shortName : away.shortName})
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-4">
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
          Bonus — total cards
        </p>
        <div className="flex gap-2">
          {(["under", "over"] as const).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCards((prev) => (prev === c ? "" : c))}
              className={cn(
                "flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition",
                cards === c
                  ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-text)]"
                  : "border-[var(--color-line)] bg-[var(--color-surface-2)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              )}
            >
              {c === "under" ? "Under 3.5" : "Over 3.5"}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
            Confidence
          </p>
          <Badge variant="warning">×{confidence} multiplier</Badge>
        </div>
        <div className="flex gap-2">
          {([1, 2, 3] as Confidence[]).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setConfidence(c)}
              className={cn(
                "flex-1 rounded-xl border px-4 py-3 text-sm font-semibold transition",
                confidence === c
                  ? "border-[var(--color-accent)] bg-[var(--color-accent)]/15 text-[var(--color-accent)]"
                  : "border-[var(--color-line)] bg-[var(--color-surface-2)] text-[var(--color-text-muted)]"
              )}
            >
              ×{c}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-[var(--color-text-faint)]">
          Higher multipliers reward bold calls — but pay zero if you miss.
        </p>
      </div>

      {saved ? (
        <div className="rounded-2xl border border-[var(--color-success)]/40 bg-[var(--color-success)]/10 p-4 text-center text-sm text-[var(--color-success)]">
          Prediction locked. Edit anytime until kickoff.
        </div>
      ) : (
        <Button fullWidth size="lg" variant="primary" onClick={() => setConfirm(true)}>
          Lock prediction
        </Button>
      )}

      <Modal
        open={confirm}
        onClose={() => setConfirm(false)}
        title="Lock this in?"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirm(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={submit}>
              Lock prediction
            </Button>
          </>
        }
      >
        <p className="mb-2">
          {home.shortName} <span className="font-display text-base tabular-nums text-[var(--color-text)]">{score.home}–{score.away}</span> {away.shortName}, ×{confidence}.
        </p>
        <p>You can edit this until kickoff. Higher multipliers mean zero points if you miss.</p>
      </Modal>
    </div>
  );
}
