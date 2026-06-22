import type { MergedPrsContent } from "@/types/content";

const MASTRA = { name: "Mastra", logo: "/logos/mastra.svg", width: 128, height: 20 };
const BETTER_AUTH = {
  name: "Better Auth",
  logo: "/logos/better-auth.svg",
  width: 155,
  height: 20,
};

/**
 * The "Real PRs from StarSling agents" section (Figma 282:529). These are the
 * real merged PRs shown on starsling.dev; each card links to the live GitHub PR.
 * Titles + URLs are the actual PRs; descriptions and stats are derived from each
 * PR's body and GitHub file stats.
 */
export const MERGED_PRS_CONTENT: MergedPrsContent = {
  title: "Real PRs from StarSling agents",
  subtitle:
    "Pull Requests merged by customers. StarSling agents analyze and optimize your CI automatically.",
  cta: "View PR",
  prs: [
    {
      repo: MASTRA,
      status: "Merged",
      type: "test(chroma):",
      title:
        "reduce fixed 2000ms waitForIndexing sleep to 200ms and add Docker healthcheck",
      description:
        "Chroma's test job burned ~160s of every run on 80 fixed 2-second sleeps. The agent cut the sleep to 200ms, pinned the Docker image, and added a healthcheck so the suite waits only as long as it needs.",
      stats: [
        { value: "−1.8S", label: "per sleep" },
        { value: "−74%", label: "chroma job" },
        { value: "3", label: "files changed" },
      ],
      url: "https://github.com/mastra-ai/mastra/pull/13866",
    },
    {
      repo: BETTER_AUTH,
      status: "Merged",
      type: "chore(ci):",
      title: "optimize Playwright browser installs in E2E",
      description:
        "The E2E workflow installed all three Playwright browsers on every run, but only Chromium is used. The agent installed Chromium alone and cached the binaries by version.",
      stats: [
        { value: "−2", label: "browsers" },
        { value: "100%", label: "cache hit" },
        { value: "2", label: "files changed" },
      ],
      url: "https://github.com/better-auth/better-auth/pull/8073",
    },
    {
      repo: BETTER_AUTH,
      status: "Merged",
      type: "chore:",
      title: "fix turbo cache configuration in ci",
      description:
        "TURBO_CACHE: remote:rw silently disabled Turborepo's local cache, leaving a stale 68MB artifact that was never regenerated. The agent fixed the cache configuration so builds reuse work.",
      stats: [
        { value: "−68MB", label: "stale cache" },
        { value: "+0/−9", label: "lines" },
        { value: "3", label: "files changed" },
      ],
      url: "https://github.com/better-auth/better-auth/pull/7950",
    },
    {
      repo: MASTRA,
      status: "Merged",
      type: "ci:",
      title: "shard E2E kitchen-sink across 3 parallel jobs",
      description:
        "The kitchen-sink E2E job was the pipeline's blocker at ~7.8min P50. The agent sharded its 35 spec files across 3 parallel jobs with Playwright's native --shard flag — no test code touched.",
      stats: [
        { value: "−3.5M", label: "wall clock" },
        { value: "3×", label: "parallelism" },
        { value: "0", label: "test code" },
      ],
      url: "https://github.com/mastra-ai/mastra/pull/15888",
    },
  ],
};
