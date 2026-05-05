"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Trophy, MessagesSquare, Gamepad2, Gift } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/feed", label: "Feed", Icon: Home },
  { href: "/matches", label: "Matches", Icon: Trophy },
  { href: "/community", label: "Community", Icon: MessagesSquare },
  { href: "/games", label: "Games", Icon: Gamepad2 },
  { href: "/rewards", label: "Rewards", Icon: Gift },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-[var(--color-line)] bg-[var(--color-bg)] md:hidden"
      aria-label="Primary"
    >
      <ul className="mx-auto flex w-full max-w-screen-md items-stretch justify-around px-2 py-2">
        {NAV.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          const { Icon } = item;
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className={cn(
                  "relative flex flex-col items-center gap-1 px-2 py-1 font-mono-label text-[9px] transition",
                  active
                    ? "text-[var(--color-primary)]"
                    : "text-[var(--color-text-faint)] hover:text-[var(--color-text)]"
                )}
              >
                <Icon size={20} strokeWidth={active ? 2.4 : 1.8} />
                <span>{item.label}</span>
                {active && (
                  <span
                    aria-hidden
                    className="absolute -top-2 left-1/2 h-0.5 w-6 -translate-x-1/2 bg-[var(--color-primary)]"
                  />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
