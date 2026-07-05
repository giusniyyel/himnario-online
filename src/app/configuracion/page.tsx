import { ConfigurationPage } from "@/features/hymnal/ConfigurationPage";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata({
  title: "Configuración",
  description: "Personaliza el tamaño de texto, tema y alineación de lectura del himnario.",
  path: "/configuracion",
  noIndex: true
});

export default function ConfiguracionPage() {
  return <ConfigurationPage />;
}
