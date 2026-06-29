import type { VideoSectionContent } from "@/types/content";

/**
 * Blog content model. Posts are authored as typed TypeScript modules (mirroring
 * the rest of `src/content`), not MDX — so the body is a list of structured
 * blocks rendered by `BlogBody` into the site's blueprint styling, with no extra
 * tooling or runtime parsing.
 */

/** An inline run of text. A bare string is plain text; the object form adds marks/links. */
export type BlogSpan =
  | string
  | {
      text: string;
      bold?: boolean;
      italic?: boolean;
      code?: boolean;
      /** Renders the run as a link. External hrefs open in a new tab. */
      href?: string;
    };

/** A section heading that also seeds the post's "On this page" table of contents. */
export type BlogHeadingBlock = {
  type: "heading";
  /** Anchor id — must be unique within the post. */
  id: string;
  text: string;
};

export type BlogParagraphBlock = { type: "paragraph"; spans: BlogSpan[] };

export type BlogListBlock = {
  type: "list";
  ordered?: boolean;
  /** Each item is its own run of spans. */
  items: BlogSpan[][];
};

export type BlogCodeBlock = { type: "code"; code: string; lang?: string };

/** A pull-quote (e.g. an embedded tweet, rendered as a styled blockquote). */
export type BlogQuoteBlock = { type: "quote"; quote: string; cite?: string };

export type BlogImageBlock = {
  type: "image";
  /** Path under /public. */
  src: string;
  alt: string;
  caption?: string;
  /** Intrinsic size (px) for aspect ratio + to avoid layout shift. */
  width: number;
  height: number;
};

/** A lead/inline video, played through the shared blueprint `VideoPlayer`. */
export type BlogVideoBlock = { type: "video"; video: VideoSectionContent };

export type BlogBlock =
  | BlogHeadingBlock
  | BlogParagraphBlock
  | BlogListBlock
  | BlogCodeBlock
  | BlogQuoteBlock
  | BlogImageBlock
  | BlogVideoBlock;

export type BlogAuthor = {
  name: string;
  /** Secondary line, e.g. "Co-founder & CEO, Starsling". */
  role: string;
  /** Optional avatar under /public. */
  avatarSrc?: string;
};

export type BlogPost = {
  /** URL segment under /blog. */
  slug: string;
  title: string;
  /** One-line summary for the index card + meta description. */
  excerpt: string;
  /** ISO date (e.g. "2026-04-30"); formatted for display in UTC. */
  date: string;
  author: BlogAuthor;
  /** Optional category/tag label shown as an eyebrow. */
  category?: string;
  /** Lead media shown under the title (and as the index card thumbnail when an image). */
  hero?: BlogVideoBlock | BlogImageBlock;
  body: BlogBlock[];
};