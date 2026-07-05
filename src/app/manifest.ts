import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Himnario Rayos de Esperanza",
    short_name: "Himnario",
    description: "Himnario PWA para la Iglesia de Dios en México.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f9f9ff",
    theme_color: "#002045",
    lang: "es-MX",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any"
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable"
      }
    ]
  };
}
