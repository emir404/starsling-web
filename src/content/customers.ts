import type { Customer } from "@/types/customers";

/**
 * Case studies, in featured order. Authored from the live customer stories
 * (starsling.dev/customers). Quotes match the testimonials in
 * `content/testimonials.ts`; the structured metrics/PRs/speedups drive the
 * case-study header, timeline, and before/after chart.
 */

const BETTER_AUTH: Customer = {
  slug: "better-auth",
  company: "Better Auth",
  logoSrc: "/logos/better-auth.svg",
  repo: "better-auth/better-auth",
  industry: "Authentication · Developer tools",
  location: "San Francisco",
  funding: "$5M seed",
  headlineMetric: { value: "2×", label: "faster E2E" },
  summary:
    "The popular TypeScript auth framework halved its E2E suite and saved 20,000 CI minutes a month — with zero engineering effort.",
  headline:
    "How Better Auth got 2× faster E2E tests and cut 20,000 CI minutes a month with Starsling",
  quote: {
    text: "We've been using Starsling for Better Auth CI. It's been saving us countless hours, both with fast runners and their agent optimizing our CI.",
    author: "Bereket Engida",
    role: "Founder & CEO, Better Auth",
  },
  metrics: [
    { value: "2.22×", label: "Faster E2E tests", detail: "2m 22s → 1m 04s" },
    { value: "20,000", label: "CI minutes saved / month" },
    { value: "2×", label: "More weekly CI runs", detail: "~1,800 → ~4,000" },
  ],
  migrationDate: "2026-02-11",
  prs: [
    { id: "#3814", title: "Cache turbo build outputs across CI jobs", date: "2026-02-13" },
    { id: "#3851", title: "Add a Docker healthcheck for the test database", date: "2026-02-17" },
    { id: "#3927", title: "Skip redundant Playwright browser installs", date: "2026-02-20" },
  ],
  speedups: [
    { label: "E2E tests", factor: "2.22×", before: "2m 22s", after: "1m 04s" },
    { label: "Full CI", factor: "1.61×" },
  ],
  body: [
    {
      type: "paragraph",
      spans: [
        "Better Auth is the TypeScript authentication framework you've probably already used — 28K GitHub stars, 800+ contributors, and a community that's grown fast enough to nearly double its GitHub Actions usage since February 2026.",
      ],
    },
    { type: "heading", id: "problem", text: "The problem" },
    {
      type: "paragraph",
      spans: [
        "Every pull request waited about five minutes on E2E tests before it could merge. The slow tail came from the usual accumulation: ",
        { text: "turbo cache misses", bold: true },
        " that rebuilt work already done, a test database that wasn't ready when the suite started racing it, and Playwright reinstalling browsers on every run. None of it was hard to fix — it just never made it into a release ahead of an actual feature.",
      ],
    },
    { type: "heading", id: "solution", text: "The solution" },
    {
      type: "paragraph",
      spans: [
        "Within nine days of migrating, Starsling's agents had opened a series of optimization PRs against the repo — caching turbo outputs across jobs, adding a Docker healthcheck so tests wait for the database instead of sleeping, and skipping the redundant browser installs. Bereket's team reviewed and merged each one; the agents decided what to work on next.",
      ],
    },
    { type: "heading", id: "results", text: "The results" },
    {
      type: "paragraph",
      spans: [
        "E2E dropped from 2m 22s to 1m 04s, full CI got 1.61× faster, and the account now saves roughly 20,000 GitHub Actions minutes a month — all while CI runs doubled. No engineer spent a day on it.",
      ],
    },
  ],
};

