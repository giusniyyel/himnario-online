"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Hymn, SearchLyricSnippet, SearchMode } from "@/lib/hymns/types";
import { writeReturnNavigationIntent } from "@/services/local-storage/return-navigation";
import { HymnNumberBadge } from "./HymnNumberBadge";
import { LyricSearchSnippet } from "./LyricSearchSnippet";

type HymnLinkSource =
  | { type: "catalog"; sourceHref: string; page: number }
  | { type: "favorites"; sourceHref: string }
  | { type: "search"; sourceHref: string; query: string; mode: SearchMode };

export function HymnLink({
  hymn,
  excerpt,
  lyricSnippet,
  source
}: {
  hymn: Hymn;
  excerpt?: string;
  lyricSnippet?: SearchLyricSnippet | null;
  source?: HymnLinkSource;
}) {
  const href = getHymnHref(hymn, source);

  return (
    <Link
      href={href}
      onClick={(event) => {
        if (!source || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
          return;
        }

        writeReturnNavigationIntent({
          source: source.type,
          sourceHref: source.sourceHref,
          targetHref: href
        });
      }}
      className="group flex items-center gap-4 rounded-2xl border border-[var(--outline-variant)] bg-[var(--surface-lowest)] p-4 shadow-sm transition hover:bg-[var(--surface-low)] active:scale-[0.99]"
    >
      <HymnNumberBadge hymn={hymn} />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-base font-extrabold text-[var(--on-surface)]">{hymn.displayTitle}</span>
        {lyricSnippet ? (
          <LyricSearchSnippet snippet={lyricSnippet} />
        ) : (
          <span className="block truncate text-sm text-[var(--on-surface-variant)]">
            {excerpt || hymn.sections[0]?.lines[0] || "Himno"}
          </span>
        )}
      </span>
      <ChevronRight aria-hidden="true" className="size-5 shrink-0 text-[var(--outline)] transition group-hover:text-[var(--accent)]" />
    </Link>
  );
}

function getHymnHref(hymn: Hymn, source?: HymnLinkSource) {
  const pathname = `/himno/${hymn.collection}/${hymn.slug}`;

  if (!source) {
    return pathname;
  }

  const params = new URLSearchParams({ from: source.type });

  if (source.type === "catalog" && source.page > 1) {
    params.set("pagina", String(source.page));
  }

  if (source.type === "search") {
    params.set("q", source.query);
    params.set("modo", source.mode);
  }

  return `${pathname}?${params.toString()}`;
}
