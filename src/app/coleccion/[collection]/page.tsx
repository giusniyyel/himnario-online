import { Suspense } from "react";
import { CollectionRouteClient } from "@/features/hymnal/CollectionRouteClient";
import { collections, isHymnCollection } from "@/lib/hymns/data";
import { createPageMetadata } from "@/lib/site-metadata";

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

export default function HymnCollectionRoute() {
  return (
    <Suspense fallback={<div className="py-16 text-center text-[var(--on-surface-variant)]">Cargando colección…</div>}>
      <CollectionRouteClient />
    </Suspense>
  );
}
