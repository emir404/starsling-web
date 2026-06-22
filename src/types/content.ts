import type { LucideIcon } from "lucide-react";

/** A single navigation or footer link. `shortcut` is the keyboard hint shown as [X] in the header nav. */
export type NavLink = {
  label: string;
  href: string;
  shortcut?: string;
};

/** A titled group of links in the footer. */
export type FooterColumn = {
  title: string;
  links: NavLink[];
};

/** A product feature card. */
export type Feature = {
  title: string;
  description: string;
  icon: LucideIcon;
};

/** A headline metric (e.g. "80% faster builds"). */
export type Stat = {
  value: string;
  label: string;
};

/** A problem-statement row in the "bottleneck" section: glyph, title (with an emphasized phrase), and body. */
export type BottleneckRow = {
  icon: LucideIcon;
  /** Full title. `highlight` marks the substring rendered inside <Highlight>. */
  title: string;
  highlight: string;
  body: string;
};

/** One bar in the before/after CI comparison diagram. */
export type BottleneckBar = {
  /** Floating chip label, e.g. "Before AI". */
  chip: string;
  coding: { label: string; value: string };
  ci: { label: string; value: string };
  /** CI's share of total cycle time, e.g. "8%". */
  ciShare: string;
  /** flex-grow ratios for the [coding, ci] segments. */
  ratio: [number, number];
  /** Red treatment (the "With AI" bar). */
  danger?: boolean;
};

/** Copy + data for the "CI is the new bottleneck" section. */
export type BottleneckContent = {
  title: string;
  subtitle: string;
  rows: BottleneckRow[];
  bars: BottleneckBar[];
};

/** A pricing plan. */
export type PricingTier = {
  name: string;
  price: string;
  /** Small unit suffix rendered after the price, e.g. "/min". */
  priceUnit?: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  highlighted?: boolean;
};

/** A single FAQ question/answer pair. */
export type FaqItem = {
  question: string;
  answer: string;
};

/** A stat chip shown on a testimonial card, e.g. "8.2x" / "Shorter job queue". */
export type TestimonialMetric = {
  /** Headline figure, e.g. "8.2x" or "5.87×" (rendered uppercase in mono). */
  value: string;
  /** What improved, e.g. "Shorter job queue". */
  label: string;
  /** Supporting detail, e.g. "14m 48s → 1m 48s". */
  detail: string;
};

/** A customer testimonial shown in the testimonials marquee. */
export type Testimonial = {
  quote: string;
  /** Exact substring of `quote` to wrap in the teal <Highlight> marker. */
  highlight?: string;
  author: string;
  /** Secondary line under the name, e.g. "Co-Founder, Mastra". */
  role: string;
  /** Company name — wordmark fallback text + avatar/logo alt text. */
  company: string;
  /** Path to the author's avatar image in /public. */
  avatarSrc: string;
  /** Optional company wordmark (SVG in /public/logos); falls back to `company` as text. */
  logoSrc?: string;
  /** Up to two stat chips shown along the bottom of the card. */
  metrics?: TestimonialMetric[];
};

/** A customer logo rendered from a monochrome SVG in /public/logos. */
export type CustomerLogo = {
  name: string;
  /** Path under /public, e.g. "/logos/google.svg". */
  src: string;
  /** Intrinsic dimensions (px) for aspect ratio + to avoid layout shift. */
  width: number;
  height: number;
};

/** An agent that opens PRs, shown in a feed card's "Opened by" lockup. */
export type PrsAgent = {
  name: string;
  /** Wordmark SVG under /public/logos, e.g. "/logos/cursor.svg". */
  logo: string;
  /** Intrinsic dimensions (px) for aspect ratio + to avoid layout shift. */
  width: number;
  height: number;
};

/** One run of the closing paragraph; `highlight` wraps it in the teal <Highlight> marker. */
export type PrsParagraphSegment = {
  text: string;
  highlight?: boolean;
};

/**
 * Copy for the dark "The PRs don't stop coming" section. Its colors are fixed
 * across light/dark, so this carries only text + the agents cycled in the feed.
 */
export type PrsContent = {
  title: string;
  subtitle: string;
  /** Label above the live counter, e.g. "TIME ELAPSED". */
  timeLabel: string;
  /** The (deliberately repeated) placeholder PR shown on every card. */
  pr: { type: string; description: string };
  /** Agents cycled through the feed — one per card, in order. */
  agents: PrsAgent[];
  /** Closing paragraph, split into runs so multiple phrases can be highlighted. */
  paragraph: PrsParagraphSegment[];
};

/** One labelled impact metric shown in a merged-PR card (e.g. "−3.5M" / "wall clock"). */
export type MergedPrStat = {
  value: string;
  label: string;
};

/** A real, merged optimization PR opened by a StarSling agent on a customer repo. */
export type MergedPr = {
  /** Source repository, shown as a wordmark in the card footer. */
  repo: {
    name: string;
    /** Wordmark SVG under /public/logos, e.g. "/logos/mastra.svg". */
    logo: string;
    /** Intrinsic dimensions (px) for aspect ratio + to avoid layout shift. */
    width: number;
    height: number;
  };
  /** Status badge text, e.g. "Merged". */
  status: string;
  /** Conventional-commit prefix rendered in teal, e.g. "test(chroma):". */
  type: string;
  /** Remainder of the PR title, after the prefix. */
  title: string;
  /** One- or two-sentence summary of what the agent changed. */
  description: string;
  /** Exactly three impact metrics. */
  stats: MergedPrStat[];
  /** GitHub PR URL the card links to. */
  url: string;
};

