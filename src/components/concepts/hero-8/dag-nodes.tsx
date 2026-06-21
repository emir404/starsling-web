"use client";

import { motion } from "motion/react";

import { cn } from "@/lib/utils";
import { Marker } from "@/components/concepts/hero-4/runners-panel";
import { Reveal } from "@/components/concepts/shared/reveal";
import { NODES, type NodeSpec } from "./dag-data";

/**
 * The four DAG nodes, each positioned in canvas space. The two matrix groups
 * carry a parallel bank of job dials (hero-4's `Marker`) that spin up together
 * and tick green in one burst — the optimization read; the single node and the
 * merge gate are pills. Sources dim once the gate passes so the eye lands on
 * the verdict.
 */
export function DagNodes({ step, reduce }: { step: number; reduce: boolean }) {
  return (
    <div className="absolute inset-0">
      {NODES.map((node) =>
        node.kind === "matrix" ? (
          <MatrixGroupNode key={node.id} node={node} step={step} reduce={reduce} />
        ) : node.kind === "single" ? (
          <SingleTestNode key={node.id} node={node} step={step} reduce={reduce} />
        ) : (
          <SinkNode key={node.id} node={node} step={step} reduce={reduce} />
        ),
      )}
    </div>
  );
}

function box(node: NodeSpec) {
  return { left: node.x, top: node.y, width: node.w, height: node.h };
}

function MatrixGroupNode({
  node,
  step,
  reduce,
}: {
  node: NodeSpec;
  step: number;
  reduce: boolean;
}) {
  const shown = step >= node.at;
  const ticked = step >= node.tickAt;
  const done = node.doneAt !== undefined && step >= node.doneAt;

  return (
    <Reveal
      shown={shown}
      delay={0.05}
      reduce={reduce}
      hidden={{ opacity: 0, y: 14, scale: 0.97, filter: "blur(6px)" }}
      style={box(node)}
    >
      <div className="relative size-full border border-rail bg-field">
        {/* folder tab */}
        <div className="absolute -top-[13px] left-3 flex h-[26px] items-center border border-rail border-b-0 bg-card px-2.5">
          <span className="font-mono text-[0.6875rem] font-medium tracking-wide uppercase text-foreground/70">
            {node.title}
          </span>
        </div>
        <div className="flex h-full flex-col justify-center gap-3 px-3.5 pt-3">
          {/* parallel job bank — spins up together, ticks in one burst */}
          <div className="flex items-center gap-1.5">
            {node.jobs?.map((job) => (
              <Marker
                key={job.name}
                shown={shown}
                ticked={ticked}
                done={done}
                delay={0.1 + job.tickDelay}
                reduce={reduce}
              />
            ))}
          </div>
          {/* summary line */}
          <div className="flex items-center justify-between gap-2">
            <span
              className={cn(
                "font-mono text-[0.6875rem] font-medium uppercase transition-colors delay-150 duration-500",
                ticked ? "text-foreground/55" : "text-brand",
              )}
            >
              {ticked ? node.jobsLabel : node.runningLabel}
            </span>
            <span className="font-mono text-[0.625rem] uppercase text-foreground/35">
              Show all jobs
            </span>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

function SingleTestNode({
  node,
  step,
  reduce,
}: {
  node: NodeSpec;
  step: number;
  reduce: boolean;
}) {
  const shown = step >= node.at;
  const ticked = step >= node.tickAt;
  const done = node.doneAt !== undefined && step >= node.doneAt;

  return (
    <Reveal
      shown={shown}
      delay={0.05}
      reduce={reduce}
      hidden={{ opacity: 0, y: 14, scale: 0.97, filter: "blur(6px)" }}
      style={box(node)}
    >
      <div className="relative flex size-full items-center gap-2.5 border border-rail bg-field px-3.5">
        <Marker shown={shown} ticked={ticked} done={done} delay={0.1} reduce={reduce} />
        <span className="font-mono text-[0.8125rem] font-medium uppercase text-foreground/85">
          {node.title}
        </span>
        <motion.span
          initial={false}
          animate={{ opacity: ticked ? 1 : 0 }}
          transition={{ duration: 0.3, delay: ticked ? 0.15 : 0 }}
          className="ml-auto font-mono text-[0.6875rem] uppercase text-foreground/45"
        >
          {node.time}
        </motion.span>
      </div>
    </Reveal>
  );
}

function SinkNode({
  node,
  step,
  reduce,
}: {
  node: NodeSpec;
  step: number;
  reduce: boolean;
}) {
  const shown = step >= node.at;
  const ticked = step >= node.tickAt;

  return (
    <Reveal
      shown={shown}
      delay={0.05}
      reduce={reduce}
      hidden={{ opacity: 0, scale: 0.96, filter: "blur(6px)" }}
      style={box(node)}
    >
      <div
        className={cn(
          "relative flex size-full items-center gap-3 border px-4 transition-colors duration-500",
          ticked ? "border-brand/50 bg-brand/10" : "border-rail bg-field",
        )}
      >
        <Marker shown={shown} ticked={ticked} done={false} delay={0.1} reduce={reduce} />
        <span className="font-mono text-sm font-medium uppercase text-foreground/90">
          {node.title}
        </span>
        <motion.span
          initial={false}
          animate={{ opacity: ticked ? 1 : 0 }}
          transition={{ duration: 0.3, delay: ticked ? 0.15 : 0 }}
          className="ml-auto font-mono text-[0.6875rem] uppercase text-brand"
        >
          {node.time}
        </motion.span>
      </div>
    </Reveal>
  );
}
