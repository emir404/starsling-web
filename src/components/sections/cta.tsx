import Link from "next/link";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Section } from "@/components/shared/section";
import { SITE_CONFIG } from "@/lib/site";

export function Cta() {
  return (
    <Section id="waitlist" className="border-b-0">
      <div className="mx-auto flex max-w-3xl flex-col items-center rounded-2xl border border-border bg-card px-8 py-16 text-center">
        <h2 className="font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Ship faster with self-driving CI
        </h2>
        <p className="mt-4 max-w-lg text-muted-foreground text-pretty">
          Join the waitlist and let AI agents take over your build pipeline.
        </p>
        <Link
          href={SITE_CONFIG.links.waitlist}
          className={cn(buttonVariants({ size: "lg" }), "mt-8")}
        >
          Join the Waitlist
        </Link>
      </div>
    </Section>
  );
}
