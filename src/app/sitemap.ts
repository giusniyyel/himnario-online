import type { MetadataRoute } from "next";
import { collections, hymns } from "@/lib/hymns/data";
import { getSiteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/buscar`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/acerca`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${siteUrl}/privacidad`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${siteUrl}/terminos`, lastModified: now, changeFrequency: "monthly", priority: 0.3 }
  ];

  const collectionRoutes: MetadataRoute.Sitemap = Object.keys(collections).map((collection) => ({
    url: `${siteUrl}/coleccion/${collection}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.9
  }));

  const hymnRoutes: MetadataRoute.Sitemap = hymns.map((hymn) => ({
    url: `${siteUrl}/himno/${hymn.collection}/${hymn.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7
  }));

  return [...staticRoutes, ...collectionRoutes, ...hymnRoutes];
}
