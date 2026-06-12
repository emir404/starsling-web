"use client";

import type { CSSProperties, ReactNode } from "react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";
import { appearT, HIDE_T } from "@/components/concepts/shared/motion";

/**
 * Shown/hidden wrapper for beat-driven scene elements: appear with the
 * element's choreography delay (blur + position + opacity), exit quickly and
 * uniformly when the cycle wraps. `initial={false}` so the first paint is the
 * beat-0 state and only the band-level entrance animates on load. Positioned
 * absolutely by default; pass a position class to override.
 */
export function Reveal({
  shown,
  delay,
  reduce,
  hidden,
  className,
  style,
  children,
}: {
  shown: boolean;
  delay: number;
  reduce: boolean;
  hidden: Record<string, number | string>;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}) {
  const visible = { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" };
  return (
    <motion.div
      initial={false}
      animate={shown ? visible : reduce ? { opacity: 0 } : hidden}
      transition={shown ? appearT(reduce, delay) : HIDE_T}
      className={cn("absolute", className)}
      style={style}
    >
      {children}
    </motion.div>
  );
}
