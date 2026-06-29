import type { CSSProperties } from "react";

import { HeroTextGroup } from "@/components/concepts/shared/hero-text-group";
import { RingConstellation } from "@/components/shared/ring-constellation";
import { RunCompareStage } from "./run-compare-stage";

/**
 * Panel surface — always-dark, the solid `--panel` ground (`#191f20`) shared with
 * the other dark diagram surfaces, with a subtle 12% white-alpha hairline border (a
 * fixed near-white `#eff3f4` flared into a harsh bright ring over the dark page). `--primary`
 * is scoped here for the light brand teal in case the `.dark` scope needs it; the
 * CTA itself lives in the light band above.
 */
const PANEL_STYLE = {
  background: "var(--panel)",
  borderColor: "rgba(215, 234, 237, 0.12)",
  "--primary": "#0c90a6",
  "--primary-foreground": "#ffffff",
} as CSSProperties;

/**
 * Hero concept 14 — the Figma "Self-driving CI" hardware/shard hero
 * (r77yKmqsK5pQU7jFQfOxTc: Scene A 342:3, Scene B 342:1364). Unlike hero-11, the
 * headline + waitlist form sit on the LIGHT page above the dark panel; only the
 * looping two-scene diagram lives in the panel. Rather than stretch to fill the
 * viewport (which left the diagram floating in a too-large canvas), the panel now
 * takes the diagram's own aspect ratio (CANVAS 1376×663, capped in height), so it
 * hugs the animation with just a little breathing room. On mobile the panel keeps
 * a min-height floor and the diagram stacks for legibility.
 */
export function HeroConcept14() {
  return (
    <section className="w-full bg-background">
      <div className="mx-auto flex max-w-[1920px] flex-col pb-4">
        {/* light title/CTA band — shares the header's exact frame (`max-w-none` +
            `px-6 md:px-12`) so the logo sits above the h1 and the nav above the form */}
        <HeroTextGroup className="shrink-0 max-w-none lg:px-12 lg:pt-12 lg:pb-8" />

        {/* dark diagram panel — breaks out wider than the content (Figma's 32px panel
            gutter vs the header-matched content gutter); sized to the diagram's own
            aspect ratio so it hugs the animation instead of floating in dead space */}
        <div
          className="dark relative mx-4 flex min-h-[24rem] flex-col overflow-hidden border text-white md:mx-8 lg:min-h-0 lg:aspect-[1376/663] lg:max-h-[640px]"
          style={PANEL_STYLE}
        >
          {/* sling-ring constellation — the Figma panel motif (350:2), kept faint
              and edge-masked so it sits behind the diagram without competing */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 overflow-hidden text-white/12"
            style={{
              maskImage:
                "radial-gradient(130% 110% at 50% 50%, #000 80%, transparent 100%)",
              WebkitMaskImage:
                "radial-gradient(130% 110% at 50% 50%, #000 80%, transparent 100%)",
            }}
          >
            <RingConstellation
              preset="a"
              className="absolute inset-0 h-full w-full"
            />
          </div>

          <RunCompareStage className="z-10 flex-1" />
        </div>
      </div>
    </section>
  );
}
