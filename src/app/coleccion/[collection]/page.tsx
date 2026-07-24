import { Suspense } from "react";
import { notFound } from "next/navigation";
import { CollectionStructuredData } from "@/components/seo/CollectionStructuredData";
import { CollectionPage } from "@/features/hymnal/CollectionPage";
import { CollectionPaginationClient } from "@/features/hymnal/CollectionPaginationClient";
import { collections, getHymnsByCollection, isHymnCollection } from "@/lib/hymns/data";
import type { Hymn, HymnCollection } from "@/lib/hymns/types";
import { createPageMetadata } from "@/lib/site-metadata";

const hymnsPerPage = 24;

export function generateStaticParams() {
  return Object.keys(collections).map((collection) => ({ collection }));
}

export async function generateMetadata({ params }: { params: Promise<{ collection: string }> }) {
  const { collection } = await params;

  if (!isHymnCollection(collection)) {
    return {};
  }

  const info = collections[collection];

  return createPageMetadata({
    title: info.label,
    description: `${info.description} Himnario Rayos de Esperanza.`,
    path: `/coleccion/${collection}`
  });
}

export default async function HymnCollectionRoute({ params }: { params: Promise<{ collection: string }> }) {
  const { collection } = await params;

  if (!isHymnCollection(collection)) {
    notFound();
  }

  const collectionHymns = getHymnsByCollection(collection);
  const info = collections[collection];
  const pageOne = getCollectionPageProps(collection, collectionHymns, 1);

  return (
    <>
      <CollectionStructuredData collection={info} hymns={collectionHymns} />
      <Suspense fallback={<CollectionPage {...pageOne} />}>
        <CollectionPaginationClient collection={collection} />
      </Suspense>
    </>
  );
}

function getCollectionPageProps(collection: HymnCollection, collectionHymns: Hymn[], page: number) {
  const totalPages = Math.max(1, Math.ceil(collectionHymns.length / hymnsPerPage));
  const currentPage = Math.min(totalPages, Math.max(1, Math.trunc(page)));
  const startIndex = (currentPage - 1) * hymnsPerPage;
  const pageHymns = collectionHymns.slice(startIndex, startIndex + hymnsPerPage);

  return {
    collection: collections[collection],
    hymns: pageHymns,
    totalHymns: collectionHymns.length,
    pagination: {
      currentPage,
      totalPages,
      startItem: startIndex + 1,
      endItem: Math.min(startIndex + pageHymns.length, collectionHymns.length),
      basePath: `/coleccion/${collection}`
    }
  };
}
