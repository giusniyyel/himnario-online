import { FavoritesPage } from "@/features/hymnal/FavoritesPage";
import { hymns } from "@/lib/hymns/data";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata({
  title: "Favoritos",
  description: "Accede rápidamente a tus himnos favoritos guardados en este dispositivo.",
  path: "/favoritos",
  noIndex: true
});

export default function FavoritosPage() {
  return <FavoritesPage hymns={hymns} />;
}
