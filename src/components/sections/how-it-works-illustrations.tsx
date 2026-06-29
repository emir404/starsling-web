"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { Code2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { HOW_IT_WORKS } from "@/content/how-it-works";

/**
 * The three animated illustrations for the "How it works" section (Figma
 * 282:135 / 286:2304 / 286:2386). Each card ships in two layouts behind a
 * `variant` prop:
 *   • "desktop" (default) — the exact Figma mockup at its native pixel size,
 *     centered + scaled to fit the stage by the parent. Reused as-is by
 *     `cta-editor-stage.tsx`, which depends on `EditorCard` being 950px wide.
 *   • "mobile" — a fluid, `w-full` reflow that fills the phone width at legible
 *     type instead of being scaled down to ~27% (the old behavior). Both layouts
 *     share the same content, motion factories, choreography delays, and
 *     reduced-motion branches, so the story and timing are identical at any size.
 */

/** Shared easing — the same curve the concept animations and site header use. */
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

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

/** Mockup-card chrome: translucent white on the teal stage, with a dark skin. */
const CARD =
  "border border-black/5 bg-white/95 shadow-[0_0_16px_0_rgba(0,0,0,0.03)] backdrop-blur-[10px] dark:border-white/5 dark:bg-[#2a3232]/95";
/** Mockup header/footer bar surface. */
const BAR = "border-black/5 bg-white dark:border-white/5 dark:bg-[#384343]";

/** Root motion wrapper so each mockup replays its choreography when it mounts. */
const ROOT = { hidden: {}, show: {} } as const;

/** Which layout a card renders — desktop keeps the native Figma size. */
type CardVariant = "desktop" | "mobile";
type CardProps = { variant?: CardVariant };

/* ------------------------------- Step 1 -------------------------------- */

type CodeRow = {
  n: string;
  tone?: "rm" | "add";
  strike?: boolean;
  comment?: boolean;
  seg: { t: string; kw?: boolean }[];
};

type EditorProps = { reduce: boolean; filename: string; rows: CodeRow[] };

/** Code-editor mockup whose line 7 swaps ubuntu-latest → starsling-ubuntu. */
export function EditorCard({ variant = "desktop" }: CardProps) {
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

  return variant === "mobile" ? (
    <EditorMobile reduce={reduce} filename={filename} rows={rows} />
  ) : (
    <EditorDesktop reduce={reduce} filename={filename} rows={rows} />
  );
}

/** Native Figma size (950×360). Unchanged — `cta-editor-stage.tsx` depends on it. */
function EditorDesktop({ reduce, filename, rows }: EditorProps) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={ROOT}
      className={cn("relative h-[360px] w-[950px] overflow-hidden", CARD)}
    >
      {/* title bar */}
      <div className={cn("absolute inset-x-0 top-0 flex h-12 items-center border-b", BAR)}>
        <span className="ml-5 size-2 rounded-full bg-foreground/20" />
        <span className="ml-2 size-2 rounded-full bg-foreground/20" />
        <span className="ml-2 size-2 rounded-full bg-foreground/20" />
        <div className="mx-3 flex h-8 flex-1 items-center justify-start px-3 bg-foreground/[0.03]">
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
  );
}

/** Fluid reflow: the same editor as a `w-full` card with normal-flow code rows. */
function EditorMobile({ reduce, filename, rows }: EditorProps) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={ROOT}
      className={cn("relative w-full overflow-hidden", CARD)}
    >
      {/* title bar */}
      <div className={cn("flex h-11 items-center border-b px-3", BAR)}>
        <span className="size-2 rounded-full bg-foreground/20" />
        <span className="ml-2 size-2 rounded-full bg-foreground/20" />
        <span className="ml-2 size-2 rounded-full bg-foreground/20" />
        <span className="ml-3 truncate font-mono text-xs text-foreground">{filename}</span>
      </div>

      {/* code — rows reflow; the rm/add rows carry their own swap highlight */}
      <div className="overflow-x-auto py-3 font-mono text-xs leading-[1.7] whitespace-pre [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {rows.map((row, i) => {
          const isAdd = row.tone === "add";
          const isRm = row.tone === "rm";
          return (
            <div key={i} className="relative flex h-[1.7em] items-center px-3">
              {isRm && (
                <motion.span
                  aria-hidden
                  variants={wipeX(reduce, 0.4)}
                  className="absolute inset-0 bg-[rgba(239,68,68,0.15)]"
                />
              )}
              {isAdd && (
                <motion.span
                  aria-hidden
                  variants={wipeX(reduce, 0.6)}
                  className="absolute inset-0 bg-[rgba(12,144,166,0.15)] dark:bg-[rgba(22,199,228,0.15)]"
                />
              )}
              <span
                className={cn(
                  "relative w-6 shrink-0",
                  isRm
                    ? "text-[#dc2626] dark:text-[#ed9696]"
                    : isAdd
                      ? "text-[#096d7d] dark:text-[#4fbfd1]"
                      : "text-foreground/30",
                )}
              >
                {row.n}
              </span>
              {isAdd ? (
                <motion.span
                  variants={wipeX(reduce, 0.65)}
                  className="relative text-[#096d7d] dark:text-[#4fbfd1]"
                >
                  {row.seg.map((s, j) => (
                    <span key={j}>{s.t}</span>
                  ))}
                </motion.span>
              ) : (
                <span
                  className={cn(
                    "relative",
                    isRm && "text-[#dc2626] line-through dark:text-[#ed9696]",
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
          );
        })}
      </div>
    </motion.div>
  );
}

