"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";

import { cn } from "@/lib/utils";
import type { BottleneckBar } from "@/types/content";

/** Shared easing — the same curve the concept animations and site header use. */
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Faint concentric rings echoing the Figma "Group 2" ellipses, clipped to the panel's top-right. */
function ConcentricRings({ reduce }: { reduce: boolean }) {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute -top-28 -right-28 z-0"
      variants={{
        hidden: { opacity: 0, scale: reduce ? 1 : 0.92 },
        show: {
          opacity: 1,
          scale: 1,
          transition: { duration: reduce ? 0.3 : 0.8, ease: EASE },
        },
      }}
    >
      <div className="flex size-[36rem] items-center justify-center rounded-full border border-brand-muted/15">
        <div className="flex size-[24rem] items-center justify-center rounded-full border border-brand-muted/15">
          <div className="size-[10rem] rounded-full border border-brand-muted/15" />
        </div>
      </div>
    </motion.div>
  );
}

/** A single before/after comparison bar: floating chip, coding | CI segments, and a dimension bracket. */
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
    <motion.div variants={group} className="relative w-full max-w-[28rem]">
      {/* Bar: coding | CI segments (widths driven by `ratio`), wiped in left→right */}
      <motion.div
        variants={wipe}
        className="flex h-24 w-full shadow-[0_0_64px_rgba(0,0,0,0.1)]"
      >
        <div
          className="flex basis-0 items-end justify-between border-r border-[rgba(8,12,13,0.1)] bg-card/95 px-4 pb-3.5"
          style={{ flexGrow: ratio[0] }}
        >
          <span className="font-mono text-sm tracking-[0.02em] text-foreground/70 uppercase">
            {coding.label}
          </span>
          <span className="font-mono text-2xl leading-none font-semibold text-foreground uppercase">
            {coding.value}
          </span>
        </div>
        <div
          className="relative flex basis-0 items-end justify-between overflow-hidden bg-card/95 px-4 pb-3.5"
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
              danger ? "text-[#991b1b]/70" : "text-foreground/70",
            )}
          >
            {ci.label}
          </span>
          <span
            className={cn(
              "relative font-mono text-2xl leading-none font-semibold uppercase",
              danger ? "text-[#991b1b]" : "text-foreground",
            )}
          >
            {ci.value}
          </span>
        </div>
      </motion.div>

      {/* Floating chip, straddling the bar's top-left corner */}
      <motion.div
        variants={pop}
        className="absolute -top-4 left-5 z-20 flex px-1 py-1.5 shadow-[0_0_12px_rgba(0,0,0,0.25)] backdrop-blur-[10px]"
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

      {/* Dimension bracket under the CI segment, labelled with its share */}
      <motion.div variants={fade} className="flex w-full" aria-hidden>
        <div className="basis-0" style={{ flexGrow: ratio[0] }} />
        <div className="basis-0" style={{ flexGrow: ratio[1] }}>
          <div
            className={cn(
              "mt-2 h-1.5 border-x border-t",
              danger ? "border-[#b91c1c]/40" : "border-foreground/25",
            )}
          />
          <p
            className={cn(
              "mt-1.5 text-center font-mono text-sm leading-none",
              danger ? "text-[#b91c1c]/80" : "text-foreground/70",
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
 * Animated before/after CI comparison diagram (Figma 234:395, right panel).
 * Builds once on scroll into view: rings settle, then each bar wipes in with its
 * chip and dimension bracket — the long red CI segment dramatizes the bottleneck.
 */
export function BottleneckDiagram({ bars }: { bars: BottleneckBar[] }) {
  const reduce = !!useReducedMotion();

  return (
    <motion.div
      className="relative min-h-[36rem] overflow-hidden bg-brand-muted/20 shadow-[0_0_12px_rgba(0,0,0,0.02)]"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.2 } } }}
    >
      <ConcentricRings reduce={reduce} />
      <motion.div
        className="relative flex h-full flex-col items-center justify-center gap-16 px-10 py-12"
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
