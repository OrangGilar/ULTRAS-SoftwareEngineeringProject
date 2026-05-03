"use client";

import { rewards } from "@/lib/mock/rewards";
import { PageContainer, SectionHeading } from "@/components/layout/PageContainer";
import { RewardItem } from "@/components/rewards/RewardItem";
import { useLocalUser } from "@/hooks/useLocalUser";
import { Coins } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export default function RewardsPage() {
  const { user } = useLocalUser();

  return (
    <PageContainer width="lg" className="space-y-6">
      <div className="rounded-3xl border border-[var(--color-accent)]/30 bg-gradient-to-br from-[var(--color-accent)]/15 via-transparent to-[var(--color-primary)]/10 p-6">
        <p className="text-xs uppercase tracking-wider text-[var(--color-text-muted)]">Your balance</p>
        <div className="mt-1 flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-[var(--color-accent)]/20 text-[var(--color-accent)]">
            <Coins />
          </span>
          <p className="font-display text-5xl tabular-nums">{user.points.toLocaleString()}</p>
          <Badge variant="warning">pts</Badge>
        </div>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          Earn more by predicting matches, winning mini-games, and posting in community.
        </p>
      </div>

      <section>
        <SectionHeading title="Redeem" hint="Limited stock — check back weekly." />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {rewards.map((r) => (
            <RewardItem key={r.id} reward={r} />
          ))}
        </div>
      </section>

      {user.redeemedRewardIds.length > 0 && (
        <section>
          <SectionHeading title="Redeemed" />
          <ul className="space-y-2">
            {user.redeemedRewardIds.map((id) => {
              const r = rewards.find((x) => x.id === id);
              if (!r) return null;
              return (
                <li
                  key={id}
                  className="flex items-center justify-between rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--color-surface-2)] text-2xl">
                      {r.emoji}
                    </span>
                    <div>
                      <p className="text-sm font-semibold">{r.name}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">Show at any Ultras booth</p>
                    </div>
                  </div>
                  <Badge variant="success">Owned</Badge>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </PageContainer>
  );
}
