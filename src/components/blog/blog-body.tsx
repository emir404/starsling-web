import type { ReactNode } from "react";

import { VideoPlayer } from "@/components/sections/video-player";
import { cn } from "@/lib/utils";
import type { BlogBlock, BlogSpan } from "@/types/blog";

/* ------------------------------- inline spans ------------------------------ */

function Span({ span }: { span: BlogSpan }) {
  if (typeof span === "string") return <>{span}</>;

  let node: ReactNode = span.text;
  if (span.code)
    node = (
      <code className="bg-foreground/[0.06] px-1.5 py-0.5 font-mono text-[0.875em] text-foreground">
        {node}
      </code>
    );
  if (span.italic) node = <em>{node}</em>;
  if (span.bold) node = <strong className="font-semibold text-foreground">{node}</strong>;
  if (span.href) {
    const external = /^https?:\/\//.test(span.href);
    node = (
      <a
        href={span.href}
        className="font-medium text-brand underline decoration-brand/30 underline-offset-[3px] transition-colors hover:decoration-brand"
        {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      >
        {node}
      </a>
    );
  }
  return <>{node}</>;
}

function Spans({ spans }: { spans: BlogSpan[] }) {
  return (
    <>
      {spans.map((span, i) => (
        <Span key={i} span={span} />
      ))}
    </>
  );
}

/* ---------------------------------- blocks --------------------------------- */

/** Code card with a faint top lang bar; lines prefixed +/- get diff coloring. */
function CodeBlock({ code, lang }: { code: string; lang?: string }) {
  const lines = code.replace(/\n$/, "").split("\n");
  return (
    <div className="my-7 overflow-hidden border border-hairline bg-band">
      {lang ? (
        <div className="border-b border-hairline px-4 py-2 font-mono text-xs tracking-[0.04em] text-foreground/45 uppercase">
          {lang}
        </div>
      ) : null}
      <pre className="overflow-x-auto py-3 font-mono text-sm leading-[1.7]">
        <code className="block">
          {lines.map((line, i) => {
            const add = line.startsWith("+");
            const rm = line.startsWith("-");
            return (
              <span
                key={i}
                className={cn(
                  "block px-4",
                  add && "bg-[rgba(12,144,166,0.12)] text-[#096d7d] dark:text-[#4fbfd1]",
                  rm && "bg-[rgba(239,68,68,0.1)] text-[#b91c1c] dark:text-[#ed9696]",
                  !add && !rm && "text-foreground/80",
                )}
              >
                {line || " "}
              </span>
            );
          })}
        </code>
      </pre>
    </div>
  );
}

function Block({ block }: { block: BlogBlock }) {
  switch (block.type) {
    case "heading":
      return (
        <h2
          id={block.id}
          className="mt-14 mb-5 scroll-mt-28 font-heading text-[1.6rem] font-medium tracking-[-0.02em] text-foreground sm:text-[1.875rem]"
        >
          {block.text}
        </h2>
      );

    case "paragraph":
      return (
        <p className="my-5 text-[1.0625rem] leading-[1.75] text-foreground/80">
          <Spans spans={block.spans} />
        </p>
      );

    case "list": {
      const Tag = block.ordered ? "ol" : "ul";
      return (
        <Tag className="my-5 flex flex-col gap-2.5">
          {block.items.map((item, i) => (
            <li
              key={i}
              className="relative pl-6 text-[1.0625rem] leading-[1.7] text-foreground/80 before:absolute before:top-[0.7em] before:left-0 before:size-[7px] before:bg-brand"
            >
              <Spans spans={item} />
            </li>
          ))}
        </Tag>
      );
    }

    case "code":
      return <CodeBlock code={block.code} lang={block.lang} />;

    case "quote":
      return (
        <figure className="my-8 border-l-2 border-brand bg-brand/[0.04] py-4 pr-4 pl-6">
          <blockquote className="font-heading text-xl leading-[1.4] font-medium tracking-[-0.01em] text-balance text-foreground">
            “{block.quote}”
          </blockquote>
          {block.cite ? (
            <figcaption className="mt-3 font-mono text-xs tracking-[0.02em] text-foreground/55 uppercase">
              — {block.cite}
            </figcaption>
          ) : null}
        </figure>
      );

    case "image":
      return (
        <figure className="my-8">
          <div className="overflow-hidden border border-hairline bg-band">
            {/* eslint-disable-next-line @next/next/no-img-element -- static post image; intrinsic dims supplied for aspect ratio */}
            <img
              src={block.src}
              alt={block.alt}
              width={block.width}
              height={block.height}
              loading="lazy"
              className="block h-auto w-full"
            />
          </div>
          {block.caption ? (
            <figcaption className="mt-3 text-center font-mono text-xs tracking-[0.02em] text-foreground/55">
              {block.caption}
            </figcaption>
          ) : null}
        </figure>
      );

    case "video":
      return (
        <div className="my-8 border border-hairline p-2.5 sm:p-3">
          <VideoPlayer
            src={block.video.src}
            poster={block.video.poster}
            label={block.video.label}
          />
        </div>
      );
  }
}

export function BlogBody({ blocks }: { blocks: BlogBlock[] }) {
  return (
    <div>
      {blocks.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </div>
  );
}
