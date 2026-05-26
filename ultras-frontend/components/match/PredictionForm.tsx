"use client";

import { useMemo, useState } from "react";
import type { Confidence, Match } from "@/app/types";
import { useClubs } from "@/components/providers/ClubsProvider";
import { ScorePicker } from "./ScorePicker";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useLocalUser } from "@/hooks/useLocalUser";
import { cn } from "@/lib/utils";

export type PredictionFormProps = {
  match: Match;
  onSaved?: () => void;
};

export function PredictionForm({ match, onSaved }: PredictionFormProps) {
  const { getClub } = useClubs();
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
    <div className="space-y-10">
      <ScorePicker
        value={score}
        onChange={setScore}
        homeLabel={home.shortName}
        awayLabel={away.shortName}
      />

      <section className="space-y-3">
        <p className="font-mono-label text-[10px] text-[var(--color-text-muted)]">
          First scorer (bonus)
        </p>
        <select
          value={scorer}
          onChange={(e) => setScorer(e.target.value)}
          className="h-11 w-full border-0 border-b border-[var(--color-line-strong)] bg-transparent px-0 text-base text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
        >
          <option value="">Skip. No pick.</option>
          {scorerOptions.map((s) => (
            <option key={s.id} value={s.id}>
              {s.id} ({s.side === "home" ? home.shortName : away.shortName})
            </option>
          ))}
        </select>
      </section>

      <section className="space-y-3">
        <p className="font-mono-label text-[10px] text-[var(--color-text-muted)]">
          Total cards (bonus)
        </p>
        <div className="flex gap-3">
          {(["under", "over"] as const).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCards((prev) => (prev === c ? "" : c))}
              className={cn(
                "flex-1 border px-4 py-4 font-mono-label text-xs transition",
                cards === c
                  ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-pure-white)]"
                  : "border-[var(--color-line)] text-[var(--color-text-muted)] hover:border-[var(--color-text)] hover:text-[var(--color-text)]",
              )}
            >
              {c === "under" ? "Under 3.5" : "Over 3.5"}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-baseline justify-between">
          <p className="font-mono-label text-[10px] text-[var(--color-text-muted)]">
            Confidence multiplier
          </p>
          <p className="font-display text-2xl font-bold tabular-nums leading-none text-[var(--color-primary)]">
            ×{confidence}
          </p>
        </div>
        <div className="flex gap-3">
          {([1, 2, 3] as Confidence[]).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setConfidence(c)}
              className={cn(
                "flex-1 border py-5 font-display text-2xl font-bold tracking-[-0.02em] transition",
                confidence === c
                  ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                  : "border-[var(--color-line)] text-[var(--color-text-faint)] hover:border-[var(--color-text)] hover:text-[var(--color-text)]",
              )}
            >
              ×{c}
            </button>
          ))}
        </div>
        <p className="prose-line text-xs text-[var(--color-text-faint)]">
          Higher multipliers reward bold calls. Pay zero if you miss.
        </p>
      </section>

      {saved ? (
        <div className="border-t-2 border-[var(--color-success)] pt-4 text-sm text-[var(--color-success)]">
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
          {home.shortName}{" "}
          <span className="font-display text-base font-bold tabular-nums text-[var(--color-text)]">
            {score.home}.{score.away}
          </span>{" "}
          {away.shortName}, ×{confidence}.
        </p>
        <p>You can edit this until kickoff. Higher multipliers mean zero points if you miss.</p>
      </Modal>
    </div>
  );
}
