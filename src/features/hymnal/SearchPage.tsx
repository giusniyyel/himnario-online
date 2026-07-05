"use client";

import { useSearchParams } from "next/navigation";
import { OfflineAwareLink } from "@/components/navigation/OfflineAwareLink";
import { hymns } from "@/lib/hymns/data";
import type { SearchMode } from "@/lib/hymns/types";
import { searchHymns } from "@/lib/hymns/search";
import { HymnLink } from "./HymnLink";
import { SearchField } from "./SearchField";

const tabs: Array<{ mode: SearchMode; label: string }> = [
  { mode: "todo", label: "Todo" },
  { mode: "titulos", label: "Títulos" },
  { mode: "numeros", label: "Números" },
  { mode: "letras", label: "Letras" }
];

const modes = new Set<SearchMode>(["todo", "titulos", "numeros", "letras"]);

export function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const rawMode = searchParams.get("modo") ?? "todo";
  const mode = modes.has(rawMode as SearchMode) ? (rawMode as SearchMode) : "todo";
  const availableTabs = getAvailableTabs(query);
  const activeMode = availableTabs.some((tab) => tab.mode === mode) ? mode : "todo";
  const results = searchHymns(hymns, query, activeMode);
  const sourceHref = getSearchHref(query, activeMode);

  return (
    <div className="space-y-7">
      <form action="/buscar" className="space-y-5">
        <SearchField defaultValue={query} placeholder="Buscar himnos..." autoFocus />
        <input type="hidden" name="modo" value={activeMode} />
      </form>

      <div className="scrollbar-none flex gap-2 overflow-x-auto pb-1" aria-label="Filtros de búsqueda">
        {availableTabs.map((tab) => {
          const href = `/buscar?${new URLSearchParams({ q: query, modo: tab.mode }).toString()}`;
          const isActive = tab.mode === activeMode;

          return (
            <OfflineAwareLink
              key={tab.mode}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={
                isActive
                  ? "whitespace-nowrap rounded-full bg-[var(--accent)] px-5 py-3 text-xs font-extrabold uppercase tracking-[0.16em] text-[var(--on-accent)] shadow-sm"
                  : "whitespace-nowrap rounded-full border border-[var(--outline-variant)] bg-[var(--surface-high)] px-5 py-3 text-xs font-extrabold uppercase tracking-[0.16em] text-[var(--on-surface-variant)]"
              }
            >
              {tab.label}
            </OfflineAwareLink>
          );
        })}
      </div>

      <section className="space-y-4">
        <h1 className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--on-surface-variant)]">
          {query ? `${results.length} resultado${results.length === 1 ? "" : "s"}` : "Buscar"}
        </h1>

        {!query ? (
          <div className="rounded-2xl border border-[var(--outline-variant)] bg-[var(--surface-lowest)] p-5 text-sm text-[var(--on-surface-variant)]">
            Busca por número, título o una frase de la letra.
          </div>
        ) : results.length === 0 ? (
          <div className="rounded-2xl border border-[var(--outline-variant)] bg-[var(--surface-lowest)] p-5 text-sm text-[var(--on-surface-variant)]">
            No encontramos himnos para “{query}”.
          </div>
        ) : (
          <div className="space-y-3">
            {results.map((result) => (
              <HymnLink
                key={result.hymn.id}
                hymn={result.hymn}
                excerpt={result.lyricExcerpt}
                lyricSnippet={result.lyricSnippet}
                source={{ type: "search", sourceHref, query, mode: activeMode }}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function getSearchHref(query: string, mode: SearchMode) {
  const params = new URLSearchParams();

  if (query) {
    params.set("q", query);
  }

  params.set("modo", mode);

  return `/buscar?${params.toString()}`;
}

function getAvailableTabs(query: string) {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return tabs;
  }

  if (/^\d+[a-zª]?$/iu.test(trimmedQuery)) {
    return tabs.filter((tab) => tab.mode === "todo");
  }

  if (/\p{L}/u.test(trimmedQuery)) {
    return tabs.filter((tab) => tab.mode !== "numeros");
  }

  return tabs;
}
