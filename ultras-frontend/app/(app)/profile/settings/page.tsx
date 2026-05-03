"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocalUser, useResetUser } from "@/hooks/useLocalUser";
import { PageContainer } from "@/components/layout/PageContainer";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ChevronLeft } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const { user, update } = useLocalUser();
  const reset = useResetUser();
  const [name, setName] = useState(user.displayName);
  const [auto, setAuto] = useState(user.prefersAutoReveal);

  return (
    <PageContainer width="sm" className="space-y-5">
      <Link href="/profile">
        <Button variant="ghost" leftIcon={<ChevronLeft size={16} />}>Back</Button>
      </Link>

      <h1 className="font-display text-3xl">Settings</h1>

      <Card className="space-y-3 p-5">
        <Input
          label="Display name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="What should fellow ultras call you?"
        />
        <Button
          variant="primary"
          onClick={() => update({ displayName: name.trim() || "Supporter" })}
        >
          Save name
        </Button>
      </Card>

      <Card className="flex items-center justify-between p-5">
        <div>
          <p className="text-sm font-semibold">Auto-reveal results</p>
          <p className="text-xs text-[var(--color-text-muted)]">
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
          className={`relative h-6 w-11 rounded-full transition ${auto ? "bg-[var(--color-primary)]" : "bg-[var(--color-surface-3)]"}`}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${auto ? "left-[22px]" : "left-0.5"}`}
          />
        </button>
      </Card>

      <Card className="p-5">
        <p className="text-sm font-semibold">Switch club</p>
        <p className="mt-1 text-xs text-[var(--color-text-muted)]">
          You can re-run the recommendation quiz. There's a 30-day cooldown after switching — no swapping mid-season for trophies.
        </p>
        <div className="mt-3">
          <Link href="/onboarding/quiz">
            <Button variant="secondary">Re-run quiz</Button>
          </Link>
        </div>
      </Card>

      <Card className="p-5">
        <p className="text-sm font-semibold">Reset local data</p>
        <p className="mt-1 text-xs text-[var(--color-text-muted)]">
          Clears predictions, points, and adopted club from this device.
        </p>
        <div className="mt-3">
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
      </Card>
    </PageContainer>
  );
}
