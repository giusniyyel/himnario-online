import type { MetadataRoute } from "next";
import { absoluteUrl, site } from "@/lib/site-metadata";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: absoluteUrl("/"),
    name: site.name,
    short_name: site.shortName,
    description: site.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    display_override: ["standalone", "browser"],
    orientation: "portrait",
    background_color: site.backgroundColor,
    theme_color: site.themeColor,
    lang: site.language,
    dir: "ltr",
    categories: ["music", "books", "lifestyle"],
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any"
      },
      {
        src: "/icon.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "maskable"
      },
      {
        src: "/apple-icon.svg",
        sizes: "180x180",
        type: "image/svg+xml",
        purpose: "any"
      }
    ]
  };
}
