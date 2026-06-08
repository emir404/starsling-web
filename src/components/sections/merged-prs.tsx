import { GitPullRequest } from "lucide-react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Section, SectionHeading } from "@/components/shared/section";

/** Placeholder set of AI-shipped optimization PRs. */
const MERGED_PRS = [
  { title: "Parallelize the test suite", repo: "acme/api", delta: "−42% build time" },
  { title: "Cache pnpm store between runs", repo: "acme/web", delta: "−31% build time" },
  { title: "Split lint into its own job", repo: "acme/infra", delta: "−18% build time" },
];

export function MergedPrs() {
  return (
    <Section id="merged-prs">
      <SectionHeading
        eyebrow="Real PRs"
        title="Optimizations our agents shipped"
        subtitle="Every improvement arrives as a reviewable pull request."
      />
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {MERGED_PRS.map((pr) => (
          <Card key={pr.title}>
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <GitPullRequest className="size-5 text-brand" aria-hidden />
                <Badge variant="secondary">{pr.delta}</Badge>
              </div>
              <CardTitle className="mt-2">{pr.title}</CardTitle>
              <CardDescription className="font-mono text-xs">
                {pr.repo}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </Section>
  );
}
