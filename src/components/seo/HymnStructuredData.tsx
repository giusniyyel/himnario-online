import { absoluteUrl, site } from "@/lib/site-metadata";
import type { Hymn } from "@/lib/hymns/types";

export function HymnStructuredData({
  hymn,
  collectionLabel
}: {
  hymn: Hymn;
  collectionLabel: string;
}) {
  const path = `/himno/${hymn.collection}/${hymn.slug}`;
  const url = absoluteUrl(path);
  const name = `${hymn.number}${hymn.suffix} ${hymn.displayTitle}`;
  const lyricsText = hymn.sections.map((section) => `${section.label}\n${section.lines.join("\n")}`).join("\n\n");

  const musicComposition = {
    "@context": "https://schema.org",
    "@type": "MusicComposition",
    name,
    alternateName: hymn.displayTitle,
    inLanguage: site.language,
    url,
    isPartOf: {
      "@type": "CreativeWorkSeries",
      name: collectionLabel,
      url: absoluteUrl(`/coleccion/${hymn.collection}`)
    },
    publisher: {
      "@type": "Organization",
      name: site.organization
    },
    lyrics: {
      "@type": "CreativeWork",
      inLanguage: site.language,
      text: lyricsText
    }
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: absoluteUrl("/")
      },
      {
        "@type": "ListItem",
        position: 2,
        name: collectionLabel,
        item: absoluteUrl(`/coleccion/${hymn.collection}`)
      },
      {
        "@type": "ListItem",
        position: 3,
        name: hymn.displayTitle,
        item: url
      }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(musicComposition) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
    </>
  );
}
