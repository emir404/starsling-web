import { HeroTextGroup } from "@/components/concepts/shared/hero-text-group";
import { TimelineBand } from "./timeline-band";

/**
 * Hero concept 2 — Figma 204:5607 / 204:5805 / 204:6034. The shared text group
 * over an animated CI timeline that tells the run beat by beat: PR lands →
 * analyzing → diff/CI resolve → parallel runners → build passed. Fills the
 * viewport below the sticky header (h-20 mobile, 6.25rem at lg); the
 * min-height floor lets short viewports scroll instead of crushing the band.
 */
export function HeroConcept2() {
  return (
    <div className="relative flex h-[calc(100svh-5rem)] min-h-[44rem] flex-col overflow-hidden bg-header lg:h-[calc(100svh-6.25rem)]">
      <HeroTextGroup className="relative z-10 shrink-0" />
      <TimelineBand />
    </div>
  );
}
