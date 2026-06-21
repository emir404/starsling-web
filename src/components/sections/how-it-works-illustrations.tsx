"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { Code2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { EASE } from "@/components/concepts/shared/motion";
import { HOW_IT_WORKS } from "@/content/how-it-works";

/**
 * The three animated illustrations for the "How it works" section (Figma
 * 234:547 light / 234:4818 dark). Each is a fixed 470px-wide mockup that bleeds
 * off the right of its 500px panel (clipped), and re-skins between light/dark
 * via `dark:` variants + theme tokens. All choreography honors reduced motion.
 */

const VIEWPORT = { once: true, margin: "-80px" } as const;

/** Fade (optionally up by `y`px) with a choreography `delay`. */
const fade = (reduce: boolean, delay = 0, y = 0): Variants => ({
  hidden: reduce ? { opacity: 0 } : { opacity: 0, y },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: reduce ? 0.3 : 0.5, ease: EASE, delay: reduce ? 0 : delay },
  },
});

/** Soft fade + scale used to bring each mockup card in. */
const scaleIn = (reduce: boolean, delay = 0): Variants => ({
  hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.985 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: reduce ? 0.3 : 0.6, ease: EASE, delay: reduce ? 0 : delay },
  },
});

/** Left→right clip wipe (the runner-swap reveal). */
const wipeX = (reduce: boolean, delay = 0): Variants =>
  reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.3 } } }
    : {
        hidden: { clipPath: "inset(0 100% 0 0)" },
        show: {
          clipPath: "inset(0 0% 0 0)",
          transition: { duration: 0.6, ease: EASE, delay },
        },
      };

/** Pop in from nothing (job dots, the saved badge). */
const pop = (reduce: boolean, delay = 0): Variants =>
  reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.3 } } }
    : {
        hidden: { opacity: 0, scale: 0 },
        show: {
          opacity: 1,
          scale: 1,
          transition: { duration: 0.45, ease: EASE, delay },
        },
      };

/** Grow horizontally from the left edge (the "saved" connector). */
const growX = (reduce: boolean, delay = 0): Variants =>
  reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.3 } } }
    : {
        hidden: { scaleX: 0, opacity: 0 },
        show: {
          scaleX: 1,
          opacity: 1,
          transition: { duration: 0.6, ease: EASE, delay },
        },
      };

/** Grow vertically from the top edge (the agent-log connector). */
const growY = (reduce: boolean, delay = 0): Variants =>
  reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.3 } } }
    : {
        hidden: { scaleY: 0, opacity: 0 },
        show: {
          scaleY: 1,
          opacity: 1,
          transition: { duration: 0.6, ease: EASE, delay },
        },
      };

