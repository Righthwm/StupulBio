import type { MetadataRoute } from "next";
import { products } from "@/lib/products";
import { siteConfig } from "@/lib/seo";

/** XML sitemap served at /sitemap.xml — static pages + every product page. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const url = (path: string) => `${siteConfig.url}${path}`;

  const staticPages: MetadataRoute.Sitemap = [
    { url: url("/"), lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: url("/magazin"), lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: url("/despre-noi"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: url("/contact"), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: url("/termeni"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: url("/gdpr"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: url(`/magazin/${p.slug}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  return [...staticPages, ...productPages];
}
