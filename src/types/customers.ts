import type { BlogBlock } from "@/types/blog";

/**
 * Case-study content model. Customers are authored as typed modules (like the
 * blog) and reuse `BlogBlock` for the long-form body, so the same `BlogBody`
 * renderer styles them. The structured fields (metrics, PR timeline, speedups)
 * drive the case-study–specific header, timeline, and before/after chart.
 */

/** A headline stat, e.g. value "5.87×", label "Faster combined-store tests". */
export type CustomerMetric = {
  value: string;
  label: string;
  /** Optional before→after detail, e.g. "29m 56s → 5m 06s". */
  detail?: string;
};

/** One merged optimization PR an agent opened, shown on the timeline. */
export type CaseStudyPr = {
  /** Display id, e.g. "#13466". */
  id: string;
  title: string;
  /** ISO date, e.g. "2026-02-24". */
  date?: string;
  href?: string;
};

/** One row of the before/after speedup chart. */
export type SpeedupBar = {
  label: string;
  /** Improvement factor, e.g. "5.87×". */
  factor: string;
  before?: string;
  after?: string;
};

export type Customer = {
  /** URL segment under /customers. */
  slug: string;
  company: string;
  /** Wordmark SVG under /public/logos; falls back to the name as text. */
  logoSrc?: string;
  /** Source repo, e.g. "mastra-ai/mastra". */
  repo?: string;
  industry?: string;
  location?: string;
  funding?: string;
  /** Big featured stat on the index row, e.g. value "6×", label "faster CI". */
  headlineMetric: { value: string; label: string };
  /** One-line summary for the index card + meta description. */
  summary: string;
  /** Long headline for the detail-page hero. */
  headline: string;
  quote: { text: string; author: string; role: string; avatarSrc?: string };
  /** Up to three key stats shown in the detail header + the index card. */
  metrics: CustomerMetric[];
  /** ISO date the customer migrated. */
  migrationDate?: string;
  /** Merged optimization PRs, oldest first (the timeline). */
  prs?: CaseStudyPr[];
  /** Before/after rows for the speedup chart. */
  speedups?: SpeedupBar[];
  /** Long-form body — problem → solution → results — reusing the blog blocks. */
  body: BlogBlock[];
};
