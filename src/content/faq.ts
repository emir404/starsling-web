import type { FaqItem } from "@/types/content";

/** FAQ entries. Answers are drafts — refine the items flagged with TODO. */
export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "What is Starsling?",
    answer:
      "Starsling is self-driving CI — drop-in GitHub Actions runners that are faster and cheaper than the defaults, paired with AI agents that continuously tune your pipeline and ship the improvements as pull requests.",
  },
  {
    question: 'What does "self-driving CI" actually mean?',
    answer:
      "Your pipeline optimizes itself. Beyond running jobs on high-performance runners with smart caching, Starsling's agents watch every build, find the bottlenecks, and open PRs that make them faster — so CI keeps improving without anyone babysitting it.",
  },
  {
    question: "Is it really a drop-in replacement?",
    answer:
      "Yes. Change one line — swap your runner label from ubuntu-latest to starsling-ubuntu-24.04 — and your existing workflows run unchanged. No rewrites, no new YAML, no migration.",
  },
  {
    question: "How is this different from Blacksmith or Depot?",
    answer:
      "Faster hardware is table stakes. Starsling adds the AI layer on top: agents that actively analyze your pipeline and ship the optimizations for you, instead of just handing you quicker runners.",
  },
  {
    question: "How do you handle security and isolation?",
    // TODO: confirm specifics — SOC 2, VPC / self-hosted options, secret handling.
    answer:
      "Every build runs in an isolated, ephemeral environment, and your source code is never retained after the job finishes.",
  },
  {
    question: "What does it cost?",
    // TODO: add concrete pricing numbers / link to /pricing.
    answer:
      "Usage-based pricing that comes in below standard GitHub Actions runners, with the AI optimizations included — so you save on both compute and engineering time.",
  },
  {
    question: "Who is this for?",
    answer:
      "Teams whose GitHub Actions have become slow, expensive, or a daily source of friction — from fast-moving startups to larger engineering orgs that want CI to get better on its own.",
  },
  {
    question: "How do I get started?",
    // TODO: link to signup / docs.
    answer:
      "Change your runner label and push — you're on Starsling immediately, and the optimization agents start finding wins from your very first build.",
  },
];
