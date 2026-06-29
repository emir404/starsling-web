import type { MetadataRoute } from "next";

import { SITE_CONFIG } from "@/lib/site";
import { getAllPosts } from "@/content/blog";
import { getAllCustomers } from "@/content/customers";

/**
 * Generated sitemap. Lists the indexable surface only — the `/concepts/*` design
 * explorations are noindex and deliberately excluded (also disallowed in robots).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_CONFIG.url;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/pricing`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/blog`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/customers`, changeFrequency: "monthly", priority: 0.7 },
  ];

  const posts: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: post.date,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const customers: MetadataRoute.Sitemap = getAllCustomers().map((customer) => ({
    url: `${base}/customers/${customer.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...posts, ...customers];
}
