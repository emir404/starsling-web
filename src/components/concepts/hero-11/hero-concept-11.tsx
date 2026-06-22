import type { CSSProperties } from "react";

import { HeroTextGroup } from "@/components/concepts/shared/hero-text-group";
import { ParallelRunStage } from "./parallel-run-stage";
import { OrbitField } from "./orbit-field";

/**
 * Panel surface — always-dark, fixed Figma colors (panel `#191f20`, hairline
 * border `#eff3f4`). The CTA uses the *light* brand teal (`#0c90a6`) with white
 * text rather than the `.dark` palette's brighter brand, so `--primary` + its
 * foreground are scoped to the panel (its only consumer is the waitlist button).
 */
const PANEL_STYLE = {
  background: "#191f20",
  borderColor: "#eff3f4",
  "--primary": "#0c90a6",
  "--primary-foreground": "#ffffff",
} as CSSProperties;

/**
 * Hero concept 11 — a 1:1 build of the Figma "Self-driving CI" two-scene
 * parallel-run diagram (r77yKmqsK5pQU7jFQfOxTc: Scene 1 282:1367 / 282:1419,
 * Scene 2 282:1567 / 282:1619). Same framed dark panel as hero-10: a full-bleed
 * light page with a 1rem frame; the panel caps at 1920px, stays centered on
 * ultrawide and fills the screen below the global header, holding the shared
 * headline/form (top) over the looping two-scene diagram (below). The `dark`
 * scope + `text-white` give the un-classed headline/badge their white treatment.
 * The diagram lives in its own slightly-lighter card (`rgba(30,37,39,0.9)`) inset
 * from the panel — the Figma contrast surface — textured by a faint dot-grid and
 * a bottom-right radar-target overlay; the header zone above it stays plain.
 */
export function HeroConcept11() {
  return (
    <div className="w-full bg-background">
      <div className="mx-auto w-full max-w-[1920px] p-4">
        <div
          className="dark relative flex min-h-[calc(100svh-7rem)] flex-col overflow-hidden border text-white lg:min-h-[calc(100svh-8.25rem)]"
          style={PANEL_STYLE}
        >
          {/* shared headline/form — Figma panel insets (≈32px sides, flush top) */}
          <HeroTextGroup className="relative z-10 shrink-0 lg:px-8 lg:pt-16 lg:pb-6" />

          {/* illustration card — distinct surface (~rgb(29,37,38) over the #191f20
              panel), 16px insets, no border, clips the orbit. flex-1 fills the
              panel; the content-driven-height stage sits vertically centered
              inside, matching Figma. */}
          <div
            className="relative z-10 mx-4 mb-4 flex min-h-0 flex-1 items-center justify-center overflow-hidden"
            style={{ background: "rgba(30,37,39,0.9)" }}
          >
            {/* faint blueprint dot-grid — now textures the card surface */}
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
                    "radial-gradient(120% 120% at 50% 50%, #000 70%, transparent 100%)",
                  WebkitMaskImage:
                    "radial-gradient(120% 120% at 50% 50%, #000 70%, transparent 100%)",
                }}
              />
            </div>

            {/* faint radar-target overlay, bottom-right — behind the diagram */}
            <OrbitField />

            {/* diagram canvas — capped + centered to the text group's max width so
                it never outgrows the headline/form block on ultrawide screens */}
            <ParallelRunStage className="relative z-10 w-full max-w-[90rem]" />
          </div>
        </div>
      </div>
    </div>
  );
}
