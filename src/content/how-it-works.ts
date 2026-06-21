import type { HowItWorksContent } from "@/types/content";

export const HOW_IT_WORKS: HowItWorksContent = {
  title: "How it works",
  subtitle: "AI made coding 10x faster. CI hasn't kept up, until now.",
  install: {
    caption: {
      title: "Swap one line. Install the app.",
      description:
        "Change ubuntu-latest to starsling-ubuntu-24.04. No YAML rewrites, no migration.",
    },
    filename: ".github/workflows/ci.yml",
    swapFrom: "runs-on: ubuntu-latest",
    swapTo: "runs-on: starsling-ubuntu",
  },
  speed: {
    caption: {
      title: "80% faster on day one.",
      description:
        "5th Gen AMD EPYC runners, 4× faster cache, unlimited concurrency. 33% cheaper than GitHub.",
    },
    jobsLabel: "8 JOBS IN PARALLEL",
    saved: "6M 34S SAVED",
    allDone: "1:42",
    allDoneNote: "(ALL DONE)",
    start: "0:00",
    baseline: "8:16",
  },
  agents: {
    caption: {
      title: "Agents keep making it faster.",
      description:
        "AI agents analyze every run and open optimization PRs - caching, parallelization, test sharding. You review and merge.",
    },
    run: { label: "RUN", ref: "4831", branch: "main" },
    statusStart: "Pipeline finished. Looking for what to make faster.",
    exploring: "Exploring codebase",
    steps: [
      "Inspected the workflow, runs-on labels, and matrix strategy.",
      "Traced the longest step — pnpm install at 1m 42s across all jobs.",
      "Checked actions/setup-node — no cache directive set.",
      "Pulled cache-hit history across the last 50 runs — 13% hits.",
      "Drafted a setup-pnpm step keyed on the lockfile hash.",
    ],
    statusEnd: "Issues found. Creating a PR.",
    pr: {
      label: "PR OPENED",
      ref: "234",
      by: "@starsling-bot",
      type: "feat(ci):",
      title: "cache pnpm store between runs",
      description:
        "Adds a setup-pnpm step keyed on pnpm-lock.yaml. Restores the store across CI runs.",
      additions: "+12",
      deletions: "-3",
    },
  },
};