/* ------------------------------- Step 2 -------------------------------- */

/** Job-start coordinates within the 776×328 timeline plane (Figma 286:2635). */
const JOB_DOTS = [
  { l: 72, t: 166 },
  { l: 42, t: 129 },
  { l: 78, t: 67 },
  { l: 42, t: 264 },
  { l: 42, t: 79 },
  { l: 69, t: 117 },
  { l: 36, t: 199 },
  { l: 79, t: 226 },
];

/** "8 jobs in parallel" timeline: dots cluster left of the 1:42 finish line. */
export function TimelineCard({ variant = "desktop" }: CardProps) {
  const reduce = !!useReducedMotion();
  return variant === "mobile" ? (
    <TimelineMobile reduce={reduce} />
  ) : (
    <TimelineDesktop reduce={reduce} />
  );
}

/** Native Figma size (841×360). */
function TimelineDesktop({ reduce }: { reduce: boolean }) {
  const { jobsLabel, saved, allDone, allDoneNote, start, baseline } = HOW_IT_WORKS.speed;

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={ROOT}
      className={cn("relative h-[360px] w-[841px] overflow-hidden", CARD)}
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

      {/* timeline plane (776 × 328, left-anchored, vertically centered) */}
      <div className="absolute left-[39px] top-1/2 h-[328px] w-[776px] -translate-y-1/2">
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
          className="absolute top-[250px] left-[116px] h-px w-[667px] origin-left bg-[#1f9b8b]"
        />
        <motion.div
          variants={pop(reduce, 1.15)}
          className="absolute top-[235px] left-[387px] flex items-center bg-[#1f9b8b] px-3 py-2"
        >
          <span className="font-mono text-sm font-medium leading-none text-white">{saved}</span>
        </motion.div>
      </div>
    </motion.div>
  );
}

/** Fluid reflow: the timeline plane scales to `w-full`; offsets become percentages. */
function TimelineMobile({ reduce }: { reduce: boolean }) {
  const { jobsLabel, saved, allDone, start, baseline } = HOW_IT_WORKS.speed;
  /** Percent of the original 776×328 plane, so the cluster keeps its shape. */
  const px = (v: number, total: number) => `${(v / total) * 100}%`;

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={ROOT}
      className={cn("relative w-full overflow-hidden p-4", CARD)}
    >
      {/* faint blueprint grid */}
      <div
        aria-hidden
        className="absolute inset-0 text-foreground/[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative h-[clamp(14rem,56vw,17rem)] w-full">
        {/* finish line + GitHub baseline */}
        <motion.div
          variants={fade(reduce, 0.3)}
          className="absolute top-[6%] bottom-[15%] w-px border-l border-dashed border-[#2cd4be]"
          style={{ left: px(110, 776) }}
        />
        <motion.div
          variants={fade(reduce, 1.1)}
          className="absolute top-[6%] bottom-[15%] right-0 w-px border-l border-dashed border-foreground/10"
        />

        {/* labels */}
        <motion.p
          variants={fade(reduce, 0.1)}
          className="absolute top-0 left-0 font-mono text-[11px] font-medium text-foreground"
        >
          {jobsLabel}
        </motion.p>
        <motion.p
          variants={fade(reduce, 0.1)}
          className="absolute bottom-0 left-0 font-mono text-[11px] text-foreground/80"
        >
          {start}
        </motion.p>
        <motion.p
          variants={fade(reduce, 0.4)}
          className="absolute bottom-0 font-mono text-[11px] text-[#2cd4be]"
          style={{ left: px(110, 776) }}
        >
          {allDone}
        </motion.p>
        <motion.p
          variants={fade(reduce, 1.1)}
          className="absolute bottom-0 right-0 font-mono text-[11px] text-foreground/80"
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
              style={{ left: px(d.l, 776), top: px(d.t, 328) }}
              className="absolute size-2.5 rounded-full bg-[#2cd4be]"
            />
          ))}
        </motion.div>

        {/* the slow GitHub baseline job */}
        <motion.span
          variants={fade(reduce, 1.1)}
          style={{ left: px(406, 776), top: px(276, 328) }}
          className="absolute size-2.5 rounded-full bg-foreground/30"
        />

        {/* saved connector + badge */}
        <motion.div
          variants={growX(reduce, 0.9)}
          className="absolute right-0 h-px origin-left bg-[#1f9b8b]"
          style={{ left: px(110, 776), top: px(250, 328) }}
        />
        <motion.div
          variants={pop(reduce, 1.15)}
          className="absolute left-1/2 flex -translate-x-1/2 items-center bg-[#1f9b8b] px-2 py-1"
          style={{ top: px(224, 328) }}
        >
          <span className="font-mono text-[11px] font-medium leading-none text-white">{saved}</span>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ------------------------------- Step 3 -------------------------------- */