const MASTRA: Customer = {
  slug: "mastra",
  company: "Mastra",
  logoSrc: "/logos/mastra.svg",
  repo: "mastra-ai/mastra",
  industry: "AI agent framework",
  location: "San Francisco",
  funding: "$35M Series A",
  headlineMetric: { value: "6×", label: "faster CI" },
  summary:
    "The most popular open-source TypeScript framework for AI agents made its slowest suite nearly 6× faster — agents handled it in the background.",
  headline: "How Mastra got 6× faster GitHub Actions tests with Starsling",
  quote: {
    text: "At Mastra we move so fast that the bottleneck becomes reviews and CI. Time spent compounds, and Starsling helps you realize how much time you're losing.",
    author: "Abhi Aiyer",
    role: "Co-founder & CTO, Mastra",
    avatarSrc: "/avatars/abhi-aiyer.png",
  },
  metrics: [
    { value: "5.87×", label: "Faster combined-store tests", detail: "29m 56s → 5m 06s" },
    { value: "8.2×", label: "Shorter job queue", detail: "14m 48s → 1m 48s" },
    { value: "40m 31s", label: "Slow-tail CI removed per commit" },
  ],
  migrationDate: "2026-02-24",
  prs: [
    { id: "#13466", title: "Migrate Combined store Tests to Starsling Runners", date: "2026-02-24", href: "https://github.com/mastra-ai/mastra/pull/13466" },
    { id: "#13610", title: "Replace MongoDB fixed sleeps with polling", date: "2026-02-28", href: "https://github.com/mastra-ai/mastra/pull/13610" },
    { id: "#13866", title: "Add a Chroma Docker healthcheck", date: "2026-03-07", href: "https://github.com/mastra-ai/mastra/pull/13866" },
    { id: "#13965", title: "Poll for Couchbase readiness", date: "2026-03-07", href: "https://github.com/mastra-ai/mastra/pull/13965" },
    { id: "#15888", title: "Shard the E2E kitchen-sink across 3 jobs", date: "2026-04-29", href: "https://github.com/mastra-ai/mastra/pull/15888" },
    { id: "#15895", title: "Fix the ClickHouse mutation-completion race", date: "2026-04-29", href: "https://github.com/mastra-ai/mastra/pull/15895" },
  ],
  speedups: [
    { label: "Combined store Tests", factor: "5.87×", before: "29m 56s", after: "5m 06s" },
    { label: "Workspace Cloud Tests", factor: "3.69×", before: "8m 44s", after: "2m 22s" },
    { label: "Memory Tests", factor: "1.94×", before: "12m 11s", after: "6m 16s" },
    { label: "E2E Tests", factor: "1.32×", before: "14m 16s", after: "10m 50s" },
  ],
  body: [
    {
      type: "paragraph",
      spans: [
        "Mastra is the most popular open-source TypeScript framework for building AI agents — 25K+ GitHub stars, 400+ contributors, and 600–700 merged PRs a month. Its slowest suite, the Combined store Tests, runs against 22 different vector and storage backends, so keeping CI fast had become an ongoing tax rather than a one-time fix.",
      ],
    },
    { type: "heading", id: "problem", text: "The problem" },
    {
      type: "paragraph",
      spans: [
        "The Combined store Tests ran about 30 minutes at the slow tail, with backend jobs sitting roughly 15 minutes in the queue before they even started. Underneath were fixed-duration sleeps standing in for real readiness checks, race conditions between services and test startup, and a flaky ClickHouse deletion path. As the framework grew, the maintenance tax compounded.",
      ],
    },
    { type: "heading", id: "solution", text: "The solution" },
    {
      type: "paragraph",
      spans: [
        "Over 73 days, Starsling agents opened ",
        { text: "14 PRs", bold: true },
        " without any engineer triage: polling instead of fixed sleeps across MongoDB, Chroma, and Couchbase; Docker healthchecks where services raced the test runner; sharding the E2E kitchen-sink across parallel jobs; and a fix for the ClickHouse race. Mastra's engineers reviewed and merged each one — the agents decided the priorities.",
      ],
    },
    { type: "heading", id: "results", text: "The results" },
    {
      type: "paragraph",
      spans: [
        "Combined store Tests went from 29m 56s to 5m 06s at p95, and queue wait under load dropped from ~15 minutes to under 2. The real win: CI optimization moved from manual engineering work to something that just happens in the background while the team ships.",
      ],
    },
  ],
};

