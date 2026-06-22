"use client";

import { useLayoutEffect, useState } from "react";
import { animate, useMotionValue } from "motion/react";

import { EASE } from "@/components/concepts/shared/motion";

/**
 * Eases an integer from `from` (default 0) → `target` while a node is `active`
 * (running), snapping to `target` once `settled` (passed) and returning `target`
 * under reduced motion — so the same beat that drives the graph drives the
 * duration counters. Set `from` above `target` to count DOWN (e.g. a wall-clock
 * collapsing from the serial time to the parallel time). Backed by a Framer
 * motion value: `mv.set`/`animate` are imperative (not React state), so resetting
 * to `from` before each run is flash-free and the effect holds no synchronous
 * setState.
 */
export function useCountUp(
  target: number,
  {
    active,
    settled,
    reduce,
    duration = 1.6,
    from = 0,
  }: {
    active: boolean;
    settled: boolean;
    reduce: boolean;
    duration?: number;
    from?: number;
  },
): number {
  const mv = useMotionValue(from);
  const [value, setValue] = useState(from);

  useLayoutEffect(() => {
    const unsubscribe = mv.on("change", (v) => setValue(Math.round(v)));

    if (reduce || settled) {
      mv.set(target);
    } else if (!active) {
      mv.set(from);
    } else {
      mv.set(from);
      const controls = animate(mv, target, { duration, ease: EASE });
      return () => {
        controls.stop();
        unsubscribe();
      };
    }
    return unsubscribe;
  }, [mv, active, settled, reduce, target, duration, from]);

  return value;
}
