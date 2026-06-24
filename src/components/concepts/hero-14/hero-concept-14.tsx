import type { CSSProperties } from "react";

import { HeroTextGroup } from "@/components/concepts/shared/hero-text-group";
import { RunCompareStage } from "./run-compare-stage";

/**
 * Panel surface — always-dark, fixed Figma colors (panel `#1e2527`, hairline
 * border `#eff3f4`). `--primary` is scoped here for the light brand teal in case
 * the `.dark` scope needs it; the CTA itself lives in the light band above.
 */
const PANEL_STYLE = {
  background: "#1e2527",
  borderColor: "#eff3f4",
  "--primary": "#0c90a6",
  "--primary-foreground": "#ffffff",
} as CSSProperties;

/**
 * Hero concept 14 — the Figma "Self-driving CI" hardware/shard hero
 * (r77yKmqsK5pQU7jFQfOxTc: Scene A 342:3, Scene B 342:1364). Unlike hero-11, the
 * headline + waitlist form sit on the LIGHT page above the dark panel; only the
 * looping two-scene diagram lives in the panel. The hero column is locked to the
 * viewport height (below the global header): the text band takes its natural
 * height and the dark panel fills the rest, while the diagram CONTAIN-scales to
 * fit that panel on both axes — so the whole hero fits one screen without scroll.
 * On mobile the panel keeps a min-height floor and the diagram stacks (the page
 * may scroll), trading strict one-screen fit for legibility.
 */
export function HeroConcept14() {
  return (
    <section className="w-full bg-background">
      <div className="mx-auto flex min-h-[calc(100svh-7rem)] max-w-[1920px] flex-col pb-4 lg:min-h-[calc(100svh-8.25rem)]">
        {/* light title/CTA band — shares the header's exact frame (`max-w-none` +
            `px-6 md:px-12`) so the logo sits above the h1 and the nav above the form */}
        <HeroTextGroup className="shrink-0 max-w-none lg:px-12 lg:pt-12 lg:pb-8" />

        {/* dark diagram panel — breaks out wider than the content (Figma's 32px panel
            gutter vs the header-matched content gutter); fills the rest of the height */}
        <div
          className="dark relative mx-4 flex min-h-[26rem] flex-col overflow-hidden border text-white md:mx-8 lg:min-h-0 lg:flex-1"
          style={PANEL_STYLE}
        >
          {/* faint blueprint dot-grid — the Figma panel texture */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 overflow-hidden"
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle, rgba(215,234,237,0.1) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
                maskImage:
                  "radial-gradient(130% 110% at 50% 50%, #000 60%, transparent 100%)",
                WebkitMaskImage:
                  "radial-gradient(130% 110% at 50% 50%, #000 60%, transparent 100%)",
              }}
            />
          </div>

          <RunCompareStage className="z-10 flex-1" />
        </div>
      </div>
    </section>
  );
}
