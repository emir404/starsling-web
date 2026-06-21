"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";
import { EASE } from "@/components/concepts/shared/motion";
import { Reveal } from "@/components/concepts/shared/reveal";
import { CALLOUT, WORKFLOW } from "./dag-data";

/**
 * The workflow card frame: header (`starsling-ci.yml` / `on: pull_request`),
 * the decorative zoom cluster, and the speed/optimization value callout that
 * surfaces under the merge gate. The DAG connectors and nodes are drawn over
 * this frame by the stage.
 */
export function WorkflowCard({ step, reduce }: { step: number; reduce: boolean }) {
  return (
    <div
      className="absolute border border-rail bg-card shadow-[0_4px_24px_0_rgba(0,0,0,0.25)]"
      style={{ left: WORKFLOW.x, top: WORKFLOW.y, width: WORKFLOW.w, height: WORKFLOW.h }}
    >
      <div className="flex flex-col gap-1 px-9 pt-6">
        <span className="text-[0.9375rem] font-medium text-foreground/90">
          {WORKFLOW.file}
        </span>
        <span className="font-mono text-[0.6875rem] tracking-wide uppercase text-foreground/45">
          {WORKFLOW.on}
        </span>
      </div>

      <Callout step={step} reduce={reduce} />
      <ZoomControls />
    </div>
  );
}

function Callout({ step, reduce }: { step: number; reduce: boolean }) {
  const shown = step >= CALLOUT.at;

  return (
    <Reveal
      shown={shown}
      delay={0.1}
      reduce={reduce}
      hidden={{ opacity: 0, y: 12, filter: "blur(6px)" }}
      style={{ left: CALLOUT.x, top: CALLOUT.y, width: CALLOUT.w }}
    >
      <div className="flex flex-col gap-3">
        <span className="text-xl font-medium text-brand">{CALLOUT.primary}</span>
        <div className="flex flex-col gap-1.5">
          {CALLOUT.rows.map((row) => (
            <div key={row.label} className="flex items-center gap-2.5">
              <span className="w-24 shrink-0 font-mono text-[0.625rem] uppercase text-foreground/45">
                {row.label}
              </span>
              <div className="relative h-1.5 flex-1 bg-field">
                <motion.div
                  initial={false}
                  animate={{ scaleX: shown ? row.width / 100 : 0 }}
                  transition={{
                    duration: reduce ? 0.3 : 0.7,
                    ease: EASE,
                    delay: reduce ? 0 : 0.15,
                  }}
                  style={{ transformOrigin: "left" }}
                  className={cn(
                    "absolute inset-0",
                    row.brand ? "bg-brand" : "bg-foreground/25",
                  )}
                />
              </div>
              <span
                className={cn(
                  "w-12 shrink-0 text-right font-mono text-[0.625rem] uppercase",
                  row.brand ? "text-brand" : "text-foreground/45",
                )}
              >
                {row.time}
              </span>
            </div>
          ))}
        </div>
        <span className="font-mono text-[0.625rem] tracking-wide uppercase text-foreground/45">
          {CALLOUT.caption}
        </span>
      </div>
    </Reveal>
  );
}

function ZoomControls() {
  return (
    <div className="absolute right-6 bottom-5 flex items-center gap-1.5">
      <ZoomButton>
        <svg
          viewBox="0 0 16 16"
          className="size-3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
        >
          <path d="M2 5.5V2.5h3M14 5.5V2.5h-3M2 10.5v3h3M14 10.5v3h-3" />
        </svg>
      </ZoomButton>
      <ZoomButton>
        <svg
          viewBox="0 0 16 16"
          className="size-3.5"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
        >
          <path d="M3 8h10" />
        </svg>
      </ZoomButton>
      <ZoomButton>
        <svg
          viewBox="0 0 16 16"
          className="size-3.5"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
        >
          <path d="M8 3v10M3 8h10" />
        </svg>
      </ZoomButton>
    </div>
  );
}

function ZoomButton({ children }: { children: ReactNode }) {
  return (
    <span className="grid size-8 place-items-center border border-rail bg-field text-foreground/45">
      {children}
    </span>
  );
}
