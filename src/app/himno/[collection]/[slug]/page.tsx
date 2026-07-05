import { notFound } from "next/navigation";
import { HymnReaderPage } from "@/features/hymnal/HymnReaderPage";
import type { HymnReturnTarget } from "@/features/hymnal/ReaderReturnLink";
import { collections, getHymn, hymns } from "@/lib/hymns/data";
import type { Hymn, SearchMode } from "@/lib/hymns/types";
import { createHymnMetadata } from "@/lib/site-metadata";

const searchModes = new Set<SearchMode>(["todo", "titulos", "numeros", "letras"]);

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

export default async function HymnRoute({
  params,
  searchParams
}: {
  params: Promise<{ collection: string; slug: string }>;
  searchParams: Promise<{ from?: string; modo?: string; pagina?: string; q?: string }>;
}) {
  const { collection, slug } = await params;
  const returnParams = await searchParams;
  const hymn = getHymn(collection, slug);

  if (!hymn) {
    notFound();
  }

  return <HymnReaderPage hymn={hymn} returnTarget={getReturnTarget(hymn, returnParams)} />;
}

function getReturnTarget(
  hymn: Hymn,
  params: {
    from?: string;
    modo?: string;
    pagina?: string;
    q?: string;
  }
): HymnReturnTarget {
  const collection = collections[hymn.collection];

  if (params.from === "favorites") {
    return {
      href: "/favoritos",
      label: "Favoritos",
      source: "favorites",
      preferHistory: true
    };
  }

  if (params.from === "search") {
    return {
      href: getSearchReturnHref(params.q ?? "", params.modo),
      label: "Buscar",
      source: "search",
      preferHistory: true
    };
  }

  if (params.from === "catalog") {
    return {
      href: getCatalogReturnHref(hymn.collection, params.pagina),
      label: collection.label,
      source: "catalog",
      preferHistory: true
    };
  }

  return {
    href: `/coleccion/${hymn.collection}`,
    label: collection.label,
    source: "collection",
    preferHistory: false
  };
}

function getSearchReturnHref(query: string, mode: string | undefined) {
  const params = new URLSearchParams();
  const safeMode = searchModes.has(mode as SearchMode) ? (mode as SearchMode) : "todo";

  if (query) {
    params.set("q", query);
  }

  params.set("modo", safeMode);

  return `/buscar?${params.toString()}`;
}

function getCatalogReturnHref(collection: Hymn["collection"], rawPage: string | undefined) {
  const page = Math.max(1, Math.trunc(Number(rawPage) || 1));

  return page <= 1 ? `/coleccion/${collection}` : `/coleccion/${collection}?pagina=${page}`;
}
