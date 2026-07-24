import { absoluteUrl, site } from "@/lib/site-metadata";
import type { Hymn, HymnCollection } from "@/lib/hymns/types";

export function CollectionStructuredData({
  collection,
  hymns
}: {
  collection: { id: HymnCollection; label: string; description: string };
  hymns: Hymn[];
}) {
  const url = absoluteUrl(`/coleccion/${collection.id}`);

  const collectionPage = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: collection.label,
    description: collection.description,
    inLanguage: site.language,
    url,
    isPartOf: {
      "@type": "WebSite",
      name: site.name,
      url: absoluteUrl("/")
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: hymns.length,
      itemListElement: hymns.slice(0, 50).map((hymn, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteUrl(`/himno/${hymn.collection}/${hymn.slug}`),
        name: `${hymn.number}${hymn.suffix} ${hymn.displayTitle}`
      }))
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
        name: collection.label,
        item: url
      }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPage) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
    </>
  );
}
