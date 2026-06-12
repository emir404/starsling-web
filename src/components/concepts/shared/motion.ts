import type { Variants } from "motion/react";

/** Shared easing for concept animations (same curve as the site header). */
export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * Step-swap variants for a scene plane: blur + position + opacity.
 * `center` staggers the scene's inner rows so each step cascades in.
 */
export function sceneSwapVariants(reduce: boolean): Variants {
  if (reduce) {
    return {
      enter: { opacity: 0 },
      center: { opacity: 1, transition: { duration: 0.3 } },
      exit: { opacity: 0, transition: { duration: 0.25 } },
    };
  }
  return {
    enter: { opacity: 0, y: 28, filter: "blur(10px)" },
    center: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.55,
        ease: EASE,
        staggerChildren: 0.08,
        delayChildren: 0.05,
      },
    },
    exit: {
      opacity: 0,
      y: -28,
      filter: "blur(10px)",
      transition: { duration: 0.4, ease: EASE },
    },
  };
}

/** Inner-row variants for scene content; orchestrated by the plane's `center` stagger. */
export function sceneRowVariants(reduce: boolean): Variants {
  if (reduce) {
    return {
      enter: { opacity: 0 },
      center: { opacity: 1, transition: { duration: 0.3 } },
    };
  }
  return {
    enter: { opacity: 0, y: 18, filter: "blur(6px)" },
    center: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.5, ease: EASE },
    },
  };
}
