import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { clubs } from "@/lib/mock/clubs";

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(225,29,46,0.45), transparent 60%), radial-gradient(ellipse 50% 40% at 90% 30%, rgba(247,201,72,0.18), transparent)",
        }}
      />
      <section className="mx-auto flex w-full max-w-screen-lg flex-col items-center px-4 py-16 text-center md:py-24">
        <span className="rounded-full border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-1 text-xs uppercase tracking-widest text-[var(--color-text-muted)]">
          Liga 1 · Indonesia
        </span>
        <h1 className="mt-6 font-display text-5xl leading-[1.05] tracking-tight md:text-7xl">
          Built for the <span className="text-[var(--color-primary)]">terraces</span>.<br />
          Made for the <span className="text-[var(--color-accent)]">faithful</span>.
        </h1>
        <p className="mt-5 max-w-xl text-base text-[var(--color-text-muted)] md:text-lg">
          Predict every Liga 1 match. Earn points off your hottest takes.
          Argue with strangers about three-at-the-back. Find your club. Stay loud.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <Link href="/onboarding/quiz">
            <Button size="lg" variant="primary">Find my club</Button>
          </Link>
          <Link href="/feed">
            <Button size="lg" variant="secondary">I'm already a supporter</Button>
          </Link>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          {clubs.slice(0, 8).map((c) => (
            <span
              key={c.id}
              title={c.name}
              className="grid h-12 w-12 place-items-center rounded-full text-xl ring-1 ring-[var(--color-line)]"
              style={{ background: `linear-gradient(135deg, ${c.colors[0]}, ${c.colors[1]})` }}
              aria-label={c.name}
            >
              {c.logo ? (
                <img src={c.logo} alt={c.name} className="h-4/5 w-4/5 object-contain" />
              ) : (
                c.crestEmoji
              )}
            </span>
          ))}
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-screen-lg grid-cols-1 gap-4 px-4 pb-20 md:grid-cols-3">
        {[
          { title: "Predict", body: "Lock scorelines, name first scorers, ride your confidence multiplier." },
          { title: "Earn", body: "Points compound into limited scarves, stadium tours, and pitch-side passes." },
          { title: "Debate", body: "Threads with your fellow ultras. Loud, sharp, civil. (Mostly.)" },
        ].map((f) => (
          <div key={f.title} className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-6">
            <h3 className="text-lg font-bold">{f.title}</h3>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">{f.body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
