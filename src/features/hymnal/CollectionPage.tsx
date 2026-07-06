import { ChevronLeft, ChevronRight } from "lucide-react";
import { OfflineAwareLink } from "@/components/navigation/OfflineAwareLink";
import type { Hymn, HymnCollection } from "@/lib/hymns/types";
import { HymnLink } from "./HymnLink";
import { SearchField } from "./SearchField";

type CollectionPagination = {
  currentPage: number;
  totalPages: number;
  startItem: number;
  endItem: number;
  basePath: string;
};

export function CollectionPage({
  collection,
  hymns,
  totalHymns,
  pagination
}: {
  collection: { id: HymnCollection; label: string; description: string };
  hymns: Hymn[];
  totalHymns: number;
  pagination: CollectionPagination;
}) {
  return (
    <div className="space-y-7">
      <header className="space-y-3 py-2">
        <h1 className="text-4xl font-extrabold leading-tight tracking-normal text-[var(--accent)]">{collection.label}</h1>
        <div className="h-1 w-20 rounded-full bg-[var(--secondary-container)]" />
        <p className="text-sm text-[var(--on-surface-variant)]">{totalHymns} himnos disponibles sin conexión.</p>
      </header>

      <SearchField hiddenParams={{ modo: "todo" }} />

      <PaginationControls pagination={pagination} totalHymns={totalHymns} />

      <section className="space-y-3" aria-label={collection.label}>
        {hymns.map((hymn) => (
          <HymnLink
            key={hymn.id}
            hymn={hymn}
            source={{
              type: "catalog",
              sourceHref: getPageHref(pagination.basePath, pagination.currentPage),
              page: pagination.currentPage
            }}
          />
        ))}
      </section>

      <PaginationControls pagination={pagination} totalHymns={totalHymns} />
    </div>
  );
}

function PaginationControls({
  pagination,
  totalHymns
}: {
  pagination: CollectionPagination;
  totalHymns: number;
}) {
  if (pagination.totalPages <= 1) {
    return null;
  }

  const previousPage = pagination.currentPage - 1;
  const nextPage = pagination.currentPage + 1;

  return (
    <nav
      aria-label="Paginación de himnos"
      className="flex flex-col rounded-2xl border border-[var(--outline-variant)] bg-[var(--surface-lowest)] p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-2"
    >
      <p className="text-center text-xs font-extrabold uppercase tracking-[0.16em] text-[var(--on-surface-variant)] sm:px-1 sm:text-left">
        {pagination.startItem}-{pagination.endItem} de {totalHymns}
      </p>

      <div className="grid grid-cols-[4rem_minmax(0,1fr)_4rem] items-center gap-3 sm:grid-cols-[1fr_auto_1fr] sm:gap-2">
        <PaginationLink
          href={getPageHref(pagination.basePath, previousPage)}
          disabled={pagination.currentPage === 1}
          label="Anterior"
          direction="previous"
        />
        <span className="min-w-0 text-center text-base font-extrabold text-[var(--on-surface)] sm:min-w-24 sm:text-sm sm:font-bold">
          <span className="sm:hidden">
            Página {pagination.currentPage} de {pagination.totalPages}
          </span>
          <span className="hidden sm:inline">
            {pagination.currentPage} / {pagination.totalPages}
          </span>
        </span>
        <PaginationLink
          href={getPageHref(pagination.basePath, nextPage)}
          disabled={pagination.currentPage === pagination.totalPages}
          label="Siguiente"
          direction="next"
        />
      </div>
    </nav>
  );
}

function PaginationLink({
  href,
  disabled,
  label,
  direction
}: {
  href: string;
  disabled: boolean;
  label: string;
  direction: "previous" | "next";
}) {
  const className = disabled
    ? "inline-flex size-14 items-center justify-center gap-2 rounded-full bg-[var(--surface-high)] text-sm font-bold text-[var(--outline)] opacity-70 sm:size-auto sm:min-h-11 sm:border sm:border-[var(--outline-variant)] sm:bg-transparent sm:px-4 sm:opacity-50"
    : "inline-flex size-14 items-center justify-center gap-2 rounded-full bg-[var(--accent)] text-sm font-bold text-[var(--on-accent)] shadow-sm transition active:scale-[0.99] sm:size-auto sm:min-h-11 sm:px-4";

  const content = (
    <>
      {direction === "previous" ? <ChevronLeft aria-hidden="true" className="size-6 sm:size-4" /> : null}
      <span className="sr-only sm:not-sr-only">{label}</span>
      {direction === "next" ? <ChevronRight aria-hidden="true" className="size-6 sm:size-4" /> : null}
    </>
  );

  if (disabled) {
    return (
      <span aria-disabled="true" className={className}>
        {content}
      </span>
    );
  }

  return (
    <OfflineAwareLink href={href} className={className}>
      {content}
    </OfflineAwareLink>
  );
}

function getPageHref(basePath: string, page: number) {
  return page <= 1 ? basePath : `${basePath}?pagina=${page}`;
}
