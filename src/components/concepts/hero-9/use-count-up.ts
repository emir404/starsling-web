"use client";

import { useLayoutEffect, useState } from "react";
import { animate, useMotionValue } from "motion/react";

import { EASE } from "@/components/concepts/shared/motion";

/**
 * Eases an integer from 0 → `target` while a node is `active` (running),
 * snapping to `target` once `settled` (passed) and returning `target` under
 * reduced motion — so the same beat that drives the graph drives the duration
 * counters. Backed by a Framer motion value: `mv.set`/`animate` are imperative
 * (not React state), so resetting to 0 before each run is flash-free and the
 * effect body holds no synchronous setState.
 */
export function useCountUp(
  target: number,
  {
    active,
    settled,
    reduce,
    duration = 1.6,
  }: { active: boolean; settled: boolean; reduce: boolean; duration?: number },
): number {
  const mv = useMotionValue(0);
  const [value, setValue] = useState(0);

  useLayoutEffect(() => {
    const unsubscribe = mv.on("change", (v) => setValue(Math.round(v)));

    if (reduce || settled) {
      mv.set(target);
    } else if (!active) {
      mv.set(0);
    } else {
      mv.set(0);
      const controls = animate(mv, target, { duration, ease: EASE });
      return () => {
        controls.stop();
        unsubscribe();
      };
    }
    return unsubscribe;
  }, [mv, active, settled, reduce, target, duration]);

  return value;
}
