import type { CSSProperties } from "react";

import { HeroTextGroup } from "@/components/concepts/shared/hero-text-group";
import { ParallelRunStage } from "./parallel-run-stage";

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
 * scope + `text-white` give the un-classed headline/badge their white treatment;
 * a faint dot-grid sits behind, matching the Figma panel texture.
 */
export function HeroConcept11() {
  return (
    <div className="w-full bg-background">
      <div className="mx-auto w-full max-w-[1920px] p-4">
        <div
          className="dark relative flex min-h-[calc(100svh-7rem)] flex-col overflow-hidden border text-white lg:min-h-[calc(100svh-8.25rem)]"
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

          {/* shared headline/form — Figma panel insets (≈32px sides, flush top) */}
          <HeroTextGroup className="relative z-10 shrink-0 lg:px-8 lg:pt-16 lg:pb-6" />
          {/* diagram canvas — capped + centered to the text group's max width so it
              never outgrows the headline/form block on ultrawide screens */}
          <ParallelRunStage className="relative z-10 mx-auto w-full max-w-[90rem]" />
        </div>
      </div>
    </div>
  );
}
