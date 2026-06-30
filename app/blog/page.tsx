import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { HexPattern } from "@/components/ui/HexPattern";
import { blogPosts } from "@/lib/blog";
import { buildMetadata, breadcrumbSchema, siteConfig, jsonLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Blog despre miere naturală și apicultură",
  description:
    "Ghiduri și articole despre miere naturală: beneficii, miere crudă vs pasteurizată, cristalizare și cum recunoști mierea pură. Sfaturi de la o stupină din România.",
  path: "/blog",
  keywords: ["blog miere", "miere naturală", "apicultură", "beneficii miere", "raw honey"],
});

function BlogSchema() {
  const blog = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Blog Fagurul de Aur — miere naturală și apicultură",
    url: `${siteConfig.url}/blog`,
    inLanguage: "ro-RO",
    publisher: { "@id": `${siteConfig.url}/#organization` },
    blogPost: blogPosts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `${siteConfig.url}/blog/${p.slug}`,
      datePublished: p.date,
    })),
  };
  const crumbs = breadcrumbSchema([
    { name: "Acasă", path: "/" },
    { name: "Blog", path: "/blog" },
  ]);
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd([blog, crumbs]) }} />
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ro-RO", { day: "numeric", month: "long", year: "numeric" });
}

export default function BlogPage() {
  return (
    <div className="relative min-h-screen bg-bg-primary pt-20">
      <BlogSchema />

      {/* Header */}
      <div className="relative bg-bg-secondary border-b border-gold-400/10 overflow-hidden">
        <HexPattern opacity={0.025} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <span className="block w-12 h-px bg-gold-400 mx-auto mb-5" aria-hidden="true" />
          <h1 className="font-heading text-text-primary">Blog despre miere naturală</h1>
          <p className="text-text-secondary mt-4 max-w-2xl mx-auto">
            Ghiduri și articole despre miere naturală, produse apicole și apicultură — beneficii, miere crudă,
            cristalizare și cum recunoști mierea pură, direct de la stupina Fagurul de Aur.
          </p>
        </div>
      </div>

      {/* Posts */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {blogPosts.map((post) => (
            <article key={post.slug} className="card overflow-hidden flex flex-col">
              <Link href={`/blog/${post.slug}`} className="block relative aspect-[16/10] overflow-hidden bg-bg-surface">
                <Image
                  src={post.image}
                  alt={post.imageAlt}
                  fill
                  sizes="(max-width: 640px) 100vw, 480px"
                  className={`transition-transform duration-500 hover:scale-105 ${
                    post.image.includes("/products/") ? "object-contain p-3" : "object-cover"
                  }`}
                />
              </Link>
              <div className="p-5 flex flex-col flex-1">
                <div className="text-text-muted text-xs mb-2 flex items-center gap-2">
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                  <span aria-hidden="true">·</span>
                  <span>{post.readingMinutes} min citire</span>
                </div>
                <h2 className="font-heading text-text-primary text-xl mb-2">
                  <Link href={`/blog/${post.slug}`} className="hover:text-gold-300 transition-colors">
                    {post.h1}
                  </Link>
                </h2>
                <p className="text-text-secondary text-sm leading-relaxed flex-1">{post.excerpt}</p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-gold-300 text-sm font-medium mt-4 hover:underline"
                >
                  Citește articolul →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
