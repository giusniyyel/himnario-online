import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site-url";

export const site = {
  name: "Himnario Rayos de Esperanza",
  shortName: "Himnario",
  description:
    "Himnario digital para la Iglesia de Dios en México. Busca, lee y guarda tus himnos favoritos en línea u offline.",
  organization: "Iglesia de Dios en México",
  locale: "es_MX",
  language: "es-MX",
  themeColor: "#002045",
  backgroundColor: "#f9f9ff",
  keywords: [
    "himnario",
    "himnos",
    "rayos de esperanza",
    "iglesia de dios",
    "iglesia de dios en méxico",
    "letras de himnos",
    "himnario cristiano",
    "adoración",
    "himnos especiales",
    "himnos normales"
  ]
} as const;

export function absoluteUrl(path = "/") {
  return new URL(path, getSiteUrl()).toString();
}

type PageMetadataOptions = {
  title: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
};

export function createPageMetadata({
  title,
  description = site.description,
  path = "/",
  noIndex = false
}: PageMetadataOptions): Metadata {
  const url = absoluteUrl(path);

  return {
    title,
    description,
    alternates: {
      canonical: url
    },
    openGraph: {
      type: "website",
      locale: site.locale,
      url,
      siteName: site.name,
      title: `${title} | ${site.name}`,
      description,
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: site.name }]
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${site.name}`,
      description,
      images: ["/twitter-image"]
    },
    ...(noIndex
      ? {
          robots: {
            index: false,
            follow: false
          }
        }
      : {})
  };
}

export function createRootMetadata(): Metadata {
  const url = getSiteUrl();

  return {
    metadataBase: new URL(url),
    title: {
      default: site.name,
      template: `%s | ${site.name}`
    },
    description: site.description,
    applicationName: site.name,
    authors: [{ name: site.organization }],
    creator: site.organization,
    publisher: site.organization,
    category: "music",
    keywords: [...site.keywords],
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1
      }
    },
    alternates: {
      canonical: url,
      languages: {
        "es-MX": url
      }
    },
    icons: {
      icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
      apple: [{ url: "/apple-icon.svg", sizes: "180x180", type: "image/svg+xml" }],
      shortcut: ["/icon.svg"]
    },
    manifest: "/manifest.webmanifest",
    appleWebApp: {
      capable: true,
      title: site.shortName,
      statusBarStyle: "black-translucent"
    },
    formatDetection: {
      telephone: false,
      email: false,
      address: false
    },
    openGraph: {
      type: "website",
      locale: site.locale,
      url,
      siteName: site.name,
      title: site.name,
      description: site.description,
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: site.name }]
    },
    twitter: {
      card: "summary_large_image",
      title: site.name,
      description: site.description,
      images: ["/twitter-image"]
    },
    other: {
      "mobile-web-app-capable": "yes",
      "apple-mobile-web-app-capable": "yes",
      "apple-mobile-web-app-title": site.shortName,
      "apple-mobile-web-app-status-bar-style": "black-translucent"
    }
  };
}

export function createHymnMetadata({
  hymnTitle,
  collectionLabel,
  excerpt,
  path
}: {
  hymnTitle: string;
  collectionLabel: string;
  excerpt: string;
  path: string;
}): Metadata {
  const title = hymnTitle;
  const description = `${hymnTitle} — ${collectionLabel}. ${excerpt}`;

  return {
    ...createPageMetadata({ title, description, path }),
    openGraph: {
      type: "article",
      locale: site.locale,
      url: absoluteUrl(path),
      siteName: site.name,
      title: `${title} | ${site.name}`,
      description,
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: site.name }]
    }
  };
}
