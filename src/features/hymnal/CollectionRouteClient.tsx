"use client";

import { notFound, useParams, useSearchParams } from "next/navigation";
import { CollectionPage } from "@/features/hymnal/CollectionPage";
import { collections, getHymnsByCollection, isHymnCollection } from "@/lib/hymns/data";

const hymnsPerPage = 24;

export function CollectionRouteClient() {
  const params = useParams<{ collection: string }>();
  const searchParams = useSearchParams();

  if (!isHymnCollection(params.collection)) {
    notFound();
  }

  const collectionHymns = getHymnsByCollection(params.collection);
  const totalPages = Math.max(1, Math.ceil(collectionHymns.length / hymnsPerPage));
  const currentPage = clampPage(Number(searchParams.get("pagina")) || 1, totalPages);
  const startIndex = (currentPage - 1) * hymnsPerPage;
  const pageHymns = collectionHymns.slice(startIndex, startIndex + hymnsPerPage);

  return (
    <CollectionPage
      collection={collections[params.collection]}
      hymns={pageHymns}
      totalHymns={collectionHymns.length}
      pagination={{
        currentPage,
        totalPages,
        startItem: startIndex + 1,
        endItem: Math.min(startIndex + pageHymns.length, collectionHymns.length),
        basePath: `/coleccion/${params.collection}`
      }}
    />
  );
}

function clampPage(page: number, totalPages: number) {
  return Math.min(totalPages, Math.max(1, Math.trunc(page)));
}