const PARTCL: Customer = {
  slug: "partcl",
  company: "Partcl",
  industry: "Chip design · EDA",
  location: "San Francisco",
  funding: "$5M seed · Khosla Ventures",
  headlineMetric: { value: "13×", label: "cheaper CI" },
  summary:
    "The GPU-native chip-design startup cut CI cost 13× and queue time 16× while running 6× more jobs a day.",
  headline: "How Partcl cut GitHub Actions costs by 13× with Starsling",
  quote: {
    text: "Within a day of migrating to Starsling Runners, their agents opened up a PR that literally made our Rust CI tests 2x faster!",
    author: "Vamshi Balanaga",
    role: "Co-founder & CTO, Partcl",
    avatarSrc: "/avatars/vamshi-balanaga.png",
  },
  metrics: [
    { value: "13×", label: "Cheaper per run", detail: "vs self-hosted" },
    { value: "16×", label: "Shorter queue", detail: "9.5m → 35s" },
    { value: "6×", label: "More CI jobs / day", detail: "~640 → ~3,900" },
  ],
  migrationDate: "2026-04-02",
  prs: [
    { id: "#286", title: "Cache Rust build dependencies", date: "2026-04-03" },
    { id: "#301", title: "Parallelize the Rust test suite", date: "2026-04-10" },
    { id: "#327", title: "Cache build artifacts across shards", date: "2026-04-21" },
    { id: "#349", title: "Right-size runners from 64-core to 8-core", date: "2026-05-04" },
  ],
  speedups: [
    { label: "Slowest build shard", factor: "13×", before: "59–89m", after: "5–7m" },
  ],
  body: [
    {
      type: "paragraph",
      spans: [
        "Partcl builds GPU-native chip-design systems that compress weeks of iteration into seconds. After turning Starsling on, their CI volume surged 6× — and on a pipeline this computationally heavy, cost was the thing that mattered most.",
      ],
    },
    { type: "heading", id: "problem", text: "The problem" },
    {
      type: "paragraph",
      spans: [
        "Heavy workloads ran on oversized 64-core machines, the test suite wasn't parallelized, and there was no artifact caching across shards. At peak matrix execution, jobs queued up to 18 minutes against a fixed runner fleet — and 23% of runs were cancelled while still being billed.",
      ],
    },
    { type: "heading", id: "solution", text: "The solution" },
    {
      type: "paragraph",
      spans: [
        "Over five weeks, Starsling agents analyzed the workflows and opened eight optimization PRs — test parallelization, cross-shard caching, and right-sizing machines down from 64 cores to 8 — exactly the work the team never had capacity to prioritize on a chip company's roadmap.",
      ],
    },
    { type: "heading", id: "results", text: "The results" },
    {
      type: "paragraph",
      spans: [
        "Cost per run fell 13×, queue waits dropped 16× to about 35 seconds, billed cancellations went from 23% to 0%, and concurrent capacity grew from 6 to ~35 runners — all while volume climbed to roughly 3,900 jobs a day.",
      ],
    },
  ],
};

/** All case studies, in featured order. */
export const CUSTOMERS: Customer[] = [BETTER_AUTH, MASTRA, PARTCL];

export function getAllCustomers(): Customer[] {
  return CUSTOMERS;
}

export function getCustomerBySlug(slug: string): Customer | undefined {
  return CUSTOMERS.find((c) => c.slug === slug);
}

/** Map a testimonial company name → its case-study slug (for cross-linking). */
export const CASE_STUDY_SLUG_BY_COMPANY: Record<string, string> = {
  "Better Auth": "better-auth",
  Mastra: "mastra",
  Partcl: "partcl",
};
