"use client";

import { motion } from "motion/react";

import { Marker } from "@/components/concepts/hero-4/runners-panel";
import { fmt, type NodeSpec } from "./run-graph-data";
import { useCountUp } from "./use-count-up";

/**
 * One DAG node, absolutely placed in the graph-body space. `kind:"job"` renders
 * a single status row with a count-up duration; `kind:"matrix"` renders a
 * stacked/tabbed card with a job-count line and a "Show all jobs" affordance.
 * All run state is derived from the current beat.
 */
export function GraphNode({
  node,
  beat,
  reduce,
}: {
  node: NodeSpec;
  beat: number;
  reduce: boolean;
}) {
  const shown = beat >= node.runAt;
  const passed = beat >= node.passAt;
  const running = shown && !passed;
  const seconds = useCountUp(node.target, { active: running, settled: passed, reduce });

  return (
    <div
      className="absolute"
      style={{ left: node.x, top: node.y, width: node.w, height: node.h }}
    >
      {node.kind === "matrix" && <StackedBehind />}
      <div className="relative flex h-full flex-col justify-center gap-2 border border-hairline bg-header px-4 shadow-[0_0_12px_rgba(8,12,13,0.03)]">
        {node.kind === "matrix" ? (
          <MatrixBody node={node} shown={shown} passed={passed} reduce={reduce} />
        ) : (
          <JobBody node={node} shown={shown} passed={passed} reduce={reduce} seconds={seconds} />
        )}
      </div>
    </div>
  );
}

/** Two faint offset rectangles behind a matrix card, implying the job stack. */
function StackedBehind() {
  return (
    <>
      <div className="absolute top-3 left-3 size-full border border-hairline bg-header opacity-40" />
      <div className="absolute top-1.5 left-1.5 size-full border border-hairline bg-header opacity-70" />
    </>
  );
}

function MatrixBody({
  node,
  shown,
  passed,
  reduce,
}: {
  node: NodeSpec;
  shown: boolean;
  passed: boolean;
  reduce: boolean;
}) {
  const jobs = node.jobs ?? 0;
  const status = passed
    ? `${jobs} jobs completed`
    : shown
      ? `Running ${jobs} jobs`
      : `${jobs} jobs queued`;

  return (
    <>
      <span className="font-mono text-[0.8125rem] font-medium whitespace-nowrap text-foreground">
        {node.label}
      </span>
      <div className="flex items-center gap-2">
        <Marker
          shown={shown}
          ticked={passed}
          done={false}
          delay={node.delay + 0.1}
          reduce={reduce}
        />
        <span className="font-mono text-[0.75rem] font-medium whitespace-nowrap text-foreground/80">
          {status}
        </span>
      </div>
      <span className="font-mono text-[0.6875rem] whitespace-nowrap text-foreground/40">
        Show all jobs
      </span>
    </>
  );
}

function JobBody({
  node,
  shown,
  passed,
  reduce,
  seconds,
}: {
  node: NodeSpec;
  shown: boolean;
  passed: boolean;
  reduce: boolean;
  seconds: number;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <Marker
        shown={shown}
        ticked={passed}
        done={false}
        delay={node.delay + 0.1}
        reduce={reduce}
      />
      <span className="font-mono text-[0.8125rem] font-medium whitespace-nowrap text-foreground">
        {node.label}
      </span>
      <motion.span
        initial={false}
        animate={{ opacity: shown ? 1 : 0 }}
        transition={{ duration: 0.3, delay: shown ? 0.2 : 0 }}
        className="ml-auto font-mono text-[0.6875rem] uppercase whitespace-nowrap text-foreground/50"
      >
        {fmt(seconds)}
      </motion.span>
    </div>
  );
}
