"use client";

import { useSearchParams } from "next/navigation";
import { CollectionPage } from "@/features/hymnal/CollectionPage";
import { collections, getHymnsByCollection } from "@/lib/hymns/data";
import type { HymnCollection } from "@/lib/hymns/types";

const hymnsPerPage = 24;

export function CollectionPaginationClient({ collection }: { collection: HymnCollection }) {
  const searchParams = useSearchParams();
  const hymns = getHymnsByCollection(collection);
  const totalPages = Math.max(1, Math.ceil(hymns.length / hymnsPerPage));
  const currentPage = clampPage(Number(searchParams.get("pagina")) || 1, totalPages);
  const startIndex = (currentPage - 1) * hymnsPerPage;
  const pageHymns = hymns.slice(startIndex, startIndex + hymnsPerPage);

  return (
    <CollectionPage
      collection={collections[collection]}
      hymns={pageHymns}
      totalHymns={hymns.length}
      pagination={{
        currentPage,
        totalPages,
        startItem: startIndex + 1,
        endItem: Math.min(startIndex + pageHymns.length, hymns.length),
        basePath: `/coleccion/${collection}`
      }}
    />
  );
}

function clampPage(page: number, totalPages: number) {
  return Math.min(totalPages, Math.max(1, Math.trunc(page)));
}
