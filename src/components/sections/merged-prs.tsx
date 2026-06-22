import { GitMerge } from "lucide-react";

import { Section, SectionHeading } from "@/components/shared/section";
import { MERGED_PRS_CONTENT } from "@/content/merged-prs";

/**
 * "Real PRs from StarSling agents" (Figma 282:529) — a proof grid of real,
 * merged optimization PRs the agents opened on customer repos. Each card is a
 * link to the live GitHub PR. Static server component; the green "Merged"
 * accents are literal values since the teal-branded palette has no green token.
 */
export function MergedPrs() {
  const { title, subtitle, cta, prs } = MERGED_PRS_CONTENT;

  return (
    <Section
      id="merged-prs"
      containerClassName="border-b border-hairline py-20 sm:py-[120px]"
    >
      <SectionHeading align="start" title={title} subtitle={subtitle} />

      <div className="mt-16 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {prs.map((pr) => (
          <a
            key={pr.url}
            href={pr.url}
            target="_blank"
            rel="noreferrer"
            aria-label={`View pull request "${pr.type} ${pr.title}" on GitHub (opens in new tab)`}
            className="group flex min-h-[340px] flex-col bg-band p-6 shadow-[0_0_24px_0_rgba(0,0,0,0.02)] transition-shadow hover:shadow-[0_0_32px_0_rgba(0,0,0,0.06)]"
          >
            {/* Status */}
            <div className="flex items-center gap-2 text-green-600">
              <GitMerge className="size-5" aria-hidden />
              <span className="text-lg font-medium">{pr.status}</span>
            </div>

            {/* Title + description */}
            <div className="mt-5 flex flex-col gap-2">
              <h3 className="text-xl font-medium leading-snug">
                <span className="text-brand-dark">{pr.type} </span>
                <span className="text-foreground/90">{pr.title}</span>
              </h3>
              <p className="text-sm leading-normal text-foreground/70">
                {pr.description}
              </p>
            </div>

            {/* Impact metrics */}
            <div className="mt-5 flex flex-wrap gap-2">
              {pr.stats.map((stat) => (
                <div key={stat.label} className="bg-green-500/10 px-4 py-3">
                  <div className="font-mono text-2xl font-semibold leading-none text-green-700/80">
                    {stat.value}
                  </div>
                  <div className="mt-2 font-mono text-sm font-medium uppercase leading-none text-green-700/80">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer: repo wordmark + view-PR affordance */}
            <div className="mt-auto flex items-center justify-between gap-4 pt-6">
              {/* eslint-disable-next-line @next/next/no-img-element -- static logo SVGs; next/image adds no value for inline vectors */}
              <img
                src={pr.repo.logo}
                alt={pr.repo.name}
                width={pr.repo.width}
                height={pr.repo.height}
                className="h-5 w-auto dark:invert"
              />
              <span className="bg-foreground/10 px-3.5 py-2.5 font-mono text-sm font-medium uppercase text-foreground transition-colors group-hover:bg-foreground/20">
                {cta}
              </span>
            </div>
          </a>
        ))}
      </div>
    </Section>
  );
}
