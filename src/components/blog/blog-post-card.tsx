import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Eyebrow } from "@/components/shared/eyebrow";
import { formatPostDate } from "@/content/blog";
import type { BlogPost } from "@/types/blog";

function thumbSrc(post: BlogPost): string | null {
  if (post.hero?.type === "image") return post.hero.src;
  if (post.hero?.type === "video") return post.hero.video.poster;
  return null;
}

export function BlogPostCard({ post }: { post: BlogPost }) {
  const src = thumbSrc(post);

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block transition-colors hover:bg-band"
    >
      <div className="grid gap-5 p-4 sm:grid-cols-[300px_1fr] sm:gap-7 sm:p-5">
        {/* thumbnail (clean band placeholder when a post has no hero media) */}
        <div className="relative aspect-video overflow-hidden border border-hairline">
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element -- static poster/thumb
            <img
              src={src}
              alt=""
              className="absolute inset-0 size-full object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-band">
              <span className="font-heading text-lg font-medium tracking-tight text-foreground/25">
                Starsling
              </span>
            </div>
          )}
        </div>

        {/* meta */}
        <div className="flex flex-col">
          <Eyebrow>
            {[post.category, formatPostDate(post.date)]
              .filter(Boolean)
              .join(" · ")}
          </Eyebrow>
          <h3 className="mt-3 font-heading text-xl leading-snug font-medium tracking-[-0.01em] text-balance text-foreground transition-colors group-hover:text-brand sm:text-2xl">
            {post.title}
          </h3>
          <p className="mt-3 line-clamp-3 leading-[1.6] text-foreground/70">
            {post.excerpt}
          </p>
          <span className="mt-auto inline-flex items-center gap-1 pt-5 font-mono text-xs tracking-[0.04em] text-foreground/55 uppercase transition-colors group-hover:text-foreground">
            Read post
            <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
