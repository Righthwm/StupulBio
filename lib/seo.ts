import type { Metadata } from "next";
import type { Product } from "@/types";

export const siteConfig = {
  name: "Fagurul de Aur",
  description:
    "Miere artizanală pură, 100% naturală. Salcâm, tei, mană, polifloră — recoltate manual, fără chimicale.",
  url: "https://faguruldeaur.ro",
  locale: "ro_RO",
};

export function generateProductMetadata(product: Product): Metadata {
  return {
    title: `${product.name} — ${siteConfig.name}`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      type: "website",
      locale: siteConfig.locale,
      siteName: siteConfig.name,
    },
  };
}

export function generateProductStructuredData(product: Product): string {
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    brand: {
      "@type": "Brand",
      name: siteConfig.name,
    },
    offers: {
      "@type": "Offer",
      price: product.price.toString(),
      priceCurrency: "RON",
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${siteConfig.url}/magazin/${product.slug}`,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating.toString(),
      reviewCount: product.reviewCount.toString(),
    },
  };
  return JSON.stringify(data);
}
