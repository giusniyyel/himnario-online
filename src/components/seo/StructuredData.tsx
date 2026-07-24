import { absoluteUrl, site } from "@/lib/site-metadata";

export function StructuredData() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.organization,
    url: absoluteUrl("/"),
    logo: absoluteUrl("/icon.svg")
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    alternateName: site.shortName,
    description: site.description,
    inLanguage: site.language,
    url: absoluteUrl("/"),
    publisher: {
      "@type": "Organization",
      name: site.organization,
      url: absoluteUrl("/"),
      logo: absoluteUrl("/icon.svg")
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${absoluteUrl("/buscar")}?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  const webApplication = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: site.name,
    alternateName: site.shortName,
    description: site.description,
    applicationCategory: "MusicApplication",
    operatingSystem: "Web",
    browserRequirements: "Requires JavaScript",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "MXN"
    },
    inLanguage: site.language,
    url: absoluteUrl("/"),
    image: absoluteUrl("/icon.svg"),
    publisher: {
      "@type": "Organization",
      name: site.organization,
      url: absoluteUrl("/")
    }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplication) }} />
    </>
  );
}
