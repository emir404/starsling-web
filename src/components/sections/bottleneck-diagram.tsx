"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";

import { MeshGradient } from "@/components/shared/mesh-gradient";
import { OrbitRings } from "@/components/shared/orbit-rings";
import { cn } from "@/lib/utils";
import type { BottleneckBar } from "@/types/content";

/** Shared easing — the same curve the concept animations and site header use. */
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * A single before/after comparison bar: floating chip, coding | CI segments, and
 * a dimension bracket. The bar is an always-white translucent panel (it sits on
 * the teal gradient), so its inner text is pinned to dark ink rather than the
 * theme `--foreground`, which would flip to white in dark mode.
 */
function ComparisonBar({ bar, reduce }: { bar: BottleneckBar; reduce: boolean }) {
  const { chip, coding, ci, ciShare, ratio, danger } = bar;

  // Stagger the bar's own pieces: wipe the bar in, then pop the chip, then fade the bracket.
  const group: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
  };
  const wipe: Variants = reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.3 } } }
    : {
        hidden: { clipPath: "inset(0 100% 0 0)" },
        show: {
          clipPath: "inset(0 0% 0 0)",
          transition: { duration: 0.7, ease: EASE },
        },
      };
  const pop: Variants = reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.3 } } }
    : {
        hidden: { opacity: 0, y: 8, scale: 0.96 },
        show: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.45, ease: EASE },
        },
      };
  const fade: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.45, ease: EASE } },
  };

  return (
    <motion.div variants={group} className="relative w-full max-w-[32rem]">
      {/* Bar: coding | CI segments (widths driven by `ratio`), wiped in left→right */}
      <motion.div
        variants={wipe}
        className="flex h-24 w-full shadow-[0_0_64px_rgba(0,0,0,0.12)]"
      >
        <div
          className="flex basis-0 items-end justify-between border-r border-[rgba(8,12,13,0.1)] bg-white/90 px-4 pb-3.5"
          style={{ flexGrow: ratio[0] }}
        >
          <span className="font-mono text-sm tracking-[0.02em] text-[#080c0d]/70 uppercase">
            {coding.label}
          </span>
          <span className="font-mono text-2xl leading-none font-semibold text-[#080c0d] uppercase">
            {coding.value}
          </span>
        </div>
        <div
          className="relative flex basis-0 items-end justify-between overflow-hidden bg-white/90 px-4 pb-3.5"
          style={{ flexGrow: ratio[1] }}
        >
          <div
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-0",
              danger ? "bg-hatch-danger" : "bg-hatch",
            )}
          />
          <span
            className={cn(
              "relative font-mono text-sm tracking-[0.02em] uppercase",
              danger ? "text-[#991b1b]/70" : "text-[#080c0d]/70",
            )}
          >
            {ci.label}
          </span>
          <span
            className={cn(
              "relative font-mono text-2xl leading-none font-semibold uppercase",
              danger ? "text-[#991b1b]" : "text-[#080c0d]",
            )}
          >
            {ci.value}
          </span>
        </div>
      </motion.div>

      {/* Floating chip, straddling the bar's top-left corner */}
      <motion.div
        variants={pop}
        className="absolute -top-4 left-5 z-20 flex px-1 py-1.5 shadow-[0_0_12px_rgba(0,0,0,0.25)]"
        style={
          danger
            ? {
                backgroundColor: "rgba(8,12,13,0.8)",
                backgroundImage:
                  "linear-gradient(rgba(245,65,65,0.1), rgba(245,65,65,0.1))",
              }
            : { backgroundColor: "rgba(8,12,13,0.8)" }
        }
      >
        <span
          className={cn(
            "px-4 py-1 text-sm leading-none font-medium drop-shadow-[0_4px_2px_rgba(0,0,0,0.5)]",
            danger ? "text-[#fbaeae]" : "text-white",
          )}
        >
          {chip}
        </span>
      </motion.div>

      {/* Dimension bracket under the CI segment, labelled with its share (on the teal gradient) */}
      <motion.div variants={fade} className="flex w-full" aria-hidden>
        <div className="basis-0" style={{ flexGrow: ratio[0] }} />
        <div className="basis-0" style={{ flexGrow: ratio[1] }}>
          <div
            className={cn(
              "mt-2 h-1.5 border-x border-t",
              danger ? "border-[#ff6b6b]/60" : "border-white/45",
            )}
          />
          <p
            className={cn(
              "mt-1.5 text-center font-mono text-sm leading-none",
              danger ? "text-[#ff6b6b]" : "text-white/75",
            )}
          >
            {ciShare}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

/**
 * Animated before/after CI comparison diagram (Figma 282:336, right card). The
 * bars sit on an interactive teal mesh gradient with the orbit-rings
 * illustration blended over it. On scroll into view each bar wipes in with its
 * chip and dimension bracket — the long red CI segment dramatizes the bottleneck.
 */
export function BottleneckDiagram({
  bars,
  className,
}: {
  bars: BottleneckBar[];
  className?: string;
}) {
  const reduce = !!useReducedMotion();

  return (
    <motion.div
      className={cn(
        "relative h-full min-h-[28rem] w-full overflow-hidden shadow-[0_0_12px_rgba(0,0,0,0.04)]",
        className,
      )}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.2 } } }}
    >
      {/* Backdrop: teal mesh gradient + orbit rings (static, anchored lower-right
          per Figma 282:364), both behind the bars */}
      <MeshGradient variant="mesh-bright" className="absolute inset-0" />
      <OrbitRings className="top-[93%] left-[93%] w-[158%] -translate-x-1/2 -translate-y-1/2" />

      <motion.div
        className="relative z-10 flex h-full flex-col items-center justify-center gap-20 px-8 py-12"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.35, delayChildren: 0.1 } },
        }}
      >
        {bars.map((bar) => (
          <ComparisonBar key={bar.chip} bar={bar} reduce={reduce} />
        ))}
      </motion.div>
    </motion.div>
  );
}
