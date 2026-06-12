import { HeroTextGroup } from "@/components/concepts/shared/hero-text-group";
import { TimelineCameraBand } from "./timeline-camera-band";

/**
 * Hero concept 3 — Figma 217:1249. Concept 2's beat-by-beat CI timeline, but
 * rendered big and full bleed: the canvas overflows the right edge and the
 * camera pans along with the run. Fills the viewport below the sticky header.
 */
export function HeroConcept3() {
  return (
    <div className="relative flex h-[calc(100svh-5rem)] min-h-[44rem] flex-col overflow-hidden bg-header lg:h-[calc(100svh-6.25rem)]">
      <HeroTextGroup className="relative z-10 shrink-0" />
      <TimelineCameraBand />
    </div>
  );
}
