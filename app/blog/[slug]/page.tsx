import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { HexPattern } from "@/components/ui/HexPattern";
import { blogPosts, getPostMeta } from "@/lib/blog";
import { articles } from "@/components/blog/articles";
import { buildMetadata, blogPostingSchema, breadcrumbSchema, jsonLd } from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostMeta(slug);
  if (!post) return { title: "Articol negăsit" };
  const base = buildMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    image: post.image,
    keywords: post.keywords,
  });
  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
    },
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ro-RO", { day: "numeric", month: "long", year: "numeric" });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostMeta(slug);
  const Article = articles[slug];
  if (!post || !Article) notFound();

  const schema = jsonLd([
    blogPostingSchema(post),
    breadcrumbSchema([
      { name: "Acasă", path: "/" },
      { name: "Blog", path: "/blog" },
      { name: post.h1, path: `/blog/${post.slug}` },
    ]),
  ]);

  const related = blogPosts.filter((p) => p.slug !== slug).slice(0, 2);

  return (
    <div className="relative min-h-screen bg-bg-primary pt-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />

      {/* Breadcrumb */}
      <div className="relative bg-bg-secondary border-b border-gold-400/10 overflow-hidden">
        <HexPattern opacity={0.02} />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-xs text-text-muted">
              <li><Link href="/" className="hover:text-gold-300 transition-colors">Acasă</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/blog" className="hover:text-gold-300 transition-colors">Blog</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-text-secondary truncate max-w-[60vw]" aria-current="page">{post.h1}</li>
            </ol>
          </nav>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <header className="mb-8">
          <div className="text-text-muted text-xs mb-3 flex items-center gap-2">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span aria-hidden="true">·</span>
            <span>{post.readingMinutes} min citire</span>
          </div>
          <h1 className="font-heading text-text-primary" style={{ fontSize: "clamp(1.9rem,4vw,2.8rem)" }}>
            {post.h1}
          </h1>
        </header>

        {/* Cover image */}
        <div className="relative aspect-[16/9] rounded-sm overflow-hidden bg-bg-surface border border-gold-400/10 mb-10">
          <Image
            src={post.image}
            alt={post.imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className={post.image.includes("/products/") ? "object-contain p-4" : "object-cover"}
            priority
          />
        </div>

        {/* Body */}
        <div className="article-body">
          <Article />
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-16 pt-10 border-t border-gold-400/10">
            <h2 className="font-heading text-text-primary text-xl mb-5">Citește și</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={`/blog/${r.slug}`}
                    className="block card p-4 hover:border-gold-400/40 transition-colors h-full"
                  >
                    <span className="font-heading text-text-primary text-base block mb-1">{r.h1}</span>
                    <span className="text-text-muted text-sm">{r.readingMinutes} min citire</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </article>
    </div>
  );
}