/** 500px illustration panel + scroll trigger; acts as the variants root. */
function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      variants={{ hidden: {}, show: {} }}
      className={cn(
        "relative h-[500px] w-full overflow-hidden bg-white shadow-[0_0_24px_0_rgba(0,0,0,0.02)] dark:bg-[#1a1f1f] dark:shadow-none",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}

/** Shared mockup card chrome (window/panel surface). */
const CARD =
  "overflow-hidden border border-black/5 bg-[#fcfcfc] shadow-[0_0_16px_0_rgba(0,0,0,0.03)] dark:border-white/5 dark:bg-[#2a3232]";
/** Shared mockup header/footer bar surface. */
const BAR =
  "border-black/5 bg-white dark:border-white/5 dark:bg-[#384343]";

/* ------------------------------- Card 1 -------------------------------- */

type CodeRow = {
  n: string;
  tone?: "rm" | "add";
  strike?: boolean;
  comment?: boolean;
  seg: { t: string; kw?: boolean }[];
};

/** Code-editor mockup whose line 7 swaps ubuntu-latest → starsling-ubuntu. */
export function EditorCard() {
  const reduce = !!useReducedMotion();
  const { filename, swapFrom, swapTo } = HOW_IT_WORKS.install;

  const rows: CodeRow[] = [
    { n: "1", comment: true, seg: [{ t: "# CI pipeline" }] },
    { n: "2", seg: [] },
    { n: "3", seg: [{ t: "name:", kw: true }, { t: " ci" }] },
    { n: "4", seg: [{ t: "on:", kw: true }, { t: " [push, pull_request]" }] },
    { n: "5", seg: [{ t: "jobs:", kw: true }] },
    { n: "6", seg: [{ t: "  " }, { t: "test:", kw: true }] },
    { n: "7  -", tone: "rm", strike: true, seg: [{ t: `    ${swapFrom}` }] },
    { n: "7  +", tone: "add", seg: [{ t: `    ${swapTo}` }] },
    { n: "8", seg: [{ t: "    " }, { t: "steps:", kw: true }] },
    { n: "9", seg: [{ t: "      " }, { t: "- uses:", kw: true }, { t: " actions/checkout@v4" }] },
    { n: "10", seg: [{ t: "      " }, { t: "- uses:", kw: true }, { t: " actions/setup-node@v4" }] },
    { n: "11", seg: [{ t: "      " }, { t: "- run:", kw: true }, { t: " pnpm install" }] },
    { n: "12", seg: [{ t: "      " }, { t: "- run:", kw: true }, { t: " pnpm test" }] },
    { n: "13", seg: [] },
  ];

  return (
    <Panel>
      <div className="absolute left-9 top-1/2 h-[360px] w-[470px] -translate-y-1/2">
        <motion.div variants={scaleIn(reduce)} className={cn("relative h-full w-full", CARD)}>
          {/* title bar */}
          <div className={cn("absolute inset-x-0 top-0 flex h-12 items-center border-b", BAR)}>
            <span className="ml-5 size-2 rounded-full bg-foreground/20" />
            <span className="ml-2 size-2 rounded-full bg-foreground/20" />
            <span className="ml-2 size-2 rounded-full bg-foreground/20" />
            <div className="ml-3 flex h-8 flex-1 items-center bg-foreground/[0.03] pl-3">
              <span className="font-mono text-sm text-foreground">{filename}</span>
            </div>
          </div>

          {/* swap-line highlight bars */}
          <motion.div
            variants={wipeX(reduce, 0.4)}
            className="absolute inset-x-0 top-[189px] h-[21px] bg-[rgba(239,68,68,0.15)]"
          />
          <motion.div
            variants={wipeX(reduce, 0.6)}
            className="absolute inset-x-0 top-[210px] h-[21px] bg-[rgba(12,144,166,0.15)] dark:bg-[rgba(22,199,228,0.15)]"
          />

          {/* code */}
          <div className="absolute left-0 top-[63px] font-mono text-sm leading-[1.5] whitespace-pre">
            {rows.map((row, i) => (
              <div key={i} className="flex h-[21px] items-center pl-[19px]">
                <span
                  className={cn(
                    "w-[41px] shrink-0",
                    row.tone === "rm"
                      ? "text-[#dc2626] dark:text-[#ed9696]"
                      : row.tone === "add"
                        ? "text-[#096d7d] dark:text-[#4fbfd1]"
                        : "text-foreground/30",
                  )}
                >
                  {row.n}
                </span>
                {row.tone === "add" ? (
                  <motion.span
                    variants={wipeX(reduce, 0.65)}
                    className="text-[#096d7d] dark:text-[#4fbfd1]"
                  >
                    {row.seg.map((s, j) => (
                      <span key={j}>{s.t}</span>
                    ))}
                  </motion.span>
                ) : (
                  <span
                    className={cn(
                      row.tone === "rm" && "text-[#dc2626] line-through dark:text-[#ed9696]",
                      row.comment && "text-foreground/60 dark:text-foreground",
                      !row.tone && !row.comment && "text-foreground",
                    )}
                  >
                    {row.seg.map((s, j) => (
                      <span
                        key={j}
                        className={s.kw ? "text-[#1070e8] dark:text-[#63a9ff]" : undefined}
                      >
                        {s.t}
                      </span>
                    ))}
                  </span>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </Panel>
  );
}

/* ------------------------------- Card 2 -------------------------------- */

/** Job-start coordinates within the 412×328 timeline area (Figma dark frame). */
const JOB_DOTS = [
  { l: 73, t: 190 },
  { l: 43, t: 153 },
  { l: 79, t: 91 },
  { l: 43, t: 288 },
  { l: 43, t: 103 },
  { l: 70, t: 141 },
  { l: 37, t: 223 },
  { l: 80, t: 250 },
];

/** "8 jobs in parallel" timeline: dots cluster left of the 1:42 finish line. */
export function TimelineCard() {
  const reduce = !!useReducedMotion();
  const { jobsLabel, saved, allDone, allDoneNote, start, baseline } = HOW_IT_WORKS.speed;

  return (
    <Panel>
      <div className="absolute left-9 top-1/2 h-[360px] w-[470px] -translate-y-1/2">
        <motion.div
          variants={scaleIn(reduce)}
          className="relative h-full w-full overflow-hidden border border-black/5 bg-white shadow-[0_0_16px_0_rgba(0,0,0,0.03)] dark:border-white/5 dark:bg-[#384343]"
        >
          {/* faint blueprint grid */}
          <div
            aria-hidden
            className="absolute inset-0 text-foreground/[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
              backgroundSize: "100px 100px",
            }}
          />

          {/* timeline plane (412 × 328, centered) */}
          <div className="absolute left-1/2 top-1/2 h-[328px] w-[412px] -translate-x-1/2 -translate-y-1/2">
            {/* finish line + GitHub baseline */}
            <motion.div
              variants={fade(reduce, 0.3)}
              className="absolute top-[-55px] bottom-[-55px] left-[110px] w-px border-l border-dashed border-[#2cd4be]"
            />
            <motion.div
              variants={fade(reduce, 1.1)}
              className="absolute top-0 bottom-0 right-[-8px] w-px border-l border-dashed border-foreground/10"
            />

            {/* labels */}
            <motion.p
              variants={fade(reduce, 0.1)}
              className="absolute top-[16px] left-0 font-mono text-sm font-medium text-foreground"
            >
              {jobsLabel}
            </motion.p>
            <motion.p
              variants={fade(reduce, 0.1)}
              className="absolute bottom-[16px] left-0 font-mono text-xs text-foreground/80"
            >
              {start}
            </motion.p>
            <motion.p
              variants={fade(reduce, 0.4)}
              className="absolute bottom-[16px] left-[124px] font-mono text-xs text-foreground/80"
            >
              {allDone} <span className="text-[#2cd4be]/80">{allDoneNote}</span>
            </motion.p>
            <motion.p
              variants={fade(reduce, 1.1)}
              className="absolute bottom-[16px] right-0 font-mono text-xs text-foreground/80"
            >
              {baseline}
            </motion.p>

            {/* job dots (staggered pop) */}
            <motion.div
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.08, delayChildren: 0.35 } },
              }}
              className="absolute inset-0"
            >
              {JOB_DOTS.map((d, i) => (
                <motion.span
                  key={i}
                  variants={pop(reduce)}
                  style={{ left: d.l, top: d.t }}
                  className="absolute size-3 rounded-full bg-[#2cd4be]"
                />
              ))}
            </motion.div>

            {/* the slow GitHub baseline job */}
            <motion.span
              variants={fade(reduce, 1.1)}
              className="absolute left-[406px] top-[276px] size-3 rounded-full bg-foreground/30"
            />

            {/* saved connector + badge */}
            <motion.div
              variants={growX(reduce, 0.9)}
              className="absolute top-[250px] left-[116px] h-px w-[296px] origin-left bg-[#1f9b8b]"
            />
            <motion.div
              variants={pop(reduce, 1.15)}
              className="absolute top-[235px] left-[202px] flex items-center bg-[#1f9b8b] px-3 py-2"
            >
              <span className="font-mono text-sm font-medium leading-none text-white">{saved}</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </Panel>
  );
}