/** Agent run-log + the optimization PR it opens, shown side by side. */
export function AgentCard({ variant = "desktop" }: CardProps) {
  const reduce = !!useReducedMotion();
  return variant === "mobile" ? (
    <AgentMobile reduce={reduce} />
  ) : (
    <AgentDesktop reduce={reduce} />
  );
}

/** Native Figma size (956 wide, two side-by-side sub-cards). */
function AgentDesktop({ reduce }: { reduce: boolean }) {
  const { run, statusStart, exploring, steps, statusEnd, pr } = HOW_IT_WORKS.agents;

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={ROOT}
      className="flex w-[956px] items-end gap-4"
    >
      {/* Card A — the agent run log */}
      <motion.div variants={scaleIn(reduce)} className={cn("relative h-[276px] w-[470px] overflow-hidden", CARD)}>
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

      {/* Card B — the opened PR (slides in last) */}
      <motion.div
        variants={fade(reduce, 1.35, 16)}
        className={cn("relative h-[195px] w-[470px] overflow-hidden", CARD)}
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
    </motion.div>
  );
}

/** Fluid reflow: the run log and the PR stack vertically, each `w-full`. */
function AgentMobile({ reduce }: { reduce: boolean }) {
  const { run, statusStart, exploring, steps, statusEnd, pr } = HOW_IT_WORKS.agents;

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={ROOT}
      className="flex w-full flex-col gap-4"
    >
      {/* Card A — the agent run log */}
      <motion.div variants={scaleIn(reduce)} className={cn("relative w-full overflow-hidden", CARD)}>
        <div className={cn("flex h-11 items-center gap-2 border-b px-3", BAR)}>
          <span className="flex items-center bg-[#1f9b8b] px-2 py-1 font-mono text-[11px] font-medium leading-none text-white">
            {run.label}
          </span>
          <span className="font-mono text-xs font-medium text-foreground">
            <span className="text-foreground/50">#</span>
            {run.ref}
          </span>
          <span className="ml-auto font-mono text-xs font-medium text-foreground">{run.branch}</span>
        </div>

        <div className="flex flex-col gap-2.5 px-3 py-3">
          <motion.p variants={fade(reduce, 0.2)} className="text-xs text-foreground/80">
            {statusStart}
          </motion.p>

          <motion.div variants={fade(reduce, 0.35)} className="flex items-center gap-2">
            <Code2 className="size-4 shrink-0 text-foreground" aria-hidden />
            <span className="text-xs text-foreground">{exploring}</span>
          </motion.div>

          {/* log connector + lines */}
          <div className="relative pl-4">
            <motion.div
              variants={growY(reduce, 0.5)}
              className="absolute top-1 bottom-1 left-1 w-px origin-top rounded-full bg-foreground/20"
            />
            <motion.div
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.12, delayChildren: 0.55 } },
              }}
              className="flex flex-col gap-1 text-[11px] leading-[1.45] text-foreground/50"
            >
              {steps.map((s, i) => (
                <motion.p key={i} variants={fade(reduce, 0, 6)}>
                  {s}
                </motion.p>
              ))}
            </motion.div>
          </div>

          <motion.p variants={fade(reduce, 1.2)} className="text-xs text-foreground/80">
            {statusEnd}
          </motion.p>
        </div>
      </motion.div>

      {/* Card B — the opened PR (slides in last) */}
      <motion.div variants={fade(reduce, 1.35, 16)} className={cn("relative w-full overflow-hidden", CARD)}>
        <div className={cn("flex h-11 items-center gap-2 border-b px-3", BAR)}>
          <span className="flex items-center bg-[rgba(31,155,139,0.1)] px-2 py-1 font-mono text-[11px] font-medium leading-none text-[#057c6d] dark:text-[#48c9b8]">
            {pr.label}
          </span>
          <span className="font-mono text-xs font-medium text-foreground">
            <span className="text-foreground/50">#</span>
            {pr.ref}
          </span>
          <span className="ml-auto font-mono text-xs font-medium text-foreground">
            <span className="text-foreground/50">by</span> {pr.by}
          </span>
        </div>

        <div className="flex flex-col gap-1.5 px-3 py-3">
          <p className="text-sm font-medium text-foreground/80">
            <span className="text-[#1f9b8b] dark:text-[#3dbfae]">{pr.type}</span> {pr.title}
          </p>
          <p className="text-[11px] leading-[1.5] text-foreground/50">{pr.description}</p>
        </div>

        <div className={cn("flex h-10 items-center gap-1 border-t px-3 font-mono text-xs", BAR)}>
          <span className="text-[#096d7d] dark:text-[#3dbfae]">{pr.additions}</span>
          <span className="text-[#dc2626] dark:text-[#ed9696]">{pr.deletions}</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
