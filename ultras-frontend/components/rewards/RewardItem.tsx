"use client";

import { useState } from "react";
import type { Reward } from "@/app/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useLocalUser } from "@/hooks/useLocalUser";

export function RewardItem({ reward }: { reward: Reward }) {
  const { user, redeem } = useLocalUser();
  const [confirm, setConfirm] = useState(false);
  const [done, setDone] = useState(false);
  const owned = user.redeemedRewardIds.includes(reward.id);
  const insufficient = user.points < reward.cost;

  return (
    <>
      <Card variant="interactive" className="flex h-full flex-col gap-3 p-4">
        <div className="flex items-center justify-between">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--color-surface-2)] text-2xl">
            {reward.emoji}
          </span>
          <Badge variant={reward.category === "experience" ? "warning" : reward.category === "digital" ? "club" : "neutral"}>
            {reward.category}
          </Badge>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold">{reward.name}</h3>
          <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">{reward.description}</p>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="font-display text-base tabular-nums text-[var(--color-accent)]">
            {reward.cost.toLocaleString()} pts
          </span>
          {owned ? (
            <Badge variant="success">Owned</Badge>
          ) : (
            <Button
              size="sm"
              variant={insufficient ? "secondary" : "primary"}
              disabled={insufficient}
              onClick={() => setConfirm(true)}
            >
              {insufficient ? "Need more pts" : "Redeem"}
            </Button>
          )}
        </div>
      </Card>

      <Modal
        open={confirm}
        onClose={() => setConfirm(false)}
        title={done ? "Redeemed!" : `Redeem ${reward.name}?`}
        footer={
          done ? (
            <Button onClick={() => { setConfirm(false); setDone(false); }}>Done</Button>
          ) : (
            <>
              <Button variant="ghost" onClick={() => setConfirm(false)}>Cancel</Button>
              <Button
                variant="accent"
                onClick={() => {
                  if (redeem(reward.id, reward.cost)) setDone(true);
                }}
              >
                Confirm — {reward.cost.toLocaleString()} pts
              </Button>
            </>
          )
        }
      >
        {done ? (
          <p>Your reward is in your profile. Show this at any matchday Ultras booth.</p>
        ) : (
          <p>You have {user.points.toLocaleString()} pts. After this you'll have {(user.points - reward.cost).toLocaleString()} pts.</p>
        )}
      </Modal>
    </>
  );
}
