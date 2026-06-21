"use client";

import { useState } from "react";

import { Highlight } from "@/components/shared/highlight";
import { TESTIMONIALS } from "@/content/testimonials";
import type { Testimonial } from "@/types/content";

/**
 * Testimonials — a centered pull-quote framed by decorative corner quote glyphs
 * (Figma node 234:748). The attribution row is a click-driven carousel: the
 * active testimonial shows a full author card, the rest appear as faded avatars
 * you can click to switch.
 */
export function Testimonials() {
  const [active, setActive] = useState(0);
  const current = TESTIMONIALS[active];

  return (
    <section
      id="testimonials"
      className="w-full border-y border-hairline bg-card px-6 sm:px-[60px]"
    >
      <div className="relative mx-auto flex min-h-[480px] w-full max-w-[1320px] items-center justify-center overflow-hidden border-x border-hairline py-16 sm:min-h-[580px]">
        {/* Decorative corner quote glyphs — desktop only */}
        <QuoteMark className="absolute left-[55px] top-[55px] hidden h-12 w-[60px] sm:block" />
        <QuoteMark className="absolute bottom-[56px] right-[55px] hidden h-12 w-[60px] rotate-180 sm:block" />

        <div className="flex w-full max-w-[877px] flex-col items-center gap-[52px] px-6 text-center">
          <p className="text-xl font-medium leading-[1.4] tracking-[-0.32px] text-foreground sm:text-[32px]">
            <QuoteText testimonial={current} />
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <AuthorCard testimonial={current} />
            {TESTIMONIALS.map((t, i) =>
              i === active ? null : (
                <button
                  key={t.author}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`Show testimonial from ${t.author}`}
                  className="size-16 shrink-0 overflow-hidden border border-hairline opacity-50 transition-opacity hover:opacity-80 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- small fixed-size avatar; next/image adds no value here */}
                  <img
                    src={t.avatarSrc}
                    alt={t.author}
                    width={64}
                    height={64}
                    className="size-full object-cover"
                  />
                </button>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Renders the quote, wrapping `highlight` (if present) in the teal marker. */
function QuoteText({ testimonial }: { testimonial: Testimonial }) {
  const { quote, highlight } = testimonial;
  if (!highlight || !quote.includes(highlight)) return <>{quote}</>;

  const [before, ...rest] = quote.split(highlight);
  return (
    <>
      {before}
      <Highlight>{highlight}</Highlight>
      {rest.join(highlight)}
    </>
  );
}

/** The active testimonial's author card: avatar + name/role + optional wordmark. */
function AuthorCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="relative flex w-[362px] max-w-full shrink-0 items-center gap-4 overflow-hidden border border-hairline bg-background">
      {/* eslint-disable-next-line @next/next/no-img-element -- small fixed-size avatar; next/image adds no value here */}
      <img
        src={testimonial.avatarSrc}
        alt={testimonial.author}
        width={64}
        height={64}
        className="size-16 shrink-0 border-r border-hairline object-cover"
      />
      <div className="flex flex-col gap-1 text-left">
        <span className="text-base font-medium leading-tight text-foreground">
          {testimonial.author}
        </span>
        <span className="text-sm leading-tight text-foreground/70">
          {testimonial.role}
        </span>
      </div>
      {testimonial.logoSrc ? (
        // eslint-disable-next-line @next/next/no-img-element -- static brand wordmark SVG; next/image adds no value for an inline vector
        <img
          src={testimonial.logoSrc}
          alt={`${testimonial.company} logo`}
          width={77}
          height={12}
          className="absolute right-[19px] top-1/2 h-3 w-[77px] -translate-y-1/2 dark:invert"
        />
      ) : null}
    </div>
  );
}

/**
 * Decorative double-quote glyph from the Figma (node 234:750) — two stylized
 * marks side by side in a faint muted teal. The closing quote reuses this with
 * `rotate-180`.
 */
function QuoteMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60.5 48.46"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      {[0, 33].map((dx) => (
        <g key={dx} transform={`translate(${dx} 0)`}>
          <path
            d="M2.68659 27.0573C1.18521 29.228 0.305733 31.8616 0.305733 34.7007C0.305733 42.1301 6.32851 48.1529 13.758 48.1529C21.1874 48.1529 27.2102 42.1301 27.2102 34.7007C27.2102 27.2712 21.1874 21.2484 13.758 21.2484C9.16755 21.2484 5.11415 23.5477 2.68659 27.0573ZM2.68659 27.0573L8.40765 0.305733H23.2357"
            stroke="#335252"
            strokeOpacity="0.35"
            strokeWidth="0.611465"
          />
          <circle
            cx="13.7577"
            cy="34.7007"
            r="8.86625"
            stroke="#335252"
            strokeOpacity="0.35"
            strokeWidth="0.611465"
          />
          <path
            d="M16.8149 34.7006C16.8149 36.3892 15.4461 37.758 13.7576 37.758C12.0691 37.758 10.7003 36.3892 10.7003 34.7006C10.7003 33.0121 12.0691 31.6433 13.7576 31.6433C15.4461 31.6433 16.8149 33.0121 16.8149 34.7006Z"
            fill="#335252"
            fillOpacity="0.35"
          />
          <path
            d="M13.7579 32.408C15.0241 32.4081 16.0509 33.4346 16.0509 34.7009C16.0507 35.9671 15.024 36.9938 13.7579 36.9939C12.4916 36.9939 11.4651 35.9672 11.4649 34.7009C11.4649 33.4346 12.4915 32.408 13.7579 32.408Z"
            stroke="#335252"
            strokeOpacity="0.35"
            strokeWidth="1.52866"
          />
        </g>
      ))}
    </svg>
  );
}
