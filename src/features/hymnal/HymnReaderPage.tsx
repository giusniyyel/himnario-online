import type { Hymn } from "@/lib/hymns/types";
import { HymnNumberBadge } from "./HymnNumberBadge";
import { type HymnReturnTarget, ReaderReturnLink } from "./ReaderReturnLink";
import { HymnReaderClient } from "./HymnReaderClient";

export function HymnReaderPage({ hymn, returnTarget }: { hymn: Hymn; returnTarget: HymnReturnTarget }) {
  return (
    <article className="space-y-8">
      <ReaderReturnLink target={returnTarget} />

      <header className="space-y-4 text-center">
        <HymnNumberBadge hymn={hymn} size="hero" />
        <h1 className="text-3xl font-extrabold leading-tight text-[var(--on-surface)] md:text-5xl">{hymn.displayTitle}</h1>
        {hymn.key ? (
          <p className="mx-auto inline-flex rounded-full bg-[var(--primary-fixed)] px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[var(--on-primary-fixed-variant)]">
            Nota: {hymn.key}
          </p>
        ) : null}
      </header>

      <HymnReaderClient hymn={hymn} />
    </article>
  );
}
