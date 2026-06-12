import type { ComponentType } from "react";

import type { HeroStepId } from "@/types/content";
import { HERO_CONTENT } from "@/content/hero";
import { InputScene } from "./scenes/input-scene";
import { PlanningScene } from "./scenes/planning-scene";

/**
 * Scene registry for hero concept 1. Steps without an entry (PARALLEL EXEC.,
 * OUTPUT) still show in the stepper but are skipped by the cycle — adding one
 * later is a new scene component plus an entry here. `maskRadius` is the
 * band-space circle the scene fades out within (Figma "Ellipse 27").
 */
export const SCENES: Partial<
  Record<HeroStepId, { Scene: ComponentType; maskRadius: number }>
> = {
  input: { Scene: InputScene, maskRadius: 340 },
  planning: { Scene: PlanningScene, maskRadius: 292 },
};

/** Step ids the cycle walks, in content order. */
export const CYCLE: HeroStepId[] = HERO_CONTENT.steps
  .map((step) => step.id)
  .filter((id) => SCENES[id] !== undefined);
