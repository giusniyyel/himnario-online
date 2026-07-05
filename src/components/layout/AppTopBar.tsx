import Link from "next/link";
import { BookOpen, Heart, Search, Settings } from "lucide-react";

export function AppTopBar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-[var(--primary)] text-[var(--on-primary)] shadow-sm">
      <div className="mx-auto flex h-16 w-full max-w-[720px] items-center justify-between px-4">
        <Link
          href="/"
          aria-label="Biblioteca"
          className="flex size-11 items-center justify-center rounded-full transition hover:bg-white/10 active:scale-95"
        >
          <BookOpen aria-hidden="true" className="size-6" />
        </Link>
        <div className="min-w-0 flex-1 px-3 text-center">
          <p className="truncate text-xl font-extrabold leading-6 tracking-normal md:text-2xl">
            Himnario Rayos de Esperanza
          </p>
          <p className="truncate text-[0.65rem] font-extrabold uppercase tracking-[0.22em] text-white/75 md:text-xs">
            Iglesia de Dios en México
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Link
            href="/buscar"
            aria-label="Buscar himnos"
            className="hidden size-11 items-center justify-center rounded-full transition hover:bg-white/10 active:scale-95 lg:flex"
          >
            <Search aria-hidden="true" className="size-5" />
          </Link>
          <Link
            href="/favoritos"
            aria-label="Favoritos"
            className="hidden size-11 items-center justify-center rounded-full transition hover:bg-white/10 active:scale-95 lg:flex"
          >
            <Heart aria-hidden="true" className="size-5" />
          </Link>
          <Link
            href="/configuracion"
            aria-label="Configuración"
            className="flex size-11 items-center justify-center rounded-full transition hover:bg-white/10 active:scale-95"
          >
            <Settings aria-hidden="true" className="size-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
