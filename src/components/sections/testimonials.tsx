"use client";

import { useRef, type CSSProperties } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Highlight } from "@/components/shared/highlight";
import { CASE_STUDY_SLUG_BY_COMPANY } from "@/content/customers";
import { TESTIMONIALS } from "@/content/testimonials";
import type { Testimonial, TestimonialMetric } from "@/types/content";

/** How much the marquee slows while hovered/focused (fraction of base speed). */
const HOVER_RATE = 0.3;

/** Seconds of scroll per card. Duration scales with card count so the per-card
 *  pace stays constant however many testimonials there are. */
const SECONDS_PER_CARD = 14;

/**
 * Testimonials — a horizontal marquee of full-width blueprint cards (Figma nodes
 * 282:488, 292:733, 292:161). Each card fills the 1320px window; the track scrolls
 * continuously so one card slides to the next, clipped at a hairline seam. The
 * list renders twice so translateX(-50%) loops seamlessly. On hover/focus the
 * marquee smoothly slows via the Web Animations API `playbackRate` (position-
 * preserving — no jump, unlike retiming the CSS duration); disabled under
 * prefers-reduced-motion.
 */
export function Testimonials() {
  // Rendered twice so the track loops seamlessly at translateX(-50%); the second
  // copy is aria-hidden so screen readers don't announce testimonials twice.
  const track = [...TESTIMONIALS, ...TESTIMONIALS];
  const trackRef = useRef<HTMLUListElement>(null);

  // translateX(-50%) advances the track by exactly TESTIMONIALS.length cards, so
  // duration = count × per-card keeps each card on screen the same length of time.
  const durationStyle = {
    "--marquee-duration": `${TESTIMONIALS.length * SECONDS_PER_CARD}s`,
  } as CSSProperties;

  // Drop/restore the marquee's playbackRate so it eases between fast and slow
  // without the visual jump that changing animation-duration would cause.
  const setRate = (rate: number) => {
    const animation = trackRef.current?.getAnimations()[0];
    if (animation) animation.playbackRate = rate;
  };

  return (
    <section
      id="testimonials"
      className="w-full border-y border-hairline bg-card px-6 sm:px-[60px]"
    >
      {/* @container so each card can size to one window width (100cqw) regardless
          of the w-max track width — the key to the one-card-at-a-time marquee. */}
      <div className="relative mx-auto w-full max-w-[1320px] overflow-hidden border-x border-hairline @container">
        <ul
          ref={trackRef}
          style={durationStyle}
          className="flex w-max [animation:marquee_var(--marquee-duration)_linear_infinite] motion-reduce:animate-none"
          onMouseEnter={() => setRate(HOVER_RATE)}
          onMouseLeave={() => setRate(1)}
          onFocusCapture={() => setRate(HOVER_RATE)}
          onBlurCapture={() => setRate(1)}
        >
          {track.map((t, i) => (
            <li
              key={`${t.author}-${i}`}
              aria-hidden={i >= TESTIMONIALS.length}
              className="w-[100cqw] shrink-0 border-r border-hairline"
            >
              <TestimonialCard testimonial={t} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** One full-width testimonial card: quote, attribution row, wordmark + orbit decor. */
function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const caseStudySlug = CASE_STUDY_SLUG_BY_COMPANY[testimonial.company];
  return (
    <figure className="relative flex min-h-[480px] flex-col justify-end gap-10 overflow-hidden px-6 pb-6 pt-20 sm:min-h-[524px] sm:gap-12 sm:p-14">
      {/* Company wordmark, top-right */}
      <div className="absolute right-6 top-6 z-10 sm:right-14 sm:top-14">
        <Wordmark testimonial={testimonial} />
      </div>

      {/* Decorative corner quote glyphs — desktop only */}
      <QuoteMark className="absolute left-6 top-6 z-0 hidden h-12 w-[60px] sm:left-14 sm:top-14 sm:block" />
      <QuoteMark className="absolute bottom-6 right-6 z-0 hidden h-12 w-[60px] rotate-180 sm:bottom-14 sm:right-14 sm:block" />

      <blockquote className="relative z-10 max-w-[1040px] text-xl font-medium leading-[1.4] tracking-[-0.32px] text-foreground sm:text-[32px]">
        <QuoteText testimonial={testimonial} />
      </blockquote>

      <figcaption className="relative z-10 flex flex-wrap items-stretch gap-3 sm:gap-4">
        <AuthorCard testimonial={testimonial} />
        {testimonial.metrics?.map((metric) => (
          <MetricChip key={metric.label} metric={metric} />
        ))}
        {caseStudySlug ? (
          <Link
            href={`/customers/${caseStudySlug}`}
            className="group/cs inline-flex items-center gap-1.5 self-center font-mono text-xs tracking-[0.04em] text-foreground/60 uppercase transition-colors hover:text-foreground"
          >
            Read the case study
            <ArrowUpRight className="size-3.5 transition-transform group-hover/cs:translate-x-0.5 group-hover/cs:-translate-y-0.5" />
          </Link>
        ) : null}
      </figcaption>
    </figure>
  );
}

/** Author lockup: avatar + name/role in a hairline-framed chip. */
function AuthorCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="flex w-[254px] max-w-full items-center gap-4 border border-hairline bg-background">
      {/* eslint-disable-next-line @next/next/no-img-element -- small fixed-size avatar; next/image adds no value here */}
      <img
        src={testimonial.avatarSrc}
        alt={testimonial.author}
        width={64}
        height={64}
        className="size-16 shrink-0 border-r border-hairline object-cover"
      />
      <div className="flex min-w-0 flex-col gap-1 pr-3 text-left">
        <span className="truncate text-base font-medium leading-tight text-foreground">
          {testimonial.author}
        </span>
        <span className="truncate text-sm leading-tight text-foreground/70">
          {testimonial.role}
        </span>
      </div>
    </div>
  );
}

/** A single stat chip: big mono figure + label/detail. */
function MetricChip({ metric }: { metric: TestimonialMetric }) {
  return (
    <div className="flex items-center gap-4 border border-brand/20 bg-brand/10 px-4 py-3.5">
      <span className="font-mono text-[28px] font-bold uppercase leading-none tracking-[-0.32px] text-brand sm:text-[32px]">
        {metric.value}
      </span>
      <div className="flex flex-col gap-1.5">
        <span className="text-base font-medium leading-none text-foreground">
          {metric.label}
        </span>
        <span className="text-sm leading-tight text-foreground/80">
          {metric.detail}
        </span>
      </div>
    </div>
  );
}

/** Company wordmark — the brand SVG when available, else the name as text. */
function Wordmark({ testimonial }: { testimonial: Testimonial }) {
  if (testimonial.logoSrc) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- static brand wordmark SVG; next/image adds no value for an inline vector
      <img
        src={testimonial.logoSrc}
        alt={`${testimonial.company} logo`}
        className="h-7 w-auto dark:invert"
      />
    );
  }
  return (
    <span className="font-sans text-2xl font-medium tracking-tight text-foreground">
      {testimonial.company}
    </span>
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
