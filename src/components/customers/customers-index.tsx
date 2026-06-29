import Link from "next/link";

import { BlueprintColumn } from "@/components/shared/blueprint-strip";
import { Eyebrow } from "@/components/shared/eyebrow";
import type { Customer } from "@/types/customers";
import { CustomerCard } from "./customer-card";
import { CustomerWordmark } from "./customer-bits";

export function CustomersIndex({ customers }: { customers: Customer[] }) {
  return (
    <div className="w-full px-6 sm:px-[60px]">
      <div className="relative mx-auto w-full max-w-[1320px] overflow-hidden border-x border-t border-hairline px-6 py-16 sm:px-14 sm:py-24">
        {/* faint motif side rails (Figma 102:11, teal on light) */}
        <BlueprintColumn
          count={5}
          className="pointer-events-none absolute top-20 left-3 hidden text-[#334d52]/60 lg:flex"
        />
        <BlueprintColumn
          count={5}
          className="pointer-events-none absolute top-20 right-3 hidden text-[#334d52]/60 lg:flex"
        />

        <header className="relative mx-auto max-w-3xl text-center">
          <Eyebrow>Customers</Eyebrow>
          <h1 className="mt-4 font-heading text-[2.5rem] leading-[1.05] font-medium tracking-[-0.03em] text-balance sm:text-[3.25rem]">
            Teams that have upgraded to self-driving CI
          </h1>
          <p className="mt-4 text-pretty text-foreground/70">
            Fast GitHub Actions runners with AI agents that ship optimization
            PRs &mdash; here&rsquo;s what that looks like in production.
          </p>
        </header>

        {/* featured headline metrics */}
        <div className="relative mt-12 grid gap-px overflow-hidden border border-hairline bg-hairline sm:grid-cols-3">
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

        {/* case-study cards */}
        <div className="relative mt-6 flex flex-col gap-6">
          {customers.map((c) => (
            <CustomerCard key={c.slug} customer={c} />
          ))}
        </div>
      </div>
    </div>
  );
}
