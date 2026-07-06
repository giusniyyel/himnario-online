import { AboutPage } from "@/features/about/AboutPage";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata({
  title: "Acerca de",
  description: "Conoce la misión, el equipo y los detalles del Himnario Rayos de Esperanza en línea.",
  path: "/acerca"
});

export default function AcercaPage() {
  return <AboutPage />;
}
