import { HeroTextGroup } from "@/components/concepts/shared/hero-text-group";
import { OrbitField } from "@/components/concepts/hero-4/orbit-field";
import { RunGraphStage } from "./run-graph-stage";

/**
 * Hero concept 9 — Figma 234:6277. The shared two-column hero text
 * ("Self-driving CI", the default headline) over a GitHub Actions workflow-run
 * graph restaged in the light blueprint language: two matrix groups and an
 * integration test fan into a final e2e gate, and the run animates to Success.
 * A faint orbit field nods to the Figma; the stage fills the viewport below the
 * sticky header.
 */
export function HeroConcept9() {
  return (
    <div className="relative flex h-[calc(100svh-5rem)] min-h-[44rem] flex-col overflow-hidden bg-header lg:h-[calc(100svh-6.25rem)]">
      <OrbitField />
      <HeroTextGroup className="relative z-10 shrink-0" />
      <RunGraphStage className="relative z-10 min-h-0 w-full flex-1" />
    </div>
  );
}
