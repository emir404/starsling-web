import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

import { BlogBody } from "@/components/blog/blog-body";
import { BlogToc } from "@/components/blog/blog-toc";
import { buttonVariants } from "@/components/ui/button";
import { SITE_CONFIG } from "@/lib/site";
import { cn } from "@/lib/utils";
import type { Customer } from "@/types/customers";
import { AuthorLockup, CustomerWordmark } from "./customer-bits";
import { CustomerMetrics } from "./customer-metrics";
import { CaseStudyTimeline } from "./case-study-timeline";
import { CaseStudySpeedups } from "./case-study-speedups";

export function CaseStudyView({
  customer,
  related,
}: {
  customer: Customer;
  related: Customer[];
}) {
  const headings = [
    ...customer.body
      .filter((b) => b.type === "heading")
      .map((b) => ({ id: b.id, text: b.text })),
    ...(customer.prs?.length ? [{ id: "timeline", text: "Agent activity" }] : []),
    ...(customer.speedups?.length
      ? [{ id: "speedups", text: "Workflow speedups" }]
      : []),
  ];

  const meta = [customer.industry, customer.location, customer.funding].filter(
    Boolean,
  );

  return (
    <article className="w-full px-6 sm:px-[60px]">
      <div className="mx-auto w-full max-w-[1320px] border-x border-y border-hairline px-6 py-12 sm:px-14 sm:py-16">
        <Link
          href="/customers"
          className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.04em] text-foreground/55 uppercase transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          All customers
        </Link>

        {/* hero */}
        <header className="mt-10 max-w-[820px]">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <CustomerWordmark customer={customer} />
            {customer.repo ? (
              <span className="font-mono text-sm text-foreground/55">
                {customer.repo}
              </span>
            ) : null}
          </div>
          <h1 className="mt-5 font-heading text-[2.25rem] leading-[1.08] font-medium tracking-[-0.03em] text-balance sm:text-[2.75rem]">
            {customer.headline}
          </h1>
          {meta.length > 0 ? (
            <p className="mt-5 flex flex-wrap gap-x-3 font-mono text-xs tracking-[0.02em] text-foreground/55 uppercase">
              {meta.map((m, i) => (
                <span key={m} className="flex gap-x-3">
                  {i > 0 ? <span aria-hidden>·</span> : null}
                  {m}
                </span>
              ))}
            </p>
          ) : null}
        </header>

        <CustomerMetrics metrics={customer.metrics} className="mt-10" />

        {/* body + TOC */}
        <div className="mt-12 lg:flex lg:gap-12">
          <div className="w-full max-w-[760px]">
            <figure className="mb-10 border-l-2 border-brand bg-brand/[0.04] py-5 pr-5 pl-6">
              <blockquote className="font-heading text-xl leading-[1.4] font-medium tracking-[-0.01em] text-balance text-foreground">
                &ldquo;{customer.quote.text}&rdquo;
              </blockquote>
              <figcaption className="mt-4">
                <AuthorLockup quote={customer.quote} />
              </figcaption>
            </figure>

            <BlogBody blocks={customer.body} />
            <CaseStudyTimeline
              migrationDate={customer.migrationDate}
              prs={customer.prs}
            />
            <CaseStudySpeedups speedups={customer.speedups} />

            {/* CTA */}
            <div className="mt-14 flex flex-wrap items-center gap-3 border-t border-hairline pt-10">
              <a
                href={SITE_CONFIG.links.github}
                target="_blank"
                rel="noreferrer"
                className={cn(buttonVariants())}
              >
                Get Started For Free
              </a>
              <Link
                href={SITE_CONFIG.links.demo}
                className={cn(buttonVariants({ variant: "outline" }))}
              >
                Book a demo
              </Link>
            </div>
          </div>

          {headings.length > 0 ? (
            <aside className="mt-12 hidden shrink-0 lg:mt-0 lg:block lg:w-[212px]">
              <div className="sticky top-28">
                <BlogToc headings={headings} />
              </div>
            </aside>
          ) : null}
        </div>

        {/* related stories */}
        {related.length > 0 ? (
          <div className="mt-16 border-t border-hairline pt-10">
            <h2 className="font-heading text-xl font-medium tracking-[-0.01em] text-foreground">
              More customer stories
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {related.map((c) => (
                <Link
                  key={c.slug}
                  href={`/customers/${c.slug}`}
                  className="group flex items-center justify-between gap-4 border border-hairline p-5 transition-colors hover:bg-band"
                >
                  <span className="flex flex-col gap-2">
                    <CustomerWordmark customer={c} className="h-6" />
                    <span className="text-sm text-foreground/70">
                      <span className="font-medium text-brand">
                        {c.headlineMetric.value}
                      </span>{" "}
                      {c.headlineMetric.label}
                    </span>
                  </span>
                  <ArrowUpRight className="size-4 shrink-0 text-foreground/40 transition-colors group-hover:text-foreground" />
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </article>
  );
}
