import type { BlogPost } from "@/types/blog";
import { VIDEO_SECTION } from "@/content/video";

/**
 * Launch announcement — the reference post for the blog template. Mirrors the
 * live article (starsling.dev/blog/announcing-starsling-runners-...): the same
 * sections, in order, authored as structured blocks.
 */
export const announcingStarslingRunners: BlogPost = {
  slug: "announcing-starsling-runners-self-driving-ci-that-optimizes-itself",
  title: "Announcing Starsling Runners: self-driving CI that optimizes itself",
  excerpt:
    "Fast GitHub Actions runners with AI agents that continuously ship optimization PRs. Customers like Better Auth and Mastra are seeing 82% faster CI.",
  date: "2026-04-30",
  category: "Announcements",
  author: {
    name: "Yonas Beshawred",
    role: "Co-founder & CEO, Starsling",
  },
  hero: { type: "video", video: VIDEO_SECTION },
  body: [
    {
      type: "paragraph",
      spans: [
        "Today we're launching ",
        { text: "Starsling Runners", bold: true },
        ": self-driving CI for GitHub Actions. They're a drop-in replacement for ",
        { text: "ubuntu-latest", code: true },
        " — install the GitHub App, change one line, and your pipelines run on faster hardware while AI agents continuously open pull requests that make them faster still. Early customers like ",
        { text: "Better Auth", bold: true },
        " and ",
        { text: "Mastra", bold: true },
        " are already seeing up to ",
        { text: "82% faster GitHub Actions", bold: true },
        ".",
      ],
    },
    {
      type: "paragraph",
      spans: [
        "Getting started is a one-line change to your workflow file:",
      ],
    },
    {
      type: "code",
      lang: "yaml",
      code: `jobs:
  test:
-   runs-on: ubuntu-latest
+   runs-on: starsling-ubuntu`,
    },
    {
      type: "paragraph",
      spans: [
        "From there, our agents go to work. In the first weeks alone they've opened PRs that shard E2E suites, trim needless sleep timers, fix Docker healthchecks, and skip redundant Playwright browser installs — each one reviewed and merged by the customer's own team.",
      ],
    },
    { type: "heading", id: "our-story", text: "Our story" },
    {
      type: "paragraph",
      spans: [
        "I previously founded ",
        { text: "StackShare", bold: true },
        ", a developer community of millions that was acquired by FOSSA in 2024. My co-founder Daniel led Netflix's Internal Developer Portal team and worked on Facebook's AI Camera team. We met a decade ago, and started Starsling after seeing how big an impact AI could have on the DevOps stack.",
      ],
    },
    {
      type: "paragraph",
      spans: [
        "Developers lose roughly 20% of their day to work that isn't writing code — chasing CI failures, investigating flaky tests, and resolving incidents. We joined Y Combinator's Spring 2025 batch to build AI agents that take that work off engineers' plates, starting with the part of the stack everyone complains about most.",
      ],
    },
    {
      type: "image",
      src: "/blog/yc-demo-day.svg",
      alt: "Yonas and Daniel at Y Combinator Demo Day, June 2025",
      caption: "Yonas and Daniel at YC Demo Day, June 2025.",
      width: 1600,
      height: 900,
    },
    { type: "heading", id: "ci-bottleneck", text: "CI is the new bottleneck" },
    {
      type: "paragraph",
      spans: [
        "Coding agents now write code in 5 minutes — but CI still takes 10+ minutes. The slow part of shipping has moved. The bottleneck isn't writing the change anymore; it's waiting for the pipeline to tell you whether it's safe to merge.",
      ],
    },
    {
      type: "quote",
      quote:
        "When an agent writes code in 5 minutes, that same CI run is suddenly 67% of your cycle time.",
      cite: "Jared Palmer",
    },
    {
      type: "paragraph",
      spans: [
        "We felt this ourselves building Starsling's own DevOps agents during YC. GitHub's hosted runners use older machines and have no built-in mechanism to get faster over time — so the wait just compounds. When we asked our waitlist which agent they wanted first, GitHub Actions was the runaway answer.",
      ],
    },
    {
      type: "heading",
      id: "another-runner",
      text: "Why the world needs another CI runner",
    },
    {
      type: "paragraph",
      spans: [
        "GitHub's December 2024 pricing changes made CI even more painful for teams with lots of jobs, while the product itself isn't improving fast enough to match. You don't have to look far to find the frustration:",
      ],
    },
    {
      type: "list",
      items: [
        ["Jobs that sit queued longer than they take to run."],
        ["Per-minute pricing that punishes the matrix builds modern apps depend on."],
        ["Caches that silently stop working and nobody notices for weeks."],
      ],
    },
    {
      type: "paragraph",
      spans: [
        "Plenty of other runners are faster. But none of them are leveraging the recent advances in models to ",
        { text: "continuously improve your pipelines", italic: true },
        " — they hand you a quicker machine and stop there. We think the runner should keep getting smarter after you install it.",
      ],
    },
    {
      type: "heading",
      id: "what-you-get",
      text: "What you get with Starsling Runners",
    },
    {
      type: "paragraph",
      spans: [
        "Two things, working together: better hardware than GitHub-hosted runners, and AI agents that analyze your workflows and open optimization PRs on your repo.",
      ],
    },
    {
      type: "paragraph",
      spans: [{ text: "The hardware:", bold: true }],
    },
    {
      type: "list",
      items: [
        ["5th Gen AMD EPYC processors — about 30% faster than GitHub's runners."],
        ["Unlimited concurrency, so your matrix never waits in a queue."],
      ],
    },
    {
      type: "paragraph",
      spans: [{ text: "The agents continuously look for wins like:", bold: true }],
    },
    {
      type: "list",
      items: [
        ["Detecting broken or missing caches and fixing the configuration."],
        ["Faster dependency-install strategies."],
        ["Parallelizing and reordering build steps."],
        ["Tuning test jobs and database interactions."],
        ["Restructuring workflows — splitting jobs and improving matrix strategies."],
      ],
    },
    { type: "heading", id: "pricing", text: "Pricing" },
    {
      type: "paragraph",
      spans: [
        "Starsling runners start at ",
        { text: "$0.004/min", bold: true },
        " for 2 vCPU machines and ",
        { text: "$0.008/min", bold: true },
        " for 4 vCPU machines — versus GitHub's $0.012/min. The AI optimizations are included with every minute you run. If you're paying GitHub for hosted runners today, you get faster CI, with AI, while spending less.",
      ],
    },
    { type: "heading", id: "join-waitlist", text: "Join the waitlist" },
    {
      type: "paragraph",
      spans: [
        "If your team pays GitHub for GitHub Actions and wants it faster — and cheaper — we'd love to have you. Install the GitHub App, change one line, and let the agents take it from there.",
      ],
    },
    {
      type: "paragraph",
      spans: [{ text: "Happy Slinging 💫", italic: true }],
    },
  ],
};