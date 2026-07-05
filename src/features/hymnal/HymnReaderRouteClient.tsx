"use client";

import { notFound, useParams, useSearchParams } from "next/navigation";
import { HymnReaderPage } from "@/features/hymnal/HymnReaderPage";
import type { HymnReturnTarget } from "@/features/hymnal/ReaderReturnLink";
import { collections, getHymn } from "@/lib/hymns/data";
import type { Hymn, SearchMode } from "@/lib/hymns/types";

const searchModes = new Set<SearchMode>(["todo", "titulos", "numeros", "letras"]);

export function HymnReaderRouteClient() {
  const params = useParams<{ collection: string; slug: string }>();
  const searchParams = useSearchParams();
  const hymn = getHymn(params.collection, params.slug);

  if (!hymn) {
    notFound();
  }

  return (
    <HymnReaderPage
      hymn={hymn}
      returnTarget={getReturnTarget(hymn, {
        from: searchParams.get("from") ?? undefined,
        modo: searchParams.get("modo") ?? undefined,
        pagina: searchParams.get("pagina") ?? undefined,
        q: searchParams.get("q") ?? undefined
      })}
    />
  );
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
  const urlParams = new URLSearchParams();
  const safeMode = searchModes.has(mode as SearchMode) ? (mode as SearchMode) : "todo";

  if (query) {
    urlParams.set("q", query);
  }

  urlParams.set("modo", safeMode);

  return `/buscar?${urlParams.toString()}`;
}

function getCatalogReturnHref(collection: Hymn["collection"], rawPage: string | undefined) {
  const page = Math.max(1, Math.trunc(Number(rawPage) || 1));

  return page <= 1 ? `/coleccion/${collection}` : `/coleccion/${collection}?pagina=${page}`;
}
