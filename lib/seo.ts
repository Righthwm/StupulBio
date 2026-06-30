import type { Metadata } from "next";
import type { Product } from "@/types";

/** Single source of truth for site-wide SEO data. */
export const siteConfig = {
  name: "Fagurul de Aur",
  legalName: "POPESCU V. VETUȚA P.F.A.",
  description:
    "Miere naturală pură, recoltată manual în România — salcâm, tei, munte, polifloră. Miere crudă (raw honey), neîncălzită, fără aditivi, fără antibiotice. Livrare 24–48h.",
  url: "https://faguruldeaur.ro",
  locale: "ro_RO",
  email: "faguruldeaur@gmail.com",
  phone: "+40743252661",
  phoneDisplay: "0743 252 661",
  address: {
    street: "Sat Sterpoaia, Comuna Aninoasa, nr. 400",
    locality: "Aninoasa",
    region: "Gorj",
    postalCode: "217015",
    country: "RO",
  },
  geo: { lat: 45.0167, lng: 23.3 }, // Aninoasa, Gorj (aprox.)
  ogImage: "/images/og-default.jpg",
  social: {
    facebook: "https://www.facebook.com/profile.php?id=61590509170705",
    instagram: "https://www.instagram.com/faguruldeaur/",
  },
};

/** Default keyword set covering the honey/apiculture lexical field (RO + raw honey). */
export const siteKeywords = [
  "miere naturală",
  "miere pură",
  "miere naturală România",
  "miere poliflora",
  "miere de albine pură",
  "miere artizanală România",
  "miere curată naturală",
  "cumpără miere naturală online",
  "miere premium",
  "miere de salcâm",
  "miere de tei",
  "miere de munte",
  "miere de mană",
  "miere recoltată manual",
  "miere fără aditivi",
  "miere crudă",
  "raw honey România",
  "miere neîncălzită",
  "miere neprelucrată",
  "produse apicole naturale",
  "propolis",
  "polen",
  "ceară de albine",
  "fagure",
  "apicultor România",
  "stupină",
  "beneficii miere poliflora",
  "cel mai bun producător miere România",
];

const abs = (path: string) => (path.startsWith("http") ? path : `${siteConfig.url}${path}`);

interface PageMetaInput {
  title: string;
  description: string;
  /** Path beginning with "/" — used for canonical + og:url. */
  path: string;
  keywords?: string[];
  image?: string;
}

/** Build per-page Metadata with a canonical URL and Open Graph/Twitter images. */
export function buildMetadata({ title, description, path, keywords, image }: PageMetaInput): Metadata {
  const url = abs(path);
  const ogImage = abs(image ?? siteConfig.ogImage);
  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      locale: siteConfig.locale,
      siteName: siteConfig.name,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export function generateProductMetadata(product: Product): Metadata {
  return buildMetadata({
    title: `${product.name} naturală, recoltată manual`,
    description: `${product.description} Comandă ${product.name} 100% naturală de la Fagurul de Aur — extracție la rece, fără aditivi. ${product.price} lei/${product.priceUnit}.`,
    path: `/magazin/${product.slug}`,
    image: product.image,
    keywords: [product.name.toLowerCase(), ...product.tags, "miere naturală", "cumpără miere online"],
  });
}

/** schema.org Organization — site-wide brand entity. */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: siteConfig.url,
    logo: abs("/logo.svg"),
    image: abs(siteConfig.ogImage),
    description: siteConfig.description,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    sameAs: [siteConfig.social.facebook, siteConfig.social.instagram],
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.locality,
      addressRegion: siteConfig.address.region,
      postalCode: siteConfig.address.postalCode,
      addressCountry: siteConfig.address.country,
    },
  };
}

/** schema.org LocalBusiness/Store — physical apiary for local SEO. */
export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Store",
    "@id": `${siteConfig.url}/#localbusiness`,
    name: siteConfig.name,
    image: abs(siteConfig.ogImage),
    url: siteConfig.url,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    priceRange: "$$",
    currenciesAccepted: "RON",
    paymentAccepted: "Card, Ramburs",
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.locality,
      addressRegion: siteConfig.address.region,
      postalCode: siteConfig.address.postalCode,
      addressCountry: siteConfig.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.geo.lat,
      longitude: siteConfig.geo.lng,
    },
    areaServed: { "@type": "Country", name: "România" },
    sameAs: [siteConfig.social.facebook, siteConfig.social.instagram],
  };
}

/** schema.org WebSite with SearchAction (sitelinks search box eligibility). */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    url: siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.description,
    inLanguage: "ro-RO",
    publisher: { "@id": `${siteConfig.url}/#organization` },
  };
}

/** schema.org BreadcrumbList from an ordered list of {name, path}. */
export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: abs(item.path),
    })),
  };
}

/** schema.org FAQPage from question/answer pairs. */
export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/** schema.org BlogPosting/Article for a blog post. */
export function blogPostingSchema(post: {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  image: string;
  keywords: string[];
}) {
  const url = `${siteConfig.url}/blog/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    headline: post.title,
    description: post.description,
    image: abs(post.image),
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    inLanguage: "ro-RO",
    keywords: post.keywords.join(", "),
    author: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
    publisher: { "@id": `${siteConfig.url}/#organization` },
  };
}

export function generateProductStructuredData(product: Product): string {
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.longDescription?.split("\n")[0] ?? product.description,
    image: abs(product.image ?? siteConfig.ogImage),
    category: "Miere și produse apicole",
    brand: { "@type": "Brand", name: siteConfig.name },
    offers: {
      "@type": "Offer",
      price: product.price.toString(),
      priceCurrency: "RON",
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${siteConfig.url}/magazin/${product.slug}`,
      seller: { "@id": `${siteConfig.url}/#organization` },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating.toString(),
      reviewCount: product.reviewCount.toString(),
    },
  };
  return JSON.stringify(data);
}

/** Render-ready helper: stringify any schema object for a <script> tag. */
export function jsonLd(schema: object | object[]): string {
  return JSON.stringify(schema);
}
