"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocalUser, useResetUser } from "@/hooks/useLocalUser";
import { PageContainer, PageHeader } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { ChevronLeft } from "lucide-react";
import { clubs, getClub } from "@/lib/mock/clubs";

export default function SettingsPage() {
  const router = useRouter();
  const { user, update, adoptClub } = useLocalUser();
  const reset = useResetUser();
  const [name, setName] = useState(user.displayName);
  const [auto, setAuto] = useState(user.prefersAutoReveal);
  const [pickedClubId, setPickedClubId] = useState<string>(user.clubId ?? "");
  const [clubSaved, setClubSaved] = useState(false);
  const currentClub = getClub(user.clubId);

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

      <section className="space-y-4 border-b border-[var(--color-line)] pb-6">
        <p className="font-display text-base font-bold tracking-[-0.01em]">
          Switch club
        </p>
        <p className="prose-line text-xs text-[var(--color-text-muted)]">
          Re-run the recommendation quiz, or pick a club directly below. Switch as often as you like.
        </p>
        <div>
          <Link href="/onboarding/quiz">
            <Button variant="secondary">Re-run quiz</Button>
          </Link>
        </div>

        <div className="space-y-3 pt-2">
          <label
            htmlFor="club-picker"
            className="block font-mono-label text-[10px] text-[var(--color-text-faint)]"
          >
            Pick manually
            {currentClub && (
              <span className="ml-2 normal-case text-[var(--color-text-muted)]">
                / current: {currentClub.shortName}
              </span>
            )}
          </label>
          <select
            id="club-picker"
            value={pickedClubId}
            onChange={(e) => {
              setPickedClubId(e.target.value);
              setClubSaved(false);
            }}
            className="w-full border-0 border-b border-[var(--color-line-strong)] bg-transparent px-0 py-2 font-display text-base font-bold tracking-[-0.01em] focus:border-[var(--color-primary)] focus:outline-none"
          >
            <option value="" disabled style={{ color: "#000", background: "#fff" }}>
              Choose a club…
            </option>
            {clubs.map((c) => (
              <option key={c.id} value={c.id} style={{ color: "#000", background: "#fff" }}>
                {c.name}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              disabled={!pickedClubId || pickedClubId === user.clubId}
              onClick={() => {
                adoptClub(pickedClubId);
                setClubSaved(true);
              }}
            >
              Save club
            </Button>
            {clubSaved && (
              <span className="font-mono-label text-[10px] text-[var(--color-primary)]">
                Saved.
              </span>
            )}
          </div>
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
