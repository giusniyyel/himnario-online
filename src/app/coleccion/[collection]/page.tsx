import { notFound } from "next/navigation";
import { CollectionPage } from "@/features/hymnal/CollectionPage";
import { collections, getHymnsByCollection, isHymnCollection } from "@/lib/hymns/data";

const hymnsPerPage = 24;

export function generateStaticParams() {
  return Object.keys(collections).map((collection) => ({ collection }));
}

export async function generateMetadata({ params }: { params: Promise<{ collection: string }> }) {
  const { collection } = await params;

  if (!isHymnCollection(collection)) {
    return {};
  }

  return {
    title: collections[collection].label
  };
}

export default async function HymnCollectionRoute({
  params,
  searchParams
}: {
  params: Promise<{ collection: string }>;
  searchParams: Promise<{ pagina?: string }>;
}) {
  const { collection } = await params;
  const { pagina } = await searchParams;

  if (!isHymnCollection(collection)) {
    notFound();
  }

  const collectionHymns = getHymnsByCollection(collection);
  const totalPages = Math.max(1, Math.ceil(collectionHymns.length / hymnsPerPage));
  const currentPage = clampPage(Number(pagina) || 1, totalPages);
  const startIndex = (currentPage - 1) * hymnsPerPage;
  const pageHymns = collectionHymns.slice(startIndex, startIndex + hymnsPerPage);

  return (
    <CollectionPage
      collection={collections[collection]}
      hymns={pageHymns}
      totalHymns={collectionHymns.length}
      pagination={{
        currentPage,
        totalPages,
        startItem: startIndex + 1,
        endItem: Math.min(startIndex + pageHymns.length, collectionHymns.length),
        basePath: `/coleccion/${collection}`
      }}
    />
  );
}

function clampPage(page: number, totalPages: number) {
  return Math.min(totalPages, Math.max(1, Math.trunc(page)));
}
