import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { clubs } from "@/lib/mock/clubs";

const RITUALS = [
  {
    no: "01",
    title: "Predict",
    body: "Lock scorelines. Name first scorers. Ride the multiplier on takes you actually believe.",
  },
  {
    no: "02",
    title: "Debate",
    body: "Threads with the rest of the terrace. Sharp opinions, civil voices, no warm bath.",
  },
  {
    no: "03",
    title: "Earn",
    body: "Points compound into limited scarves, stadium tours, and pitch-side passes.",
  },
];

export default function LandingPage() {
  return (
    <div className="bg-[var(--color-bg)] text-[var(--color-text)]">
      <section className="mx-auto flex w-full max-w-screen-xl flex-col px-6 pb-24 pt-16 md:pt-24">
        <div className="font-mono-label text-xs text-[var(--color-text-muted)]">
          Liga 1 / Indonesia
        </div>

        <h1 className="font-display mt-10 text-[clamp(64px,13vw,200px)] font-bold leading-[0.92] tracking-[-0.04em]">
          For the
          <br />
          <span className="text-[var(--color-primary)]">terraces</span>.
        </h1>

        <p className="prose-line mt-12 text-[clamp(18px,2.2vw,28px)] leading-snug text-[var(--color-text-muted)]">
          Predict every Liga 1 match. Earn points off your hottest takes.
          Find your club. Stay loud.
        </p>

        <div className="mt-12 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <Link href="/register">
            <Button size="lg" variant="primary">
              Find my club
            </Button>
          </Link>
          <Link
            href="/login"
            className="font-mono-label text-xs text-[var(--color-text-muted)] underline-offset-8 hover:text-[var(--color-text)] hover:underline"
          >
            I'm already a supporter →
          </Link>
        </div>
      </section>

      <section className="border-y border-[var(--color-line)] bg-[var(--color-bg)]">
        <div className="mx-auto w-full max-w-screen-xl px-6 py-6">
          <div className="font-mono-label text-[10px] text-[var(--color-text-faint)]">
            18 clubs. One league. Pick your colours.
          </div>
          <div className="mt-4 grid grid-cols-6 gap-x-6 gap-y-6 sm:grid-cols-9 md:grid-cols-12 lg:grid-cols-18">
            {clubs.map((c) => (
              <div
                key={c.id}
                title={c.name}
                aria-label={c.name}
                className="grid aspect-square place-items-center"
              >
                {c.logo ? (
                  <img
                    src={c.logo}
                    alt={c.name}
                    className="h-full w-full object-contain opacity-90 transition hover:opacity-100"
                  />
                ) : (
                  <span className="text-2xl">{c.crestEmoji}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-screen-xl px-6 py-24 md:py-32">
        <div className="font-mono-label text-xs text-[var(--color-text-muted)]">
          The rituals
        </div>

        <ol className="mt-10 divide-y divide-[var(--color-line)]">
          {RITUALS.map((r, i) => (
            <li
              key={r.no}
              className={
                i % 2 === 0
                  ? "grid grid-cols-1 gap-6 py-10 md:grid-cols-12 md:py-16"
                  : "grid grid-cols-1 gap-6 py-10 md:grid-cols-12 md:py-16 md:[&>*:first-child]:col-start-2"
              }
            >
              <div className="font-mono-label text-sm text-[var(--color-text-faint)] md:col-span-2">
                {r.no}
              </div>
              <h3 className="font-display text-5xl font-bold leading-none tracking-tight md:col-span-4 md:text-7xl">
                {r.title}.
              </h3>
              <p className="prose-line text-lg leading-snug text-[var(--color-text-muted)] md:col-span-5 md:text-xl">
                {r.body}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-[var(--color-primary)] text-[var(--color-pure-white)]">
        <div className="mx-auto flex w-full max-w-screen-xl flex-col gap-8 px-6 py-20 md:flex-row md:items-end md:justify-between md:py-28">
          <h2 className="font-display text-5xl font-bold leading-[0.95] tracking-tight md:text-7xl">
            Pick a side.
            <br />
            Stay loud.
          </h2>
          <Link href="/onboarding/quiz">
            <Button size="lg" variant="accent">
              Find my club
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
