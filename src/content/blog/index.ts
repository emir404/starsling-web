import type { BlogPost } from "@/types/blog";
import { announcingStarslingRunners } from "./announcing-starsling-runners";

/** Every blog post, newest first. Add new posts here as they ship. */
export const BLOG_POSTS: BlogPost[] = [announcingStarslingRunners];

export function getAllPosts(): BlogPost[] {
  return BLOG_POSTS;
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

/** Shared display formatter — fixed to UTC so the date never shifts by a day. */
export function formatPostDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));
}