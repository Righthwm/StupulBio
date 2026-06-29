import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductDetail } from "@/components/shop/ProductDetail";
import { getProductBySlug, products } from "@/lib/products";
import { generateProductMetadata, generateProductStructuredData, breadcrumbSchema, jsonLd } from "@/lib/seo";
import { HexPattern } from "@/components/ui/HexPattern";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Produs negăsit" };
  return generateProductMetadata(product);
}

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const structuredData = generateProductStructuredData(product);
  const crumbs = jsonLd(
    breadcrumbSchema([
      { name: "Acasă", path: "/" },
      { name: "Magazin", path: "/magazin" },
      { name: product.name, path: `/magazin/${product.slug}` },
    ])
  );

  return (
    <div className="relative min-h-screen bg-bg-primary pt-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: crumbs }} />

      {/* Breadcrumb header */}
      <div className="relative bg-bg-secondary border-b border-gold-400/10 overflow-hidden">
        <HexPattern opacity={0.02} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-xs text-text-muted">
              <li>
                <a href="/" className="hover:text-gold-300 transition-colors">Acasă</a>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <a href="/magazin" className="hover:text-gold-300 transition-colors">Magazin</a>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-text-secondary" aria-current="page">{product.name}</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ProductDetail product={product} />
      </div>
    </div>
  );
}
