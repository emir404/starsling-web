"use client";

import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";
import { EASE } from "@/components/concepts/shared/motion";

/** Social-proof logos (Figma 212:388), exported 1:1 from the frame. */
const LOGOS = [
  { src: "/logos/google.svg", alt: "Google", className: "h-[1.875rem]" },
  { src: "/logos/sim.svg", alt: "sim", className: "h-7" },
  { src: "/logos/langchain.svg", alt: "LangChain", className: "h-7" },
  { src: "/logos/crewai.svg", alt: "crewAI", className: "h-8" },
];

/**
 * "Trusted by" caption over the brand logo row (Figma 212:390). Enters after
 * the text stack's stagger; logos invert in dark mode.
 */
export function LogoStrip({ className }: { className?: string }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={
        reduce ? { opacity: 0 } : { opacity: 0, y: 18, filter: "blur(6px)" }
      }
      animate={
        reduce ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }
      }
      transition={{
        duration: reduce ? 0.35 : 0.6,
        delay: reduce ? 0.2 : 0.5,
        ease: EASE,
      }}
      className={cn("flex flex-col items-start gap-6", className)}
    >
      <p className="text-sm text-foreground">
        Trusted by industry leaders &amp; fastest growing startups
      </p>
      <div className="flex flex-wrap items-center gap-x-[2.875rem] gap-y-4">
        {LOGOS.map((logo) => (
          // eslint-disable-next-line @next/next/no-img-element -- static brand SVGs; next/image adds no value for inline vectors
          <img
            key={logo.alt}
            src={logo.src}
            alt={logo.alt}
            className={cn("w-auto dark:invert", logo.className)}
          />
        ))}
      </div>
    </motion.div>
  );
}
