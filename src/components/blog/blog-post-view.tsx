import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Eyebrow } from "@/components/shared/eyebrow";
import { VideoPlayer } from "@/components/sections/video-player";
import { buttonVariants } from "@/components/ui/button";
import { formatPostDate } from "@/content/blog";
import { SITE_CONFIG } from "@/lib/site";
import { cn } from "@/lib/utils";
import type { BlogPost, BlogVideoBlock, BlogImageBlock } from "@/types/blog";
import { BlogBody } from "./blog-body";
import { BlogShare } from "./blog-share";
import { BlogToc } from "./blog-toc";

/** Two-letter monogram fallback for the author lockup (no avatar asset needed). */
function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function HeroMedia({ hero }: { hero: BlogVideoBlock | BlogImageBlock }) {
  if (hero.type === "video") {
    return (
      <div className="mt-10 border border-hairline p-2.5 sm:p-3">
        <VideoPlayer
          src={hero.video.src}
          poster={hero.video.poster}
          label={hero.video.label}
        />
      </div>
    );
  }
  return (
    <figure className="mt-10 overflow-hidden border border-hairline bg-band">
      {/* eslint-disable-next-line @next/next/no-img-element -- static hero image; intrinsic dims supplied */}
      <img
        src={hero.src}
        alt={hero.alt}
        width={hero.width}
        height={hero.height}
        className="block h-auto w-full"
      />
    </figure>
  );
}

export function BlogPostView({ post }: { post: BlogPost }) {
  const headings = post.body
    .filter((b) => b.type === "heading")
    .map((b) => ({ id: b.id, text: b.text }));

  return (
    <article className="w-full px-6 sm:px-[60px]">
      <div className="mx-auto w-full max-w-[1320px] border-x border-y border-hairline px-6 py-12 sm:px-14 sm:py-16">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.04em] text-foreground/55 uppercase transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Back to blog
        </Link>

        <div className="mt-10 lg:flex lg:justify-center lg:gap-12">
          {/* reading column */}
          <div className="w-full max-w-[760px]">
            <header>
              <Eyebrow>
                {[post.category, formatPostDate(post.date)]
                  .filter(Boolean)
                  .join(" · ")}
              </Eyebrow>
              <h1 className="mt-4 font-heading text-[2.25rem] leading-[1.08] font-medium tracking-[-0.03em] text-balance sm:text-[3rem]">
                {post.title}
              </h1>
              <div className="mt-7 flex items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center bg-brand/15 font-mono text-sm font-medium text-brand">
                  {initials(post.author.name)}
                </span>
                <div className="leading-tight">
                  <p className="text-sm font-medium text-foreground">
                    {post.author.name}
                  </p>
                  <p className="text-sm text-foreground/60">{post.author.role}</p>
                </div>
              </div>
            </header>

            {post.hero ? <HeroMedia hero={post.hero} /> : null}

            <div className="mt-10">
              <BlogBody blocks={post.body} />
            </div>

            {/* divider + share + CTA */}
            <div aria-hidden className="mt-14 mb-10 border-t border-hairline" />

            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={SITE_CONFIG.links.github}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(buttonVariants())}
                >
                  Get Started For Free
                </a>
                <Link
                  href={SITE_CONFIG.links.waitlist}
                  className={cn(buttonVariants({ variant: "outline" }))}
                >
                  Join the waitlist
                </Link>
              </div>
              <BlogShare slug={post.slug} title={post.title} />
            </div>
          </div>

          {/* sticky table of contents */}
          {headings.length > 0 ? (
            <aside className="mt-12 hidden shrink-0 lg:mt-0 lg:block lg:w-[212px]">
              <div className="sticky top-28">
                <BlogToc headings={headings} />
              </div>
            </aside>
          ) : null}
        </div>
      </div>
    </article>
  );
}
