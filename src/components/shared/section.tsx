import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Eyebrow } from "@/components/shared/eyebrow";

/**
 * Standard section wrapper rendering the Figma "blueprint" frame: full-bleed
 * with 60px side gutters and hairline vertical rails around a max-width column.
 * Light sections share the `border-hairline` color; dark sections override it
 * via `containerClassName`. Pass `id` to enable anchor-scroll links from the nav.
 */
export function Section({
  id,
  className,
  containerClassName,
  children,
}: {
  id?: string;
  className?: string;
  containerClassName?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={cn("w-full px-6 sm:px-[60px]", className)}>
      <div
        className={cn(
          "mx-auto w-full max-w-[1320px] border-x border-hairline px-6 py-20 sm:px-14 sm:py-28",
          containerClassName,
        )}
      >
        {children}
      </div>
    </section>
  );
}

/** Eyebrow + title + subtitle block. Defaults to centered; pass align="start" for left-aligned. */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "start";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex max-w-2xl flex-col gap-4",
        align === "center" ? "mx-auto items-center text-center" : "items-start",
        className,
      )}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2 className="text-h2 font-heading font-medium text-balance">{title}</h2>
      {subtitle ? (
        <p className="text-pretty text-foreground/70">{subtitle}</p>
      ) : null}
    </div>
  );
}
