"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * "On this page" table of contents with scroll-spy. Observes the post's heading
 * anchors and marks the topmost one in the upper band of the viewport as active.
 */
export function BlogToc({
  headings,
}: {
  headings: { id: string; text: string }[];
}) {
  const [active, setActive] = useState(headings[0]?.id ?? "");

  useEffect(() => {
    const els = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el !== null);
    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-96px 0px -70% 0px", threshold: 0 },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  return (
    <nav aria-label="On this page">
      <p className="mb-4 font-mono text-xs tracking-[0.04em] text-foreground/45 uppercase">
        On this page
      </p>
      <ul className="flex flex-col gap-1 border-l border-hairline">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={cn(
                "-ml-px block border-l-2 py-1 pl-4 text-sm leading-snug transition-colors",
                active === h.id
                  ? "border-brand font-medium text-foreground"
                  : "border-transparent text-foreground/55 hover:text-foreground",
              )}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
