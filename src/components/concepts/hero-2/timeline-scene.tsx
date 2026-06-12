"use client";

import { motion } from "motion/react";

import { cn } from "@/lib/utils";
import {
  appearT,
  EASE,
  HIDE_T,
} from "@/components/concepts/shared/motion";
import { Reveal } from "@/components/concepts/shared/reveal";
import { BRACE_PATH } from "./icon-paths";
import {
  AXIS,
  CANVAS,
  DASHES,
  dashEnd,
  GRID,
  LABELS,
  MARKERS,
  PILLS,
  PROGRESS_END,
  RETICLES,
  SAVED,
  SQUARES,
  TICKS,
  type MarkerSpec,
  type PillSpec,
} from "./timeline-data";
import {
  IconBuildCheck,
  IconCiRing,
  IconCode,
  IconMarkerCheck,
  IconParallel,
  IconPr,
  ReticleMark,
} from "./timeline-icons";

const PILL_ICONS = {
  pr: IconPr,
  code: IconCode,
  parallel: IconParallel,
  build: IconBuildCheck,
} as const;

/** Blueprint columns + the tick ruler flanking the axis (Figma 204:5656). */
function StaticLinework() {
  const rules = Array.from({ length: 17 }, (_, i) => ({
    x: GRID.x + i * GRID.step,
    strong: i % 4 === 0,
  }));
  const ticks = [] as { x: number; long: boolean }[];
  for (let j = TICKS.first; j <= TICKS.last; j++) {
    ticks.push({
      x: TICKS.originX + j * TICKS.gap,
      long: j % TICKS.longEvery === 0,
    });
  }
  return (
    <g>
      {rules.map((r) => (
        <rect
          key={`rule-${r.x}`}
          x={r.x}
          y={GRID.top}
          width={1}
          height={GRID.h}
          fill="#79A9B1"
          fillOpacity={r.strong ? 0.3 : 0.12}
        />
      ))}
      {ticks.map((t) => (
        <g key={`tick-${t.x}`} fill="#79A9B1" fillOpacity={t.long ? 1 : 0.3}>
          <rect
            x={t.x}
            y={t.long ? TICKS.top.long : TICKS.top.minor}
            width={1}
            height={t.long ? TICKS.longLen : TICKS.minorLen}
          />
          <rect
            x={t.x}
            y={t.long ? TICKS.bottom.long : TICKS.bottom.minor}
            width={1}
            height={t.long ? TICKS.longLen : TICKS.minorLen}
          />
        </g>
      ))}
    </g>
  );
}

/**
 * A milestone node: spins as a loader dial from its beat, resolves to a teal
 * tick at `tickAt`, and dims to the done grey once the run passes `doneAt`.
 */
function Marker({
  spec,
  step,
  reduce,
}: {
  spec: MarkerSpec;
  step: number;
  reduce: boolean;
}) {
  const shown = step >= spec.at;
  const ticked = step >= spec.tickAt;
  const done = spec.doneAt !== undefined && step >= spec.doneAt;
  const spinning = !reduce && shown && !ticked;

  return (
    <Reveal
      shown={shown}
      delay={spec.delay}
      reduce={reduce}
      hidden={{ opacity: 0, scale: 0.5 }}
      className="size-[18px]"
      style={{ left: spec.cx - 9, top: spec.cy - 9 }}
    >
      {/* halo punching the dashes behind the node */}
      <span className="absolute inset-[1.5px] rounded-full bg-header ring-8 ring-header" />
      {/* loader dial */}
      <motion.span
        initial={false}
        animate={{ opacity: ticked ? 0 : 1 }}
        transition={{ duration: 0.25 }}
        className="absolute inset-0 block"
      >
        <motion.span
          className="absolute inset-0 block"
          animate={spinning ? { rotate: 360 } : { rotate: 0 }}
          transition={
            spinning
              ? { duration: 1.4, ease: "linear", repeat: Infinity }
              : { duration: 0.2 }
          }
        >
          <IconCiRing className="size-full" />
        </motion.span>
      </motion.span>
      {/* resolved tick */}
      <motion.span
        initial={false}
        animate={
          ticked ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.7 }
        }
        transition={ticked ? { duration: 0.35, ease: EASE } : { duration: 0.2 }}
        className="absolute inset-0 block"
      >
        <span
          className={cn(
            "absolute inset-[1.5px] rounded-full transition-colors delay-150 duration-500",
            done ? "bg-[#4e595b]" : "bg-[#0c90a6]",
          )}
        />
        <IconMarkerCheck className="absolute inset-0 size-full text-white" />
      </motion.span>
    </Reveal>
  );
}

