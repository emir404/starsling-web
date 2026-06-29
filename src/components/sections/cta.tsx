import { CTA_CONTENT } from "@/content/cta";
import { CtaForm } from "@/components/sections/cta-form";
import { CtaEditorStage } from "@/components/sections/cta-editor-stage";
import { RingConstellation } from "@/components/shared/ring-constellation";

/**
 * Eased (smoothstep) top fade for the gradient — transparency (a mask), not a
 * colour — so the band dissolves into the section above in BOTH light and dark
 * themes. (A colour fade to `--background` turned black in dark mode.) The eased
 * alpha curve ramps slowly at both ends, so there's no banded "line" that a plain
 * linear ramp leaves. The fade now spans the FULL height — a continuous smoothstep
 * from transparent at the top to the solid #191F20 only at the very bottom edge —
 * so the band reads mostly page-light, deepening to #191F20 behind the heading + form.
 */
const BG_MASK =
  "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.04) 12.5%, rgba(0,0,0,0.16) 25%, rgba(0,0,0,0.32) 37.5%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.68) 62.5%, rgba(0,0,0,0.84) 75%, rgba(0,0,0,0.96) 87.5%, #000 100%)";

/**
 * Closing CTA band (Figma node 282:883). A full-bleed band on the solid #191F20
 * panel with the sling-ring constellation motif behind it and the light
 * `.github/workflows/ci.yml` runner-swap editor card across the top (the shared
 * `EditorCard`, scaled to the Figma size) dissolving into the panel via a mask,
 * the heading bottom-left and the sub-line + waitlist form bottom-right,
 * all in white. The background spans the full viewport width while the content
 * stays aligned to the site's 1320px grid; the top edge fades into the page
 * background for a clean seam.
 *
 * Keeps id="waitlist" so SITE_CONFIG.links.waitlist (nav + hero) anchors here;
 * rendered as the closing band on the home, features, customers, and pricing
 * pages.
 */
export function Cta() {
  return (
    <section
      id="waitlist"
      className="relative isolate w-full overflow-hidden text-white"
    >
      {/* Backdrop: the solid #191F20 panel, its top edge masked to transparency
          (BG_MASK) so the band dissolves into the near-white section above. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-panel"
        style={{
          maskImage: BG_MASK,
          WebkitMaskImage: BG_MASK,
        }}
      />
      {/* Sling-ring constellation over the panel — visible, fading in with the band. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden text-white/12"
        style={{ maskImage: BG_MASK, WebkitMaskImage: BG_MASK }}
      >
        <RingConstellation preset="a" className="absolute inset-0 h-full w-full" />
      </div>

      {/* Content centered to the 1320px grid; card up top, heading + form pinned
          to the bottom. The large top padding matches the design, where the card
          sits ~30% down over the bright top of the mesh. */}
      <div className="relative z-10 mx-auto flex min-h-[560px] w-full max-w-[1320px] flex-col justify-between gap-12 px-6 pt-28 pb-14 sm:px-14 sm:pt-32 sm:pb-20 lg:min-h-[900px] lg:pt-[210px]">
        <CtaEditorStage />

        {/* Heading (left) + sub-line & form (right), bottom-aligned on desktop. */}
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
          <h2 className="max-w-[462px] font-heading text-[2.75rem] font-medium leading-[1.15] tracking-[-0.04em] text-white sm:text-[3.5rem] lg:text-[4rem]">
            {CTA_CONTENT.title}
          </h2>
          <div className="flex flex-col gap-5">
            <p className="max-w-[379px] text-lg leading-[1.4] text-white/80">
              {CTA_CONTENT.subtitle}
            </p>
            <CtaForm />
          </div>
        </div>
      </div>
    </section>
  );
}
