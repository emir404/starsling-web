import type { MetadataRoute } from "next";

import { SITE_CONFIG } from "@/lib/site";

/**
 * robots.txt — allow the public site, keep crawlers out of the noindex
 * `/concepts/*` design explorations, and point at the generated sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/concepts/",
    },
    sitemap: `${SITE_CONFIG.url}/sitemap.xml`,
    host: SITE_CONFIG.url,
  };
}
