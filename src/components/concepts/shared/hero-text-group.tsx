"use client";

import { useState } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HERO_CONTENT } from "@/content/hero";
import type { HeroContent } from "@/types/content";
import { EASE } from "@/components/concepts/shared/motion";
import { useWaitlist } from "@/hooks/use-waitlist";

/**
 * Hero text group, shared by every hero concept (Figma 196:3205 / 196:3213 / 196:3218).
 * Two columns at `lg` (badge + display headline left; description + waitlist form right),
 * stacked below. Entrance staggers badge → headline → description → form with
 * blur/position/opacity. The form has no backend yet — submit routes to the waitlist CTA.
 */
export function HeroTextGroup({
  content = HERO_CONTENT,
  className,
}: {
  content?: HeroContent;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const { status, error, submit } = useWaitlist();
  const [email, setEmail] = useState("");

  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
  };
  const fadeUp: Variants = reduce
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.35 } },
      }
    : {
        hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
        visible: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { duration: 0.6, ease: EASE },
        },
      };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className={cn(
        "mx-auto flex w-full max-w-[90rem] flex-col gap-8 px-6 pt-10 pb-12 md:px-12 lg:grid lg:grid-cols-[minmax(0,1fr)_28.5625rem] lg:items-start lg:gap-8 lg:px-[7.5rem] lg:pt-[4.1875rem] lg:pb-24",
        className,
      )}
    >
      <div className="flex max-w-[37.1875rem] flex-col items-start gap-4">
        <motion.p
          variants={fadeUp}
          className="flex items-center gap-1.5 text-sm font-medium tracking-[-0.01em] drop-shadow-[0_1px_12px_rgba(4,21,10,0.1)]"
        >
          {content.badge.prefix}
          {/* eslint-disable-next-line @next/next/no-img-element -- static brand SVG; next/image adds no value for an inline vector */}
          <img src="/logos/yc.svg" alt="Y" width={16} height={16} className="size-4" />
          {content.badge.suffix}
        </motion.p>
        <motion.h1 variants={fadeUp} className="text-display font-medium">
          {content.headline}
        </motion.h1>
      </div>

      <div className="flex w-full flex-col items-start lg:pt-[1.125rem]">
        <motion.p
          variants={fadeUp}
          className="text-lg leading-[1.4] text-foreground/80 lg:max-w-[19.875rem]"
        >
          {content.description}
        </motion.p>
        {status === "success" ? (
          <motion.p
            variants={fadeUp}
            className="mt-6 flex w-full items-center gap-2.5 font-mono text-sm uppercase tracking-[0.02em] text-foreground"
          >
            <span aria-hidden className="size-3 shrink-0 bg-brand" />
            You’re on the list — we’ll be in touch.
          </motion.p>
        ) : (
          <motion.form
            variants={fadeUp}
            className="mt-6 w-full"
            onSubmit={(event) => {
              event.preventDefault();
              submit(email);
            }}
          >
            <div className="flex w-full gap-2">
              <Input
                type="email"
                name="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                aria-label="Email address"
                aria-invalid={status === "error" || undefined}
                disabled={status === "submitting"}
                placeholder={content.form.placeholder}
                className="flex-1 dark:bg-white/10"
              />
              <Button type="submit" disabled={status === "submitting"} className="px-4 text-base">
                {status === "submitting" ? "Joining…" : content.form.cta}
              </Button>
            </div>
            {status === "error" ? (
              <p role="alert" className="mt-2 font-mono text-xs text-destructive">
                {error}
              </p>
            ) : null}
          </motion.form>
        )}
      </div>
    </motion.div>
  );
}
