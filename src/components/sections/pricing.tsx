"use client";

import Link from "next/link";
import { CheckIcon } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "motion/react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/shared/section";
import { EASE } from "@/components/concepts/shared/motion";
import {
  PRICING_HEADER,
  PRICING_TIERS,
  PRICING_YC_NOTE,
} from "@/content/pricing";

/**
 * Pricing section (Figma 234:922): a left-aligned headline over three
 * edge-sharing hairline cards — the middle "Usage Based" tier highlighted in
 * teal with a faint blueprint texture — and a YC-alumni discount note below.
 * Header, cards, and note blur/fade-up in sequence when scrolled into view.
 */
export function Pricing() {
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
    <Section id="pricing" containerClassName="bg-band">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        <motion.div variants={fadeUp}>
          <SectionHeading
            align="start"
            className="max-w-3xl"
            title={PRICING_HEADER.title}
            subtitle={PRICING_HEADER.subtitle}
          />
        </motion.div>

        <div className="mt-12 grid grid-cols-1 [&>*:not(:first-child)]:-mt-px lg:grid-cols-3 lg:[&>*:not(:first-child)]:mt-0 lg:[&>*:not(:first-child)]:-ml-px">
          {PRICING_TIERS.map((tier) => (
            <motion.div
              key={tier.name}
              variants={fadeUp}
              className={cn(
                "relative isolate flex flex-col gap-8 overflow-hidden border border-hairline p-8",
                tier.highlighted ? "z-10 bg-highlight" : "bg-card",
              )}
            >
              {tier.highlighted ? <BlueprintTexture /> : null}

              <p className="text-xl font-medium tracking-[-0.02em] text-foreground/75">
                {tier.name}
              </p>

              <p className="font-heading text-5xl font-medium tracking-[-0.02em]">
                {tier.price}
                {tier.priceUnit ? (
                  <span className="text-2xl font-normal tracking-normal text-foreground/80">
                    {tier.priceUnit}
                  </span>
                ) : null}
              </p>

              <div className="flex flex-1 flex-col gap-5">
                <p className="text-foreground/75">{tier.description}</p>
                <ul className="flex flex-col gap-4">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <CheckIcon
                        className="mt-0.5 size-5 shrink-0 text-brand"
                        aria-hidden
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href={tier.href}
                className={cn(buttonVariants(), "w-full")}
              >
                {tier.cta}
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.p
          variants={fadeUp}
          className="mt-8 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-foreground/80"
        >
          <span>{PRICING_YC_NOTE.prefix}</span>
          <span className="inline-flex items-center gap-1">
            {/* eslint-disable-next-line @next/next/no-img-element -- static brand SVG; next/image adds no value for an inline vector */}
            <img
              src="/logos/yc.svg"
              alt="Y"
              width={14}
              height={14}
              className="size-3.5"
            />
            <span className="font-medium text-[#ff6600]">
              {PRICING_YC_NOTE.brand}
            </span>
          </span>
          <span>{PRICING_YC_NOTE.suffix}</span>
          <Link
            href={PRICING_YC_NOTE.cta.href}
            className="font-medium underline underline-offset-2 transition-colors hover:text-foreground"
          >
            {PRICING_YC_NOTE.cta.label}
          </Link>
        </motion.p>
      </motion.div>
    </Section>
  );
}

/**
 * Faint blueprint motif behind the highlighted card — concentric "orbital"
 * rings and vertical guide lines in low-alpha brand teal. Decorative only.
 */
function BlueprintTexture() {
  const ring = (cx: string, cy: string, r1: number, r2: number) =>
    `radial-gradient(circle at ${cx} ${cy}, transparent 0 ${r1}px, rgba(12,144,166,0.10) ${r1}px ${r1 + 1.5}px, transparent ${r1 + 1.5}px ${r2}px, rgba(12,144,166,0.08) ${r2}px ${r2 + 1.5}px, transparent ${r2 + 1.5}px)`;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10"
      style={{
        backgroundImage: [
          ring("84%", "15%", 15, 28),
          ring("91%", "58%", 19, 34),
          ring("9%", "86%", 14, 25),
          "repeating-linear-gradient(to right, transparent 0 39px, rgba(12,144,166,0.05) 39px 40px)",
        ].join(", "),
      }}
    />
  );
}
