import { Suspense } from "react";
import { HymnReaderRouteClient } from "@/features/hymnal/HymnReaderRouteClient";
import { collections, getHymn, hymns } from "@/lib/hymns/data";
import { createHymnMetadata } from "@/lib/site-metadata";

export function generateStaticParams() {
  return hymns.map((hymn) => ({
    collection: hymn.collection,
    slug: hymn.slug
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ collection: string; slug: string }> }) {
  const { collection, slug } = await params;
  const hymn = getHymn(collection, slug);

  if (!hymn) {
    return {};
  }

  const collectionLabel = collections[hymn.collection]?.label ?? "Himnario";
  const excerpt = hymn.plainText.slice(0, 140).replace(/\s+/g, " ").trim();

  return createHymnMetadata({
    hymnTitle: `${hymn.number}${hymn.suffix} ${hymn.displayTitle}`,
    collectionLabel,
    excerpt,
    path: `/himno/${hymn.collection}/${hymn.slug}`
  });
}

export default function HymnRoute() {
  return (
    <Suspense fallback={<div className="py-16 text-center text-[var(--on-surface-variant)]">Cargando himno…</div>}>
      <HymnReaderRouteClient />
    </Suspense>
  );
}
