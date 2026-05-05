import { TopBar } from "@/components/layout/TopBar";
import { BottomNav } from "@/components/layout/BottomNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-bg)]">
      <TopBar />
      <main className="flex-1 pb-20 md:pb-12">{children}</main>
      <BottomNav />
    </div>
  );
}