/** The full CI timeline on the 1440×540 canvas, driven by the current beat. */
export function TimelineScene({
  step,
  reduce,
}: {
  step: number;
  reduce: boolean;
}) {
  return (
    <div className="absolute inset-0">
      <svg
        aria-hidden
        viewBox={`0 0 ${CANVAS.w} ${CANVAS.h}`}
        className="absolute inset-0 size-full overflow-visible"
      >
        <defs>
          {DASHES.map((d, i) => {
            const horizontal = d.y1 === d.y2;
            const shown = step >= d.at;
            const end = dashEnd(d, step);
            return (
              <clipPath key={`clip-${i}`} id={`tl-dash-${i}`}>
                <motion.rect
                  initial={false}
                  x={Math.min(d.x1, d.x2) - 1}
                  y={Math.min(d.y1, d.y2) - 1}
                  animate={{
                    width: horizontal ? (shown ? end - d.x1 + 2 : 0) : 3,
                    height: horizontal ? 3 : shown ? end - d.y1 + 2 : 0,
                  }}
                  transition={shown ? appearT(reduce, d.delay, 0.45) : HIDE_T}
                />
              </clipPath>
            );
          })}
        </defs>

        <StaticLinework />

        {/* time axis: faint full width, solid teal up to the run head */}
        <rect
          x={AXIS.x1}
          y={AXIS.y}
          width={AXIS.x2 - AXIS.x1}
          height={1}
          fill="#0C90A6"
          fillOpacity={0.1}
        />
        <motion.rect
          initial={false}
          x={AXIS.x1}
          y={AXIS.y}
          height={1}
          fill="#0C90A6"
          animate={{ width: Math.max(PROGRESS_END[step] - AXIS.x1, 0.01) }}
          transition={{ duration: reduce ? 0 : 0.65, ease: EASE }}
        />

        {/* dashed connectors, wiped in via their clip rects */}
        {DASHES.map((d, i) => (
          <g key={`dash-${i}`} clipPath={`url(#tl-dash-${i})`}>
            <line
              x1={d.x1}
              y1={d.y1}
              x2={d.x2}
              y2={d.y2}
              stroke="#79A9B1"
              strokeWidth={0.5}
              strokeDasharray="4 4"
            />
          </g>
        ))}

        {/* "80% time saved" brace, drawn at the final beat */}
        <g transform="translate(0 -395)">
          <motion.path
            initial={false}
            d={BRACE_PATH}
            fill="none"
            stroke="#0C90A6"
            strokeWidth={1.875}
            animate={{
              pathLength: step >= SAVED.at ? 1 : 0,
              opacity: step >= SAVED.at ? 1 : 0,
            }}
            transition={
              step >= SAVED.at ? appearT(reduce, SAVED.delay, 0.55) : HIDE_T
            }
          />
        </g>
      </svg>

      {/* ruler squares where a scan column lands */}
      {SQUARES.map((s) => (
        <Reveal
          key={`sq-${s.cx}`}
          shown={step >= s.at}
          delay={s.delay}
          reduce={reduce}
          hidden={{ opacity: 0, scale: 0.5 }}
          className="size-2 border border-[#79a9b1] bg-header"
          style={{ left: s.cx - 4, top: s.cy - 4 }}
        />
      ))}

      {/* scan reticles — persist once placed; spin while their stage runs */}
      {RETICLES.map((r) => {
        const spinning =
          !reduce &&
          r.spinTo !== undefined &&
          step >= r.at &&
          step <= r.spinTo;
        return (
          <Reveal
            key={`ret-${r.x}`}
            shown={step >= r.at}
            delay={r.delay}
            reduce={reduce}
            hidden={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
            className="grid size-8 place-items-center border-[0.5px] border-white bg-[#2f4242] text-white shadow-[0_0_12px_rgba(8,12,13,0.03)]"
            style={{ left: r.x, top: r.y }}
          >
            <motion.div
              className="size-8"
              animate={spinning ? { rotate: 360 } : { rotate: 0 }}
              transition={
                spinning
                  ? { duration: 5, ease: "linear", repeat: Infinity }
                  : { duration: 0.4 }
              }
            >
              <ReticleMark />
            </motion.div>
          </Reveal>
        );
      })}

      {/* milestone + runner nodes */}
      {MARKERS.map((m) => (
        <Marker key={`mk-${m.cx}`} spec={m} step={step} reduce={reduce} />
      ))}

      {/* pills */}
      {PILLS.map((p) => (
        <Pill key={p.text} spec={p} step={step} reduce={reduce} />
      ))}

      {/* labels — centered via an inner span so Motion's transform stays free */}
      {LABELS.map((l) => (
        <Reveal
          key={l.text}
          shown={step >= l.at}
          delay={l.delay}
          reduce={reduce}
          hidden={{ opacity: 0, y: 6, filter: "blur(4px)" }}
          style={{ left: l.cx, top: l.y }}
        >
          <span
            className={cn(
              "block -translate-x-1/2 text-xs leading-none whitespace-nowrap transition-colors delay-150 duration-500",
              l.tone === "dim" || (l.dimAt !== undefined && step >= l.dimAt)
                ? "text-foreground/50"
                : "text-foreground",
            )}
          >
            {l.text}
          </span>
        </Reveal>
      ))}
      <Reveal
        shown={step >= SAVED.at}
        delay={SAVED.delay + 0.15}
        reduce={reduce}
        hidden={{ opacity: 0, y: 6, filter: "blur(4px)" }}
        style={{ left: SAVED.label.cx, top: SAVED.label.y }}
      >
        <span className="block -translate-x-1/2 text-xs leading-none font-medium whitespace-nowrap text-[#0c90a6]">
          {SAVED.label.text}
        </span>
      </Reveal>
    </div>
  );
}

/** A timeline pill; flow pills recolor from active (inverted) to done (#343434). */
function Pill({
  spec,
  step,
  reduce,
}: {
  spec: PillSpec;
  step: number;
  reduce: boolean;
}) {
  const Icon = PILL_ICONS[spec.icon];
  const done = spec.doneAt !== undefined && step >= spec.doneAt;
  return (
    <Reveal
      shown={step >= spec.at}
      delay={spec.delay}
      reduce={reduce}
      hidden={{ opacity: 0, y: 10, scale: 0.96, filter: "blur(6px)" }}
      className="z-10"
      style={{ left: spec.x, top: spec.y }}
    >
      <span
        className={cn(
          "flex items-center gap-2 rounded-full px-4 py-2 ring-8 ring-header transition-colors delay-150 duration-500",
          spec.kind === "success" && "bg-[#0c90a6] text-white",
          spec.kind !== "success" &&
            (done ? "bg-[#343434] text-white/50" : "bg-foreground text-header"),
        )}
      >
        <Icon />
        <span className="font-mono text-sm leading-[18px] font-medium whitespace-nowrap">
          {spec.text}
        </span>
      </span>
    </Reveal>
  );
}
