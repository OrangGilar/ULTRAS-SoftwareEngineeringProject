"use client";

import { rewards } from "@/lib/mock/rewards";
import { PageContainer, PageHeader, SectionHeading } from "@/components/layout/PageContainer";
import { RewardItem } from "@/components/rewards/RewardItem";
import { useLocalUser } from "@/hooks/useLocalUser";

export default function RewardsPage() {
  const { user } = useLocalUser();

  return (
    <PageContainer width="lg" className="space-y-12">
      <PageHeader
        eyebrow="Your balance"
        title={
          <span className="font-display tabular-nums">
            {user.points.toLocaleString()}
            <span className="ml-3 text-3xl font-bold text-[var(--color-text-faint)] md:text-4xl">
              pts
            </span>
          </span>
        }
        lede="Earn more by predicting matches, winning mini-games, and posting in community."
      />

      <section>
        <SectionHeading title="Redeem" hint="Limited stock. Check back weekly." />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {rewards.map((r) => (
            <RewardItem key={r.id} reward={r} />
          ))}
        </div>
      </section>

      {user.redeemedRewardIds.length > 0 && (
        <section>
          <SectionHeading title="Redeemed" />
          <ul className="divide-y divide-[var(--color-line)] border-y border-[var(--color-line)]">
            {user.redeemedRewardIds.map((id) => {
              const r = rewards.find((x) => x.id === id);
              if (!r) return null;
              return (
                <li
                  key={id}
                  className="flex items-center justify-between gap-4 py-4"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl leading-none" aria-hidden>
                      {r.emoji}
                    </span>
                    <div>
                      <p className="font-display text-base font-bold tracking-[-0.01em]">
                        {r.name}
                      </p>
                      <p className="font-mono-label text-[10px] text-[var(--color-text-faint)]">
                        Show at any Ultras booth
                      </p>
                    </div>
                  </div>
                  <span className="font-mono-label text-[10px] text-[var(--color-primary)]">
                    Owned
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </PageContainer>
  );
}
