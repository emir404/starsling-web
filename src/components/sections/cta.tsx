import { CTA_CONTENT } from "@/content/cta";
import { CtaForm } from "@/components/sections/cta-form";

/**
 * Closing CTA band (Figma node 234:1143). A hairline-framed full-bleed band:
 * heading at the top and a sub-line + waitlist form at the bottom on the left,
 * with a teal "blueprint" decoration — gradient plus a floating white card —
 * on the right (desktop only).
 *
 * The decoration uses exact assets exported from Figma (public/cta/*); the band
 * is built inline with the 1px hairline frame (not the 3px teal `Section` rails)
 * to match the design, mirroring `SocialProof`. Keeps id="waitlist" so
 * SITE_CONFIG.links.waitlist (used by the nav + hero) anchors here.
 */
export function Cta() {
  return (
    <section id="waitlist" className="w-full px-6 sm:px-[60px]">
      <div className="relative mx-auto w-full max-w-[1320px] overflow-hidden border border-hairline px-6 py-12 sm:px-14 sm:py-14 xl:min-h-[532px]">
        {/* Left column: heading (top) + sub-line & form (bottom) */}
        <div className="relative z-10 flex max-w-[520px] flex-col gap-10 xl:min-h-[calc(532px-7rem)] xl:justify-between">
          <h2 className="max-w-[462px] text-balance font-heading text-[2.75rem] font-medium leading-[1.15] tracking-[-0.04em] sm:text-[3.5rem] lg:text-[4rem]">
            {CTA_CONTENT.title}
          </h2>
          <div className="flex flex-col gap-5">
            <p className="max-w-[379px] text-lg leading-[1.4] text-foreground/80">
              {CTA_CONTENT.subtitle}
            </p>
            <CtaForm />
          </div>
        </div>

        {/* Right decoration (desktop only): exact Figma assets + floating card */}
        <div
          aria-hidden
          className="pointer-events-none absolute right-0 top-0 hidden h-full w-[687px] overflow-hidden xl:block"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- static decoration raster exported from Figma */}
          <img
            src="/cta/cta-gradient.png"
            alt=""
            className="absolute inset-0 size-full object-cover"
          />
          <div className="absolute left-1/2 top-1/2 h-[314px] w-[504px] -translate-x-1/2 -translate-y-1/2 rounded-[24px] bg-card shadow-[0px_0px_36px_0px_rgba(8,13,13,0.15)]" />
        </div>
      </div>
    </section>
  );
}
