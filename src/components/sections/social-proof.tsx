import { CUSTOMER_LOGOS } from "@/content/testimonials";

/**
 * "Trusted by" logo strip (Figma node 234:314). A hairline-framed band — 1px
 * border on the sides + top — with a centered label above a 4+3 grid of
 * monochrome customer logos that invert in dark mode.
 */
export function SocialProof() {
  return (
    <section id="customers" className="w-full px-6 sm:px-[60px]">
      <div className="mx-auto flex w-full max-w-[1320px] flex-col items-center gap-14 border-x border-t border-hairline px-6 py-16 sm:px-14 sm:py-20">
        <p className="text-center text-sm text-foreground/80">
          Trusted by industry leaders &amp; fastest growing startups
        </p>
        <ul className="flex max-w-[600px] flex-wrap items-center justify-center gap-x-12 gap-y-10">
          {CUSTOMER_LOGOS.map((logo) => (
            <li key={logo.name}>
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
    </section>
  );
}
