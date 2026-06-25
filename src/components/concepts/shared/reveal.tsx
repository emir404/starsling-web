"use client";

import type { CSSProperties, ReactNode } from "react";
import { useState } from "react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";
import { appearT, HIDE_T } from "@/components/concepts/shared/motion";

/** A one-time mount entrance: a real `initial` blur-in that plays only on the
 * element's first appearance, then hands back to the beat-driven reveals. */
export type RevealEnter = {
  /** Keyframe to start from on first mount (reduced motion → opacity only). */
  from: Record<string, number | string>;
  /** Choreography delay before this element settles in. */
  delay: number;
  /** Settle duration (defaults to the shared appear duration). */
  duration?: number;
};

/**
 * Shown/hidden wrapper for beat-driven scene elements: appear with the
 * element's choreography delay (blur + position + opacity), exit quickly and
 * uniformly when the cycle wraps. By default `initial={false}` so the first
 * paint is the beat-0 state. Pass `enter` to play a one-time staggered blur-in
 * on first mount (the load choreography): it fires once, then every later
 * reveal/hide uses the normal beat transitions. Positioned absolutely by
 * default; pass a position class to override.
 */
export function Reveal({
  shown,
  delay,
  reduce,
  hidden,
  enter,
  className,
  style,
  children,
}: {
  shown: boolean;
  delay: number;
  reduce: boolean;
  hidden: Record<string, number | string>;
  enter?: RevealEnter;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}) {
  // The mount entrance is one-shot: after the first appearance settles, fall
  // back to the beat-driven transitions for the rest of the loop.
  const [entered, setEntered] = useState(false);
  const entering = !!enter && !entered && shown;
  const visible = { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" };
  return (
    <motion.div
      initial={enter ? (reduce ? { opacity: 0 } : enter.from) : false}
      animate={shown ? visible : reduce ? { opacity: 0 } : hidden}
      transition={
        shown
          ? entering
            ? appearT(reduce, enter!.delay, enter!.duration)
            : appearT(reduce, delay)
          : HIDE_T
      }
      onAnimationComplete={() => {
        if (entering) setEntered(true);
      }}
      className={cn("absolute", className)}
      style={style}
    >
      {children}
    </motion.div>
  );
}
