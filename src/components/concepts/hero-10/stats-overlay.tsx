"use client";

import { motion } from "motion/react";

import { appearT, HIDE_T } from "@/components/concepts/shared/motion";
import { BEAT, COLOR, STATS } from "./ci-run-data";

/**
 * Scene-4 speed/cost payoff (Figma 246:903 / 246:901): a teal bracket framing
 * the STARSLING wordmark, the "1.5 minutes" / "80%" stats, and a "Trusted by
 * the best" logo row. Reveals as one group at the payoff beat (fade + blur up),
 * positioned in canvas space over the dimmed graph.
 */
export function StatsOverlay({ step, reduce }: { step: number; reduce: boolean }) {
  const shown = step >= BEAT.payoff;

  return (
    <motion.div
      initial={false}
      animate={
        shown
          ? { opacity: 1, y: 0, filter: "blur(0px)" }
          : reduce
            ? { opacity: 0 }
            : { opacity: 0, y: 18, filter: "blur(8px)" }
      }
      transition={shown ? appearT(reduce, 0.1) : HIDE_T}
      className="absolute inset-0"
    >
      {/* teal step bracket — left vertical, full-width rule, right vertical foot */}
      <svg
        aria-hidden
        viewBox={`0 0 ${STATS.bracket.w} ${STATS.bracket.h}`}
        fill="none"
        className="absolute overflow-visible"
        style={{
          left: STATS.bracket.x,
          top: STATS.bracket.y,
          width: STATS.bracket.w,
          height: STATS.bracket.h,
        }}
      >
        <path
          d={`M 1 0 L 1 ${STATS.bracket.mid} L ${STATS.bracket.w - 1} ${STATS.bracket.mid} L ${STATS.bracket.w - 1} ${STATS.bracket.h}`}
          stroke={COLOR.teal}
          strokeWidth={1.5}
        />
      </svg>

      {/* STARSLING wordmark — text-only asset sized w×h so the preserveAspectRatio
          SVG can't stretch; inverts to white on the dark canvas */}
      {/* eslint-disable-next-line @next/next/no-img-element -- static brand SVG; next/image adds no value for an inline vector */}
      <img
        src="/starsling-wordmark.svg"
        alt="Starsling"
        className="absolute dark:invert"
        style={{
          left: STATS.wordmark.x,
          top: STATS.wordmark.y,
          width: STATS.wordmark.w,
          height: STATS.wordmark.h,
        }}
      />

      {/* stat rows */}
      {STATS.rows.map((row) => (
        <div key={row.value}>
          <p
            className="absolute font-mono text-[34px] leading-none font-bold uppercase"
            style={{ left: row.x, top: row.valueY, color: COLOR.teal }}
          >
            {row.value}
          </p>
          <p
            className="absolute text-[14px] leading-none text-white/80"
            style={{ left: row.x, top: row.noteY }}
          >
            {row.note}
          </p>
        </div>
      ))}

      {/* trusted-by caption + logo row */}
      <p
        className="absolute text-[14px] leading-none text-white/80"
        style={{ left: STATS.trusted.x, top: STATS.trusted.y }}
      >
        {STATS.trusted.label}
      </p>
      {STATS.logos.map((logo) => (
        // eslint-disable-next-line @next/next/no-img-element -- static brand SVGs; next/image adds no value for inline vectors
        <img
          key={logo.alt}
          src={logo.src}
          alt={logo.alt}
          className="absolute dark:invert"
          style={{ left: logo.x, top: logo.y, width: logo.w, height: logo.h }}
        />
      ))}
    </motion.div>
  );
}
