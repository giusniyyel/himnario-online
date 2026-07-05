"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Hymn } from "@/lib/hymns/types";
import { readUserSettings } from "@/services/local-storage/user-preferences";
import { HymnLink } from "./HymnLink";

export function FavoritesPage({ hymns }: { hymns: Hymn[] }) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const hymnsById = useMemo(() => new Map(hymns.map((hymn) => [hymn.id, hymn])), [hymns]);
  const favoriteHymns = favoriteIds.map((id) => hymnsById.get(id)).filter((hymn): hymn is Hymn => Boolean(hymn));

  useEffect(() => {
    queueMicrotask(() => {
      setFavoriteIds(readUserSettings().favoriteIds);
    });
  }, []);

  return (
    <div className="space-y-7">
      <header className="space-y-3 py-2">
        <h1 className="text-4xl font-extrabold leading-tight tracking-normal text-[var(--accent)]">Favoritos</h1>
        <div className="h-1 w-20 rounded-full bg-[var(--secondary-container)]" />
      </header>

      {favoriteHymns.length === 0 ? (
        <div className="rounded-2xl border border-[var(--outline-variant)] bg-[var(--surface-lowest)] p-5 text-sm text-[var(--on-surface-variant)]">
          Guarda himnos desde el lector para tenerlos a la mano aquí.{" "}
          <Link href="/buscar" className="font-bold text-[var(--accent)] underline underline-offset-4">
            Buscar himnos
          </Link>
        </div>
      ) : (
        <section className="space-y-3" aria-label="Himnos favoritos">
          {favoriteHymns.map((hymn) => (
            <HymnLink key={hymn.id} hymn={hymn} source={{ type: "favorites", sourceHref: "/favoritos" }} />
          ))}
        </section>
      )}
    </div>
  );
}
