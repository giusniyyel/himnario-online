import packageJson from "../../package.json";
import { hymns } from "@/lib/hymns/data";

export const appInfo = {
  version: packageJson.version,
  scriptureQuote: {
    text: "Cantad a Jehová cántico nuevo; Su alabanza sea en la congregación de los santos.",
    reference: "Salmo 149:1"
  },
  mission:
    "Facilitar el acceso al Himnario Rayos de Esperanza para las iglesias de la Iglesia de Dios en México con una herramienta digital moderna: búsqueda rápida, lectura cómoda, favoritos y uso sin conexión durante el culto.",
  communityNote: "Proyecto comunitario para apoyar a las iglesias locales.",
  compatibility: "PWA · Web · Móvil",
  hymnCount: hymns.length,
  congregationNote: "Diseñado por y para la iglesia.",
  author: {
    displayName: "Daniel Campos (giusniyyel)",
    url: "https://www.giusniyyel.dev/"
  },
  aboutPath: "/acerca",
  legal: {
    privacyPath: "/privacidad",
    termsPath: "/terminos"
  }
} as const;
