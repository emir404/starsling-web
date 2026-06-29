import Link from "next/link";

import { Eyebrow } from "@/components/shared/eyebrow";
import type { Customer } from "@/types/customers";
import { CustomerCard } from "./customer-card";
import { CustomerWordmark } from "./customer-bits";

export function CustomersIndex({ customers }: { customers: Customer[] }) {
  return (
    <div className="w-full px-6 sm:px-[60px]">
      {/* No top border: the SocialProof band above already closes with a
          border-b, so the seam stays a single 1.5px hairline. */}
      <div className="mx-auto w-full max-w-[1320px] border-x border-hairline px-6 py-16 sm:px-14 sm:py-24">
        <header className="mx-auto max-w-3xl text-center">
          <Eyebrow>Customers</Eyebrow>
          <h1 className="mt-4 font-heading text-[2.5rem] leading-[1.05] font-medium tracking-[-0.03em] text-balance sm:text-[3.25rem]">
            Teams that have upgraded to self-driving CI
          </h1>
          <p className="mt-4 text-pretty text-foreground/70">
            Fast GitHub Actions runners with AI agents that ship optimization
            PRs &mdash; here&rsquo;s what that looks like in production.
          </p>
        </header>

        {/* Featured headline metrics — one connected hairline grid (gap-px over a
            hairline ground draws the internal rules). */}
        <div className="mt-14 grid gap-px overflow-hidden border border-hairline bg-hairline sm:grid-cols-3">
          {customers.map((c) => (
            <Link
              key={c.slug}
              href={`/customers/${c.slug}`}
              className="group flex flex-col items-center gap-3 bg-background p-8 text-center transition-colors hover:bg-band"
            >
              <CustomerWordmark customer={c} className="h-6" />
              <span className="font-heading text-4xl font-medium tracking-[-0.02em] text-brand sm:text-5xl">
                {c.headlineMetric.value}
              </span>
              <span className="text-sm text-foreground/70">
                {c.headlineMetric.label}
              </span>
            </Link>
          ))}
        </div>

        {/* Case-study cards — a single bordered stack with hairline dividers so the
            rows read as a connected blueprint grid (not floating cards). */}
        <div className="mt-6 divide-y divide-hairline border border-hairline">
          {customers.map((c) => (
            <CustomerCard key={c.slug} customer={c} />
          ))}
        </div>
      </div>
    </div>
  );
}
