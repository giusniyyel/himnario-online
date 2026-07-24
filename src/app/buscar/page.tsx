import { Suspense } from "react";
import { SearchPage } from "@/features/hymnal/SearchPage";
import { createPageMetadata } from "@/lib/site-metadata";

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
      path: "/buscar",
      noIndex: true
    });
  }

  return createPageMetadata({
    title: "Buscar",
    description: "Busca himnos por título, número o letra en el Himnario Rayos de Esperanza.",
    path: "/buscar"
  });
}

export default function BuscarPage() {
  return (
    <Suspense fallback={<div className="py-16 text-center text-[var(--on-surface-variant)]">Cargando búsqueda…</div>}>
      <SearchPage />
    </Suspense>
  );
}
