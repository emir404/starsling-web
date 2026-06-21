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

/** A customer testimonial shown in the testimonials carousel. */
export type Testimonial = {
  quote: string;
  /** Exact substring of `quote` to wrap in the teal <Highlight> marker (e.g. a @handle). */
  highlight?: string;
  author: string;
  /** Secondary line under the name, e.g. "Founder, Better Auth". */
  role: string;
  /** Company name — used for avatar/logo alt text. */
  company: string;
  /** Path to the author's avatar image in /public. */
  avatarSrc: string;
  /** Optional company wordmark (SVG in /public/logos) shown in the author card. */
  logoSrc?: string;
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

/** Caption (bold lead + body) shown beneath a "How it works" illustration. */
export type HowItWorksCaption = {
  title: string;
  description: string;
};

/**
 * Copy for the three-step "How it works" section (Figma 234:547 light /
 * 234:4818 dark). Each card pairs a caption with an animated illustration; this
 * holds the editable copy (captions + the marketing-relevant strings inside the
 * mockups). Purely visual scaffolding (YAML keywords, dot positions, the grid)
 * lives in the illustration component.
 */
export type HowItWorksContent = {
  title: string;
  subtitle: string;
  /** Card 1 — the one-line runner swap in a code editor. */
  install: {
    caption: HowItWorksCaption;
    /** Filename shown in the editor tab. */
    filename: string;
    /** The struck-through "before" line (line 7). */
    swapFrom: string;
    /** The teal "after" line that replaces it. */
    swapTo: string;
  };
  /** Card 2 — the parallel-jobs timeline. */
  speed: {
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
  /** Card 3 — the agent run that opens an optimization PR. */
  agents: {
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
