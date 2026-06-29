import type { Metadata } from "next";

import { BlogIndex } from "@/components/blog/blog-index-view";
import { getAllPosts } from "@/content/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "News, deep dives, and product updates from the Starsling team — making CI self-driving.",
};

export default function BlogPage() {
  return <BlogIndex posts={getAllPosts()} />;
}
