import Link from "next/link";
import { BookOpenText, Star } from "lucide-react";
import { collections } from "@/lib/hymns/data";
import type { Hymn } from "@/lib/hymns/types";
import { RecentHymns } from "./RecentHymns";
import { SearchField } from "./SearchField";

export function LibraryHome({ hymns }: { hymns: Hymn[] }) {
  return (
    <div className="space-y-8">
      <form action="/buscar">
        <SearchField />
      </form>

      <section className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/coleccion/normal"
          className="relative min-h-36 overflow-hidden rounded-2xl border border-[var(--surface-variant)] bg-[var(--primary-fixed)] p-6 text-left shadow-sm transition hover:brightness-[0.98] active:scale-[0.99]"
        >
          <span className="absolute right-6 top-6 flex size-14 items-center justify-center rounded-full bg-[var(--primary-fixed-dim)]/45 text-[var(--on-primary-fixed-variant)]">
            <BookOpenText aria-hidden="true" className="size-7" />
          </span>
          <span className="mt-14 block text-3xl font-extrabold leading-tight text-[var(--on-primary-fixed)]">
            {collections.normal.label}
          </span>
          <span className="mt-2 block text-base text-[var(--on-primary-fixed-variant)]">{collections.normal.description}</span>
        </Link>

        <Link
          href="/coleccion/special"
          className="relative min-h-36 overflow-hidden rounded-2xl border border-[var(--secondary-fixed-dim)]/40 bg-[var(--secondary-fixed)] p-6 text-left shadow-sm transition hover:brightness-[0.98] active:scale-[0.99]"
        >
          <span className="absolute right-6 top-6 flex size-14 items-center justify-center rounded-full bg-[var(--secondary-fixed-dim)]/35 text-[var(--on-secondary-fixed-variant)]">
            <Star aria-hidden="true" className="size-7 fill-current" />
          </span>
          <span className="mt-14 block text-3xl font-extrabold leading-tight text-[var(--on-secondary-fixed)]">
            {collections.special.label}
          </span>
          <span className="mt-2 block text-base text-[var(--on-secondary-fixed-variant)]">{collections.special.description}</span>
        </Link>
      </section>

      <RecentHymns hymns={hymns} />
    </div>
  );
}
