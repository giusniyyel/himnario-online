import { collections } from "@/lib/hymns/data";
import type { Hymn, SearchMode } from "@/lib/hymns/types";
import type { HymnReturnTarget } from "./ReaderReturnLink";

const searchModes = new Set<SearchMode>(["todo", "titulos", "numeros", "letras"]);

export function getHymnReturnTarget(
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
