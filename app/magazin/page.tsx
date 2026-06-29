import type { Metadata } from "next";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { HexPattern } from "@/components/ui/HexPattern";
import { products } from "@/lib/products";
import { buildMetadata, breadcrumbSchema, siteConfig, jsonLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Magazin miere naturală — salcâm, tei, munte, polifloră",
  description:
    "Cumpără miere naturală online: salcâm, tei, munte, polifloră, mană și propolis. Miere bio românească, recoltată manual, extracție la rece. Comandă cu livrare 24–48h.",
  path: "/magazin",
  keywords: [
    "cumpără miere naturală online",
    "magazin miere bio",
    "miere poliflora",
    "produse apicole naturale",
  ],
});

/** ItemList of all products + breadcrumb, so Google can surface the category in search. */
function MagazinSchema() {
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Miere naturală și produse apicole — Fagurul de Aur",
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${siteConfig.url}/magazin/${p.slug}`,
      name: p.name,
    })),
  };
  const crumbs = breadcrumbSchema([
    { name: "Acasă", path: "/" },
    { name: "Magazin", path: "/magazin" },
  ]);
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLd([itemList, crumbs]) }}
    />
  );
}

export default function MagazinPage() {
  return (
    <div className="relative min-h-screen bg-bg-primary pt-20">
      <MagazinSchema />

      {/* Hero header */}
      <div className="relative bg-bg-secondary border-b border-gold-400/10 overflow-hidden">
        <HexPattern opacity={0.025} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <span className="block w-12 h-px bg-gold-400 mx-auto mb-5" aria-hidden="true" />
          <h1 className="font-heading text-text-primary">Magazin miere naturală</h1>
          <p className="text-text-secondary mt-4 max-w-2xl mx-auto">
            Toată mierea și produsele apicole Fagurul de Aur, recoltate manual din România. Miere
            crudă, neîncălzită și fără aditivi — de la <strong className="text-text-primary">miere de
            salcâm</strong> și <strong className="text-text-primary">miere de tei</strong>, la{" "}
            <strong className="text-text-primary">miere de munte</strong>,{" "}
            <strong className="text-text-primary">polifloră</strong> și propolis.
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ProductGrid />
      </div>
    </div>
  );
}
