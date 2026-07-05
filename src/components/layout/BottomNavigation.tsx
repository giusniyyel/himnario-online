"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpenText, Heart, Search } from "lucide-react";
const NAV_ITEM_BASE =
  "relative flex min-h-16 min-w-0 flex-col items-center justify-center gap-1 rounded-2xl px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2";
const NAV_ITEM_ACTIVE =
  "bg-[var(--primary-fixed)] font-bold text-[var(--on-primary-fixed)] before:absolute before:top-1 before:h-1 before:w-8 before:rounded-full before:bg-[var(--secondary-container)]";
const NAV_ITEM_INACTIVE = "font-normal text-[var(--on-surface-variant)] hover:bg-[var(--surface-low)]";

const items = [
  { href: "/", label: "Biblioteca", icon: BookOpenText },
  { href: "/buscar", label: "Buscar", icon: Search },
  { href: "/favoritos", label: "Favoritos", icon: Heart }
];

export function BottomNavigation() {
  const pathname = usePathname();
  const activeHref = getActiveHref(pathname);

  return (
    <nav
      aria-label="Navegación principal"
      className="safe-bottom fixed inset-x-0 bottom-0 z-50 bg-[var(--surface-lowest)]/95 px-4 pb-3 pt-2 shadow-[0_-2px_12px_rgba(0,32,69,0.05)] backdrop-blur lg:hidden"
    >
      <div
        className="mx-auto grid h-18 max-w-[680px] gap-2"
        style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
      >
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeHref === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`${NAV_ITEM_BASE} ${isActive ? NAV_ITEM_ACTIVE : NAV_ITEM_INACTIVE}`}
            >
              <Icon aria-hidden="true" className="size-[22px] stroke-[2.25]" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function getActiveHref(pathname: string) {
  if (pathname.startsWith("/buscar")) {
    return "/buscar";
  }

  if (pathname.startsWith("/favoritos")) {
    return "/favoritos";
  }

  if (pathname === "/" || pathname.startsWith("/coleccion") || pathname.startsWith("/himno")) {
    return "/";
  }

  return "";
}