/* ------------------------------- Card 3 -------------------------------- */

/** Agent run-log that ends by opening an optimization PR. */
export function AgentCard() {
  const reduce = !!useReducedMotion();
  const { run, statusStart, exploring, steps, statusEnd, pr } = HOW_IT_WORKS.agents;

  return (
    <Panel>
      {/* Panel A — the agent run log */}
      <motion.div
        variants={scaleIn(reduce)}
        className={cn("absolute left-9 top-[70px] h-[276px] w-[470px]", CARD)}
      >
        <div className={cn("absolute inset-x-0 top-0 flex h-12 items-center gap-3 border-b px-3", BAR)}>
          <span className="flex items-center bg-[#1f9b8b] px-3 py-2 font-mono text-sm font-medium leading-none text-white">
            {run.label}
          </span>
          <span className="font-mono text-sm font-medium text-foreground">
            <span className="text-foreground/50">#</span>
            {run.ref}
          </span>
          <span className="ml-auto font-mono text-sm font-medium whitespace-nowrap text-foreground">
            {run.branch}
          </span>
        </div>

        <motion.p
          variants={fade(reduce, 0.2)}
          className="absolute top-[63px] left-[15px] text-sm whitespace-nowrap text-foreground/80"
        >
          {statusStart}
        </motion.p>

        <motion.div
          variants={fade(reduce, 0.35)}
          className="absolute top-[99px] left-[15px] flex items-center gap-2"
        >
          <Code2 className="size-[18px] text-foreground" aria-hidden />
          <span className="text-sm whitespace-nowrap text-foreground">{exploring}</span>
        </motion.div>

        {/* log connector + lines */}
        <motion.div
          variants={growY(reduce, 0.5)}
          className="absolute top-[134px] left-[25px] h-[90px] w-px origin-top rounded-full bg-foreground/20"
        />
        <motion.div
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.12, delayChildren: 0.55 } },
          }}
          className="absolute top-[134px] left-[42px] w-[362px] text-xs leading-[1.5] text-foreground/50"
        >
          {steps.map((s, i) => (
            <motion.p key={i} variants={fade(reduce, 0, 6)}>
              {s}
            </motion.p>
          ))}
        </motion.div>

        <motion.p
          variants={fade(reduce, 1.2)}
          className="absolute top-[239px] left-[15px] text-sm whitespace-nowrap text-foreground/80"
        >
          {statusEnd}
        </motion.p>
      </motion.div>

      {/* Panel B — the opened PR (slides up last) */}
      <motion.div
        variants={fade(reduce, 1.35, 16)}
        className={cn("absolute left-9 top-[362px] h-[195px] w-[470px]", CARD)}
      >
        <div className={cn("absolute inset-x-0 top-0 flex h-12 items-center gap-3 border-b px-3", BAR)}>
          <span className="flex items-center bg-[rgba(31,155,139,0.1)] px-3 py-2 font-mono text-sm font-medium leading-none text-[#057c6d] dark:text-[#48c9b8]">
            {pr.label}
          </span>
          <span className="font-mono text-sm font-medium text-foreground">
            <span className="text-foreground/50">#</span>
            {pr.ref}
          </span>
          <span className="ml-auto font-mono text-sm font-medium whitespace-nowrap text-foreground">
            <span className="text-foreground/50">by</span> {pr.by}
          </span>
        </div>

        <p className="absolute top-[63px] left-[15px] w-[440px] text-base font-medium text-foreground/80">
          <span className="text-[#1f9b8b] dark:text-[#3dbfae]">{pr.type}</span> {pr.title}
        </p>
        <p className="absolute top-[94px] left-[15px] w-[326px] text-xs leading-[1.5] text-foreground/50">
          {pr.description}
        </p>

        <div
          className={cn("absolute inset-x-0 bottom-0 flex h-12 items-center gap-1 border-t px-3 font-mono text-sm", BAR)}
        >
          <span className="text-[#096d7d] dark:text-[#3dbfae]">{pr.additions}</span>
          <span className="text-[#dc2626] dark:text-[#ed9696]">{pr.deletions}</span>
        </div>
      </motion.div>
    </Panel>
  );
}
