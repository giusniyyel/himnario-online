import { FavoritesPage } from "@/features/hymnal/FavoritesPage";
import { hymns } from "@/lib/hymns/data";

export const metadata = {
  title: "Favoritos"
};

export default function FavoritosPage() {
  return <FavoritesPage hymns={hymns} />;
}
