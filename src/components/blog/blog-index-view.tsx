import { BlueprintColumn } from "@/components/shared/blueprint-strip";
import { Eyebrow } from "@/components/shared/eyebrow";
import type { BlogPost } from "@/types/blog";
import { BlogPostCard } from "./blog-post-card";

export function BlogIndex({ posts }: { posts: BlogPost[] }) {
  return (
    <div className="w-full px-6 sm:px-[60px]">
      <div className="relative mx-auto w-full max-w-[1320px] overflow-hidden border-x border-t border-hairline px-6 py-16 sm:px-14 sm:py-24">
        {/* faint motif side rails (Figma 102:11, teal on light) */}
        <BlueprintColumn
          count={5}
          className="pointer-events-none absolute top-16 left-3 hidden text-[#334d52]/60 lg:flex"
        />
        <BlueprintColumn
          count={5}
          className="pointer-events-none absolute top-16 right-3 hidden text-[#334d52]/60 lg:flex"
        />

        <header className="relative mx-auto max-w-2xl text-center">
          <Eyebrow>The Starsling Blog</Eyebrow>
          <h1 className="mt-4 font-heading text-[2.5rem] leading-[1.05] font-medium tracking-[-0.03em] text-balance sm:text-[3.25rem]">
            News, deep dives &amp; product updates
          </h1>
          <p className="mt-4 text-pretty text-foreground/70">
            How we&rsquo;re making CI self-driving — launches, engineering write-ups,
            and what we&rsquo;re learning along the way.
          </p>
        </header>

        <div className="relative mx-auto mt-14 flex max-w-[940px] flex-col gap-6">
          {posts.map((post) => (
            <BlogPostCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
