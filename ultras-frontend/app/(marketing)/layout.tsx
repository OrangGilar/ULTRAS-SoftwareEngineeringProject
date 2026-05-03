export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <header className="border-b border-[var(--color-line)] bg-[var(--color-bg)]/80 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-screen-lg items-center justify-between px-4">
          <span className="font-display text-2xl tracking-[0.18em] text-[var(--color-primary)]">ULTRAS</span>
          <a
            href="/feed"
            className="text-xs uppercase tracking-wider text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
          >
            Skip →
          </a>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
