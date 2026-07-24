"use client";

import { useSearchParams } from "next/navigation";
import type { Hymn } from "@/lib/hymns/types";
import { getHymnReturnTarget } from "./hymn-return-target";
import { ReaderReturnLink } from "./ReaderReturnLink";

export function HymnReturnNav({ hymn }: { hymn: Hymn }) {
  const searchParams = useSearchParams();
  const target = getHymnReturnTarget(hymn, {
    from: searchParams.get("from") ?? undefined,
    modo: searchParams.get("modo") ?? undefined,
    pagina: searchParams.get("pagina") ?? undefined,
    q: searchParams.get("q") ?? undefined
  });

  return <ReaderReturnLink target={target} />;
}
