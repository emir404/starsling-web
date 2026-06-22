import type { CSSProperties } from "react";

import { HeroTextGroup } from "@/components/concepts/shared/hero-text-group";
import { TimelineStage } from "./timeline-stage";

/** Same fixed dark panel surface as hero-10/11 (panel `#191f20`, hairline border;
 *  the waitlist button uses the light brand teal, scoped via `--primary`). */
const PANEL_STYLE = {
  background: "#191f20",
  borderColor: "#eff3f4",
  "--primary": "#0c90a6",
  "--primary-foreground": "#ffffff",
} as CSSProperties;

/**
 * Hero concept 12 — "time-collapse timeline". Tells the efficiency story as
 * wall-clock duration: one long serial test-suite bar splits into five short
 * parallel shard bars that finish together, a clock counts down 13M 20S → 1M
 * 18S, and a "TIME SAVED" bracket spans the gap. Same framed dark panel +
 * contrast card + dot-grid as the live hero, holding the shared headline/form
 * over the looping timeline.
 */
export function HeroConcept12() {
  return (
    <div className="w-full bg-background">
      <div className="mx-auto w-full max-w-[1920px] p-4">
        <div
          className="dark relative flex min-h-[calc(100svh-7rem)] flex-col overflow-hidden border text-white lg:min-h-[calc(100svh-8.25rem)]"
          style={PANEL_STYLE}
        >
          <HeroTextGroup className="relative z-10 shrink-0 lg:px-8 lg:pt-16 lg:pb-6" />

          {/* illustration card — distinct lighter surface, dot-grid texture */}
          <div
            className="relative z-10 mx-4 mb-4 flex min-h-0 flex-1 items-center justify-center overflow-hidden"
            style={{ background: "rgba(30,37,39,0.9)" }}
          >
            <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, rgba(215,234,237,0.1) 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                  maskImage: "radial-gradient(120% 120% at 50% 50%, #000 70%, transparent 100%)",
                  WebkitMaskImage:
                    "radial-gradient(120% 120% at 50% 50%, #000 70%, transparent 100%)",
                }}
              />
            </div>

            <TimelineStage className="relative z-10 w-full max-w-[90rem]" />
          </div>
        </div>
      </div>
    </div>
  );
}
