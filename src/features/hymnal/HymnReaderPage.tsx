import { Suspense } from "react";
import type { Hymn } from "@/lib/hymns/types";
import { HymnNumberBadge } from "./HymnNumberBadge";
import { type HymnReturnTarget, ReaderReturnLink } from "./ReaderReturnLink";
import { HymnLyrics } from "./HymnLyrics";
import { HymnReaderClient } from "./HymnReaderClient";
import { HymnReturnNav } from "./HymnReturnNav";

export function HymnReaderPage({ hymn, returnTarget }: { hymn: Hymn; returnTarget: HymnReturnTarget }) {
  return (
    <article className="space-y-8">
      <Suspense fallback={<ReaderReturnLink target={returnTarget} />}>
        <HymnReturnNav hymn={hymn} />
      </Suspense>

      <header className="space-y-4 text-center">
        <HymnNumberBadge hymn={hymn} size="hero" />
        <h1 className="text-3xl font-extrabold leading-tight text-[var(--on-surface)] md:text-5xl">{hymn.displayTitle}</h1>
        {hymn.key ? (
          <p className="mx-auto inline-flex rounded-full bg-[var(--primary-fixed)] px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[var(--on-primary-fixed-variant)]">
            Nota: {hymn.key}
          </p>
        ) : null}
      </header>

      <div className="mx-auto max-w-[640px] space-y-7 pb-10">
        <HymnLyrics hymn={hymn} />
        <HymnReaderClient hymn={hymn} />
      </div>
    </article>
  );
}