/** Copy + data for the "Real PRs from StarSling agents" proof section. */
export type MergedPrsContent = {
  title: string;
  subtitle: string;
  /** Label on each card's link button, e.g. "View PR". */
  cta: string;
  prs: MergedPr[];
};

/** Tone of a single line in the installation diff card. */
export type DiffLineTone = "context" | "removed" | "added";

/** One line of the install YAML diff: a gutter `marker` (line number or +/-) plus its `text`. */
export type DiffLine = {
  marker: string;
  text: string;
  tone: DiffLineTone;
};

/**
 * Copy for the dark "Install with a one-line change" section. Its colors are
 * fixed across light/dark (like the PRs band), so this carries only text + the
 * diff rows rendered in the snippet card.
 */
export type InstallationContent = {
  title: string;
  subtitle: string;
  /** Filename shown in the card's header row. */
  filename: string;
  diff: DiffLine[];
};

/** Pipeline stages shown in the hero concept stepper. Steps without a scene yet are listed but skipped by the cycle. */
export type HeroStepId = "input" | "planning" | "parallel" | "output";

/** Copy for the hero concepts. The text group is shared across concepts; only the visual changes. */
export type HeroContent = {
  /** "Backed by [YC mark] Combinator" — the mark renders between prefix and suffix. */
  badge: { prefix: string; suffix: string };
  headline: string;
  description: string;
  form: { placeholder: string; cta: string; href: string };
  steps: { id: HeroStepId; label: string }[];
  /** Right-hand caption lines inside the illustration band. */
  caption: string[];
};

/** Copy for the closing CTA band (Figma node 234:1143). */
export type CtaContent = {
  title: string;
  subtitle: string;
  /** Waitlist email-capture form (same shape as HeroContent.form). */
  form: { placeholder: string; cta: string; href: string };
};

/**
 * Copy + media for the product-demo video section (Figma node 282:879). The
 * MP4 is served from Vercel Blob (kept out of the repo, streamed with range
 * requests so the custom scrubber can seek); the poster still is committed
 * under /public/videos.
 */
export type VideoSectionContent = {
  /** MP4 source — a Vercel Blob CDN URL. */
  src: string;
  /** Poster still shown before playback, under /public. */
  poster: string;
  /** Accessible description of the clip, used as the <video> aria-label. */
  label: string;
};

/** Caption (bold lead + body) shown beneath a "How it works" illustration. */
export type HowItWorksCaption = {
  title: string;
  description: string;
};

/**
 * Copy for the three-step "How it works" section (Figma 282:135 / 286:2304 /
 * 286:2386). The three steps share one stage and a tab bar; each step pairs a
 * tab label with an animated illustration. This holds the editable copy (tab
 * labels, captions, and the marketing-relevant strings inside the mockups).
 * Purely visual scaffolding (YAML keywords, dot positions, the grid) lives in
 * the illustration component.
 */
export type HowItWorksContent = {
  title: string;
  subtitle: string;
  /** Step 1 — the one-line runner swap in a code editor. */
  install: {
    /** Tab label, e.g. "Swap one line." */
    tab: string;
    caption: HowItWorksCaption;
    /** Filename shown in the editor tab. */
    filename: string;
    /** The struck-through "before" line (line 7). */
    swapFrom: string;
    /** The teal "after" line that replaces it. */
    swapTo: string;
  };
  /** Step 2 — the parallel-jobs timeline. */
  speed: {
    /** Tab label, e.g. "See the results in your first test." */
    tab: string;
    caption: HowItWorksCaption;
    /** Mono label, e.g. "8 JOBS IN PARALLEL". */
    jobsLabel: string;
    /** Badge text, e.g. "6M 34S SAVED". */
    saved: string;
    /** The teal "all done" time, e.g. "1:42". */
    allDone: string;
    /** Parenthetical after the all-done time, e.g. "(ALL DONE)". */
    allDoneNote: string;
    /** Left axis label, e.g. "0:00". */
    start: string;
    /** Right axis label = the GitHub baseline, e.g. "8:16". */
    baseline: string;
  };
  /** Step 3 — the agent run that opens an optimization PR. */
  agents: {
    /** Tab label, e.g. "Agents keep making it faster." */
    tab: string;
    caption: HowItWorksCaption;
    /** Run header: badge label, run number, branch. */
    run: { label: string; ref: string; branch: string };
    /** Opening status line above the activity log. */
    statusStart: string;
    /** Activity-log heading next to the code glyph. */
    exploring: string;
    /** Bulleted agent activity-log lines. */
    steps: string[];
    /** Closing status line below the log. */
    statusEnd: string;
    /** The opened PR card. */
    pr: {
      label: string;
      ref: string;
      by: string;
      /** Conventional-commit prefix rendered in teal, e.g. "feat(ci):". */
      type: string;
      title: string;
      description: string;
      additions: string;
      deletions: string;
    };
  };
};
