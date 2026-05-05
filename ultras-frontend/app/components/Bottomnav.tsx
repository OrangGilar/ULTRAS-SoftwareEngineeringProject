
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, Sparkles, User } from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();

  // Hide nav on auth pages so the form is the focus.
  if (pathname === "/login" || pathname === "/register") return null;

  const navItems = [
    { id: "home", icon: Home, label: "Home", href: "/" },
    { id: "shop", icon: ShoppingBag, label: "Shop", href: "/shop" },
    { id: "cosmetics", icon: Sparkles, label: "Cosmetics", href: "/cosmetics" },
    { id: "account", icon: User, label: "Account", href: "/account" },
  ];

  return (
    <div className="fixed bottom-0 w-full max-w-md bg-slate-900 border-t border-slate-800 pb-safe z-50">
      <div className="flex justify-around items-center p-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex flex-col items-center space-y-1 transition-colors ${
                isActive ? "text-fuchsia-500" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// Keep the old named export so existing imports don't break.
export { BottomNav as default };