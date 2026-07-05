import { LibraryHome } from "@/features/hymnal/LibraryHome";
import { hymns } from "@/lib/hymns/data";

export default function HomePage() {
  return <LibraryHome hymns={hymns} />;
}
