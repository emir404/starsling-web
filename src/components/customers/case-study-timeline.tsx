import { formatPostDate } from "@/content/blog";
import type { CaseStudyPr } from "@/types/customers";

/**
 * Agent-activity timeline: the migration date followed by each merged
 * optimization PR, on a hairline rail with sharp square nodes (blueprint style).
 */
export function CaseStudyTimeline({
  migrationDate,
  prs,
}: {
  migrationDate?: string;
  prs?: CaseStudyPr[];
}) {
  if (!prs || prs.length === 0) return null;

  return (
    <section className="mt-14">
      <h2
        id="timeline"
        className="mb-6 scroll-mt-28 font-heading text-[1.6rem] font-medium tracking-[-0.02em] text-foreground sm:text-[1.875rem]"
      >
        Agent activity
      </h2>
      <ol className="relative ml-1 flex flex-col border-l border-hairline">
        {migrationDate ? (
          <li className="relative pb-7 pl-6">
            <span className="absolute top-1 -left-[5px] size-2.5 bg-foreground" />
            <p className="font-mono text-xs tracking-[0.02em] text-foreground/55 uppercase">
              {formatPostDate(migrationDate)}
            </p>
            <p className="mt-1 font-medium text-foreground">
              Migrated to Starsling Runners
            </p>
          </li>
        ) : null}

        {prs.map((pr) => (
          <li key={pr.id} className="relative pb-7 pl-6 last:pb-0">
            <span className="absolute top-1.5 -left-[5px] size-2.5 bg-brand" />
            <p className="font-mono text-xs tracking-[0.02em] text-foreground/55 uppercase">
              {[pr.date ? formatPostDate(pr.date) : null, pr.id]
                .filter(Boolean)
                .join(" · ")}
            </p>
            {pr.href ? (
              <a
                href={pr.href}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-block font-medium text-foreground transition-colors hover:text-brand"
              >
                {pr.title}
              </a>
            ) : (
              <p className="mt-1 font-medium text-foreground">{pr.title}</p>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
