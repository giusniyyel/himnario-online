import { notFound } from "next/navigation";
import { HymnStructuredData } from "@/components/seo/HymnStructuredData";
import { HymnReaderPage } from "@/features/hymnal/HymnReaderPage";
import { getHymnReturnTarget } from "@/features/hymnal/hymn-return-target";
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

export default async function HymnRoute({ params }: { params: Promise<{ collection: string; slug: string }> }) {
  const { collection, slug } = await params;
  const hymn = getHymn(collection, slug);

  if (!hymn) {
    notFound();
  }

  const collectionLabel = collections[hymn.collection]?.label ?? "Himnario";
  const returnTarget = getHymnReturnTarget(hymn, {});

  return (
    <>
      <HymnStructuredData hymn={hymn} collectionLabel={collectionLabel} />
      <HymnReaderPage hymn={hymn} returnTarget={returnTarget} />
    </>
  );
}
