import { PrivacyPage } from "@/features/legal/PrivacyPage";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata({
  title: "Política de privacidad",
  description: "Cómo Himnario Rayos de Esperanza maneja tus datos y preferencias en el dispositivo.",
  path: "/privacidad"
});

export default function PrivacidadPage() {
  return <PrivacyPage />;
}
