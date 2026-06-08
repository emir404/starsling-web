import Link from "next/link";
import { CheckIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Section, SectionHeading } from "@/components/shared/section";
import { PRICING_TIERS } from "@/content/pricing";

export function Pricing() {
  return (
    <Section id="pricing">
      <SectionHeading
        eyebrow="Pricing"
        title="Simple, usage-based pricing"
        subtitle="Start free. Pay only for what you build."
      />
      <div className="mt-14 grid items-start gap-6 lg:grid-cols-3">
        {PRICING_TIERS.map((tier) => (
          <Card
            key={tier.name}
            className={cn(
              "h-full",
              tier.highlighted && "border-brand ring-1 ring-brand",
            )}
          >
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <CardTitle>{tier.name}</CardTitle>
                {tier.highlighted ? <Badge>Popular</Badge> : null}
              </div>
              <div className="mt-2 font-heading text-3xl font-semibold tracking-tight">
                {tier.price}
              </div>
              <CardDescription>{tier.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col gap-2 text-sm">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <CheckIcon className="size-4 shrink-0 text-brand" aria-hidden />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Link
                href={tier.href}
                className={cn(
                  buttonVariants({
                    variant: tier.highlighted ? "default" : "outline",
                  }),
                  "w-full",
                )}
              >
                {tier.cta}
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </Section>
  );
}
