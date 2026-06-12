"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * Orbital rings behind the scene, dark mode only (Figma 199:3824). The SVG's
 * 1200×800 canvas maps to band x 120–1320, centered on the mask center
 * (720, 400), so the idle rotation spins around the scene.
 */
export function Orbits() {
  const reduce = useReducedMotion();

  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.4 }}
      transition={{ duration: 1.2, delay: reduce ? 0 : 0.6 }}
      className="absolute left-[120px] top-0 hidden h-[800px] w-[1200px] dark:block"
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
        <img src="/hero/orbits.svg" alt="" className="size-full max-w-none" />
      </motion.div>
    </motion.div>
  );
}
