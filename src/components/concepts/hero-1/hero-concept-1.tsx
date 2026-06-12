import { HeroTextGroup } from "@/components/concepts/shared/hero-text-group";
import { IllustrationBand } from "@/components/concepts/hero-1/illustration-band";

/**
 * Hero concept 1 — Figma 196:2936 / 196:3247 (INPUT) and 199:3843 / 199:3943
 * (PLANNING). Shared text group on the hero page background, then the
 * full-bleed animated illustration band.
 */
export function HeroConcept1() {
  return (
    <div className="flex flex-1 flex-col bg-header">
      <HeroTextGroup />
      <IllustrationBand />
    </div>
  );
}
