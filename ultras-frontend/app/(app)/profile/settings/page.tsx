"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocalUser, useResetUser } from "@/hooks/useLocalUser";
import { PageContainer, PageHeader } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { ChevronLeft } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const { user, update } = useLocalUser();
  const reset = useResetUser();
  const [name, setName] = useState(user.displayName);
  const [auto, setAuto] = useState(user.prefersAutoReveal);

  return (
    <PageContainer width="sm" className="space-y-10">
      <Link
        href="/profile"
        className="inline-flex items-center gap-1 font-mono-label text-[10px] text-[var(--color-text-muted)] transition hover:text-[var(--color-primary)]"
      >
        <ChevronLeft size={14} />
        Back
      </Link>

      <PageHeader title={<>Settings.</>} />

      <section className="space-y-3 border-t border-[var(--color-line)] pt-6">
        <label className="font-mono-label text-[10px] text-[var(--color-text-faint)]">
          Display name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="What should fellow ultras call you?"
          className="w-full border-0 border-b border-[var(--color-line-strong)] bg-transparent px-0 py-2 font-display text-xl font-bold tracking-[-0.01em] placeholder:text-[var(--color-text-faint)] placeholder:font-normal focus:border-[var(--color-primary)] focus:outline-none"
        />
        <div>
          <Button
            variant="primary"
            onClick={() => update({ displayName: name.trim() || "Supporter" })}
          >
            Save name
          </Button>
        </div>
      </section>

      <section className="flex items-center justify-between gap-4 border-y border-[var(--color-line)] py-6">
        <div className="min-w-0">
          <p className="font-display text-base font-bold tracking-[-0.01em]">
            Auto-reveal results
          </p>
          <p className="prose-line mt-1 text-xs text-[var(--color-text-muted)]">
            Skip the tap-to-reveal step on result pages.
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={auto}
          onClick={() => {
            const next = !auto;
            setAuto(next);
            update({ prefersAutoReveal: next });
          }}
          className={`relative h-7 w-12 rounded-full transition ${
            auto ? "bg-[var(--color-primary)]" : "bg-[var(--color-line)]"
          }`}
        >
          <span
            className={`absolute top-0.5 h-6 w-6 rounded-full bg-[var(--color-pure-white)] transition ${
              auto ? "left-[22px]" : "left-0.5"
            }`}
          />
        </button>
      </section>

      <section className="space-y-3 border-b border-[var(--color-line)] pb-6">
        <p className="font-display text-base font-bold tracking-[-0.01em]">
          Switch club
        </p>
        <p className="prose-line text-xs text-[var(--color-text-muted)]">
          You can re-run the recommendation quiz. There's a 30-day cooldown after switching.
          No swapping mid-season for trophies.
        </p>
        <div>
          <Link href="/onboarding/quiz">
            <Button variant="secondary">Re-run quiz</Button>
          </Link>
        </div>
      </section>

      <section className="space-y-3 border-b border-[var(--color-line)] pb-6">
        <p className="font-display text-base font-bold tracking-[-0.01em]">
          Reset local data
        </p>
        <p className="prose-line text-xs text-[var(--color-text-muted)]">
          Clears predictions, points, and adopted club from this device.
        </p>
        <div>
          <Button
            variant="danger"
            onClick={() => {
              reset();
              router.push("/");
            }}
          >
            Reset everything
          </Button>
        </div>
      </section>
    </PageContainer>
  );
}
