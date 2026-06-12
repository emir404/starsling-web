import { HeroTextGroup } from "@/components/concepts/shared/hero-text-group";
import { OrbitField } from "./orbit-field";
import { PipelineBand } from "./pipeline-band";

/**
 * Hero concept 4 — Figma 204:6485 / 204:6556 / 204:6612. The shared text
 * group over a splitting pipeline band: the three frames are keyframes of one
 * looping run — INPUT alone, split for PARALLEL EXECUTION, split again for
 * OUTPUT — with the orbit field showing through around the panels. Fills the
 * viewport below the sticky header.
 */
export function HeroConcept4() {
  return (
    <div className="relative flex h-[calc(100svh-5rem)] min-h-[44rem] flex-col overflow-hidden bg-header lg:h-[calc(100svh-6.25rem)]">
      <OrbitField />
      <HeroTextGroup className="relative z-10 shrink-0" />
      <PipelineBand />
    </div>
  );
}
