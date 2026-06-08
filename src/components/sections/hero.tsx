import Link from "next/link";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/shared/section";
import { AnimatedGroup } from "@/components/shared/animated-group";
import { SITE_CONFIG } from "@/lib/site";

export function Hero() {
  return (
    <Section id="hero" className="border-b-0 pt-28 sm:pt-36">
      <AnimatedGroup className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <Badge variant="secondary" className="mb-6">
          Backed by Y Combinator
        </Badge>
        <h1 className="font-heading text-5xl font-semibold tracking-tight text-balance sm:text-6xl">
          {SITE_CONFIG.tagline}
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted-foreground text-pretty">
          {SITE_CONFIG.description}
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href={SITE_CONFIG.links.waitlist}
            className={cn(buttonVariants({ size: "lg" }))}
          >
            Join the Waitlist
          </Link>
          <Link
            href="/features"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
          >
            See how it works
          </Link>
        </div>
      </AnimatedGroup>
    </Section>
  );
}
