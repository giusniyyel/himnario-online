"use client";

import { useEffect, useMemo, useState } from "react";
import type { Hymn } from "@/lib/hymns/types";
import { readUserSettings } from "@/services/local-storage/user-preferences";
import { HymnLink } from "./HymnLink";

export function RecentHymns({ hymns }: { hymns: Hymn[] }) {
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const hymnsById = useMemo(() => new Map(hymns.map((hymn) => [hymn.id, hymn])), [hymns]);
  const recentHymns = recentIds.map((id) => hymnsById.get(id)).filter((hymn): hymn is Hymn => Boolean(hymn)).slice(0, 4);

  useEffect(() => {
    queueMicrotask(() => {
      setRecentIds(readUserSettings().recentIds);
    });
  }, []);

  if (recentHymns.length === 0) {
    return (
      <section className="space-y-4">
        <h2 className="pl-1 text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--on-surface-variant)]">
          Recientes
        </h2>
        <div className="rounded-2xl border border-[var(--outline-variant)] bg-[var(--surface-lowest)] p-5 text-sm text-[var(--on-surface-variant)]">
          Los himnos que abras aparecerán aquí para volver rápido durante el culto.
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <h2 className="pl-1 text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--on-surface-variant)]">Recientes</h2>
      <div className="space-y-3">
        {recentHymns.map((hymn) => (
          <HymnLink key={hymn.id} hymn={hymn} />
        ))}
      </div>
    </section>
  );
}
