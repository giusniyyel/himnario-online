import { SearchPage } from "@/features/hymnal/SearchPage";
import { hymns } from "@/lib/hymns/data";
import type { SearchMode } from "@/lib/hymns/types";

const modes = new Set(["todo", "titulos", "numeros", "letras"]);

export const metadata = {
  title: "Buscar"
};

export default async function BuscarPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; modo?: string }>;
}) {
  const params = await searchParams;
  const mode = modes.has(params.modo ?? "") ? (params.modo as SearchMode) : "todo";

  return <SearchPage hymns={hymns} query={params.q ?? ""} mode={mode} />;
}
