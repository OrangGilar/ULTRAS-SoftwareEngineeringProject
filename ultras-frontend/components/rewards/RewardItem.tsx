"use client";

import { useState } from "react";
import type { Reward } from "@/app/types";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useLocalUser } from "@/hooks/useLocalUser";
import { cn } from "@/lib/utils";

export function RewardItem({ reward }: { reward: Reward }) {
  const { user, redeem } = useLocalUser();
  const [confirm, setConfirm] = useState(false);
  const [done, setDone] = useState(false);
  const owned = user.redeemedRewardIds.includes(reward.id);
  const insufficient = user.points < reward.cost;

  return (
    <>
      <article className="flex h-full flex-col gap-5 border border-[var(--color-line)] p-5 transition hover:border-[var(--color-text)]">
        <div className="flex items-start justify-between gap-3">
          <span className="text-4xl leading-none" aria-hidden>
            {reward.emoji}
          </span>
          <span className="font-mono-label text-[10px] text-[var(--color-text-faint)]">
            {reward.category}
          </span>
        </div>

        <div className="flex-1">
          <h3 className="font-display text-base font-bold leading-tight tracking-[-0.01em]">
            {reward.name}
          </h3>
          <p className="prose-line mt-1 text-xs leading-snug text-[var(--color-text-muted)]">
            {reward.description}
          </p>
        </div>

        <div className="flex items-baseline justify-between gap-2 border-t border-[var(--color-line)] pt-4">
          <div>
            <span className="font-display text-xl font-bold tabular-nums leading-none tracking-[-0.02em]">
              {reward.cost.toLocaleString()}
            </span>
            <span className="ml-1 font-mono-label text-[10px] text-[var(--color-text-faint)]">
              pts
            </span>
          </div>
          {owned ? (
            <span
              className={cn(
                "font-mono-label text-[10px] text-[var(--color-primary)]",
              )}
            >
              Owned
            </span>
          ) : (
            <Button
              size="sm"
              variant={insufficient ? "secondary" : "primary"}
              disabled={insufficient}
              onClick={() => setConfirm(true)}
            >
              {insufficient ? "Need more" : "Redeem"}
            </Button>
          )}
        </div>
      </article>

      <Modal
        open={confirm}
        onClose={() => setConfirm(false)}
        title={done ? "Redeemed." : `Redeem ${reward.name}?`}
        footer={
          done ? (
            <Button onClick={() => { setConfirm(false); setDone(false); }}>Done</Button>
          ) : (
            <>
              <Button variant="ghost" onClick={() => setConfirm(false)}>Cancel</Button>
              <Button
                variant="primary"
                onClick={() => {
                  if (redeem(reward.id, reward.cost)) setDone(true);
                }}
              >
                Confirm. {reward.cost.toLocaleString()} pts
              </Button>
            </>
          )
        }
      >
        {done ? (
          <p>Your reward is in your profile. Show this at any matchday Ultras booth.</p>
        ) : (
          <p>
            You have {user.points.toLocaleString()} pts. After this you'll have{" "}
            {(user.points - reward.cost).toLocaleString()} pts.
          </p>
        )}
      </Modal>
    </>
  );
}
