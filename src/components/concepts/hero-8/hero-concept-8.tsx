import { HeroTextGroup } from "@/components/concepts/shared/hero-text-group";
import { DagStage } from "./dag-stage";

/**
 * Hero concept 8 — Figma 239:55. The shared "Self-driving CI" text over a dark
 * workflow-run DAG: matrix jobs fan out in parallel and converge on the merge
 * gate, landing a dramatically low build time — the run *shows* the product's
 * speed + optimization as it loops. Forced onto the dark canvas (the global
 * site chrome stays in the light theme). Fills the viewport below the header.
 */
export function HeroConcept8() {
  return (
    <div className="dark relative flex h-[calc(100svh-5rem)] min-h-[44rem] flex-col overflow-hidden bg-header lg:h-[calc(100svh-6.25rem)]">
      <HeroTextGroup className="relative z-10 shrink-0" />
      <div className="relative flex-1">
        <DagStage className="absolute inset-0" />
      </div>
    </div>
  );
}
