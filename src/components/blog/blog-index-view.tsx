import { Eyebrow } from "@/components/shared/eyebrow";
import type { BlogPost } from "@/types/blog";
import { BlogPostCard } from "./blog-post-card";

export function BlogIndex({ posts }: { posts: BlogPost[] }) {
  return (
    <div className="w-full px-6 sm:px-[60px]">
      {/* Self-contained framed column: border-t under the header, border-b closing
          it above the footer — every edge a single hairline. */}
      <div className="mx-auto w-full max-w-[1320px] border-x border-y border-hairline px-6 py-16 sm:px-14 sm:py-24">
        <header className="mx-auto max-w-2xl text-center">
          <Eyebrow>The Starsling Blog</Eyebrow>
          <h1 className="mt-4 font-heading text-[2.5rem] leading-[1.05] font-medium tracking-[-0.03em] text-balance sm:text-[3.25rem]">
            News, deep dives &amp; product updates
          </h1>
          <p className="mt-4 text-pretty text-foreground/70">
            How we&rsquo;re making CI self-driving — launches, engineering
            write-ups, and what we&rsquo;re learning along the way.
          </p>
        </header>

        {/* Posts as a single bordered stack with hairline dividers (connected rows,
            not floating cards). */}
        <div className="mx-auto mt-14 max-w-[940px] divide-y divide-hairline border border-hairline">
          {posts.map((post) => (
            <BlogPostCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
