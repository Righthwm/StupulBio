import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo";

/** Allow crawling of all public pages; keep private/transactional routes out of the index. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/dashboard", "/checkout", "/login", "/register", "/api/", "/payment/"],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
