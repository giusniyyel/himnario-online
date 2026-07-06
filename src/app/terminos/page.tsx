import { TermsPage } from "@/features/legal/TermsPage";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata({
  title: "Términos de uso",
  description: "Términos de uso y avisos sobre el Himnario Rayos de Esperanza en línea.",
  path: "/terminos"
});

export default function TerminosPage() {
  return <TermsPage />;
}
