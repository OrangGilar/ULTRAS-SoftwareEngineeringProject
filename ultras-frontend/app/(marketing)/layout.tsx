import Link from "next/link";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <header className="border-b border-[var(--color-line)] bg-[var(--color-bg)]">
        <div className="mx-auto flex h-14 w-full max-w-screen-xl items-center justify-between px-6">
          <Link
            href="/"
            className="font-display text-xl font-bold tracking-[-0.02em] text-[var(--color-primary)]"
          >
            ULTRAS.
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="/login"
              className="font-mono-label text-[10px] text-[var(--color-text-muted)] transition hover:text-[var(--color-primary)]"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="rounded-[var(--radius-pill)] border border-[var(--color-text)] px-4 py-1.5 font-mono-label text-[10px] text-[var(--color-text)] transition hover:bg-[var(--color-text)] hover:text-[var(--color-pitch-black)]"
            >
              Register
            </Link>
          </nav>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
