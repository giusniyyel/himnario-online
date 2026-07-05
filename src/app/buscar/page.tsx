import { SearchPage } from "@/features/hymnal/SearchPage";
import { hymns } from "@/lib/hymns/data";
import type { SearchMode } from "@/lib/hymns/types";
import { createPageMetadata } from "@/lib/site-metadata";

const modes = new Set(["todo", "titulos", "numeros", "letras"]);

export async function generateMetadata({
  searchParams
}: {
  searchParams: Promise<{ q?: string; modo?: string }>;
}) {
  const params = await searchParams;
  const query = params.q?.trim();

  if (query) {
    return createPageMetadata({
      title: `Buscar: ${query}`,
      description: `Resultados de búsqueda para “${query}” en el Himnario Rayos de Esperanza.`,
      path: `/buscar?q=${encodeURIComponent(query)}`
    });
  }

  return createPageMetadata({
    title: "Buscar",
    description: "Busca himnos por título, número o letra en el Himnario Rayos de Esperanza.",
    path: "/buscar"
  });
}

export default async function BuscarPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; modo?: string }>;
}) {
  const params = await searchParams;
  const mode = modes.has(params.modo ?? "") ? (params.modo as SearchMode) : "todo";

  return <SearchPage hymns={hymns} query={params.q ?? ""} mode={mode} />;
}
