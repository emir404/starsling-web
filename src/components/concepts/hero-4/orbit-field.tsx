"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * Blueprint orbit field behind the hero (Figma 204:6486) — the same 1200×800
 * art as hero-1's dark-mode orbits, shown in both modes here and centered at
 * 60% of the hero so the rings break the band's top edge. Idles in a slow
 * spin; the white panels in front occlude the center.
 */
export function OrbitField() {
  const reduce = useReducedMotion();

  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, delay: reduce ? 0 : 0.5 }}
      className="pointer-events-none absolute top-[60%] left-1/2 h-[800px] w-[1200px] -translate-x-1/2 -translate-y-1/2"
    >
      <motion.div
        className="size-full"
        animate={reduce ? undefined : { rotate: 360 }}
        transition={
          reduce
            ? undefined
            : { duration: 240, ease: "linear", repeat: Infinity }
        }
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- static decorative SVG; next/image adds no value for an inline vector */}
        <img
          src="/hero/orbits.svg"
          alt=""
          className="size-full max-w-none dark:opacity-60"
        />
      </motion.div>
    </motion.div>
  );
}
