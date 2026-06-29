import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { Customer } from "@/types/customers";
import { AuthorLockup, CustomerWordmark } from "./customer-bits";

export function CustomerCard({ customer }: { customer: Customer }) {
  const primary = customer.metrics[0];

  return (
    <Link
      href={`/customers/${customer.slug}`}
      className="group flex flex-col gap-7 p-6 transition-colors hover:bg-band sm:p-8"
    >
      <div className="flex items-center justify-between gap-4">
        <CustomerWordmark customer={customer} />
        <span className="font-heading text-2xl font-medium tracking-[-0.02em] text-brand">
          {customer.headlineMetric.value}{" "}
          <span className="text-base font-normal text-foreground/60">
            {customer.headlineMetric.label}
          </span>
        </span>
      </div>

      <blockquote className="text-lg leading-[1.45] text-foreground sm:text-xl">
        &ldquo;{customer.quote.text}&rdquo;
      </blockquote>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-x-6 gap-y-4 pt-1">
        <AuthorLockup quote={customer.quote} />
        <div className="flex items-center gap-5">
          {primary?.detail ? (
            <span className="hidden font-mono text-sm text-foreground/70 sm:inline">
              {primary.detail}
            </span>
          ) : null}
          <span className="inline-flex items-center gap-1 font-mono text-xs tracking-[0.04em] text-foreground/55 uppercase transition-colors group-hover:text-foreground">
            Case study
            <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
