import { CUSTOMER_LOGOS } from "@/content/testimonials";

/**
 * "Trusted by" band (Figma node 288:3570). A 120px hairline-framed row: the
 * label boxed on the left, and a horizontally scrolling marquee of monochrome
 * customer logos — each in its own hairline cell (node 288:3657) — clipped on
 * the right. Below `lg` the two halves stack (label over marquee). Logos invert
 * in dark mode.
 */
export function SocialProof() {
  // Rendered twice so the track loops seamlessly at translateX(-50%); the
  // second copy is aria-hidden so screen readers don't announce logos twice.
  const track = [...CUSTOMER_LOGOS, ...CUSTOMER_LOGOS];

  return (
    <section id="customers" className="w-full px-6 sm:px-[60px]">
      <div className="mx-auto flex w-full max-w-[1320px] flex-col border-x border-t border-b border-hairline lg:h-[120px] lg:flex-row">
        <div className="flex items-center justify-center px-14 py-8 lg:w-[480px] lg:shrink-0 lg:py-0">
          <p className="text-center text-sm text-foreground/80">
            Trusted by industry leaders &amp; fastest growing startups
          </p>
        </div>
        <div className="group relative h-[120px] overflow-hidden border-hairline lg:min-w-0 lg:flex-1 lg:border-l">
          <ul className="flex h-full w-max animate-marquee items-center group-hover:[animation-play-state:paused] motion-reduce:animate-none">
            {track.map((logo, i) => (
              <li
                key={`${logo.name}-${i}`}
                aria-hidden={i >= CUSTOMER_LOGOS.length}
                className="flex h-full w-[236px] shrink-0 items-center justify-center border-r border-hairline px-14"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- static logo SVGs; next/image adds no value for inline vectors */}
                <img
                  src={logo.src}
                  alt={logo.name}
                  width={logo.width}
                  height={logo.height}
                  className="h-7 w-auto dark:invert"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
