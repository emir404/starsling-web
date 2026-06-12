import { OrbitField } from "@/components/concepts/hero-4/orbit-field";
import { BlueprintStage } from "./blueprint-stage";
import { HeroTextStack } from "./hero-text-stack";
import { LogoStrip } from "./logo-strip";

/**
 * Hero concept 5 — Figma 211:2 / 212:122 / 212:231. A stacked text column
 * with the social-proof logo strip on the left; on the right, white cards
 * materialize on a graph-paper grid as the run progresses — INPUT, PARALLEL
 * EXEC., OUTPUT — over the shared orbit field. The text overlays the stage at
 * `lg` (the stage hugs the bottom-right); below `lg` the stage drops into a
 * band under the text. Fills the viewport below the sticky header.
 */
export function HeroConcept5() {
  return (
    <div className="relative flex h-[calc(100svh-5rem)] min-h-[44rem] flex-col overflow-hidden bg-header lg:h-[calc(100svh-6.25rem)]">
      <OrbitField />
      <div className="pointer-events-none relative z-10 mx-auto flex w-full max-w-[90rem] flex-none flex-col px-6 pt-10 md:px-12 lg:absolute lg:inset-0 lg:justify-center lg:px-[7.5rem] lg:pt-0 lg:pb-8">
        <div className="pointer-events-auto max-w-[37.1875rem]">
          <HeroTextStack />
          <LogoStrip className="mt-12 lg:mt-[4.5rem]" />
        </div>
      </div>
      <div className="relative min-h-0 w-full flex-1 lg:static">
        <BlueprintStage className="absolute inset-0" />
      </div>
    </div>
  );
}
