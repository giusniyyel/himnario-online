import { LibraryHome } from "@/features/hymnal/LibraryHome";
import { hymns } from "@/lib/hymns/data";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata({
  title: "Biblioteca",
  description: "Explora los himnos normales y especiales del Himnario Rayos de Esperanza.",
  path: "/"
});

export default function HomePage() {
  return <LibraryHome hymns={hymns} />;
}
