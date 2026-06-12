"use client";

import { useRouter } from "next/navigation";
import { motion, useReducedMotion, type Variants } from "motion/react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HERO_CONTENT } from "@/content/hero";
import type { HeroContent } from "@/types/content";
import { EASE } from "@/components/concepts/shared/motion";

/**
 * Hero text for concept 6 (Figma 217:528): the shared hero copy fully
 * centered — badge over the display headline, description, then the waitlist
 * form. Same staggered entrance as the shared group; submit routes to the
 * waitlist CTA.
 */
export function HeroTextCenter({
  content = HERO_CONTENT,
  className,
}: {
  content?: HeroContent;
  className?: string;
}) {
  const router = useRouter();
  const reduce = useReducedMotion();

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
      className={cn("flex w-full flex-col items-center gap-5 text-center", className)}
    >
      <div className="flex w-full flex-col items-center gap-4">
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

      <div className="flex w-full flex-col items-center gap-10 lg:gap-14">
        <motion.p
          variants={fadeUp}
          className="max-w-[19.875rem] text-lg leading-[1.4] text-foreground/80"
        >
          {content.description}
        </motion.p>
        <motion.form
          variants={fadeUp}
          className="flex w-full max-w-[28.5625rem] gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            router.push(content.form.href);
          }}
        >
          <Input
            type="email"
            name="email"
            aria-label="Email address"
            placeholder={content.form.placeholder}
            className="flex-1 dark:bg-white/10"
          />
          <Button type="submit" className="px-4 text-base">
            {content.form.cta}
          </Button>
        </motion.form>
      </div>
    </motion.div>
  );
}
