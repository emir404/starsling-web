import type { FaqItem } from "@/types/content";

/** FAQ entries. Answers are placeholder copy for the scaffold. */
export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "How does Starsling speed up my builds?",
    answer:
      "Starsling runs your GitHub Actions on high-performance runners with smart caching, and AI agents continuously tune your pipeline.",
  },
  {
    question: "How do I get started?",
    answer:
      "Swap your runner label from ubuntu-latest to starsling-ubuntu-24.04 — that's the only change needed.",
  },
  {
    question: "Is it really cheaper than GitHub Actions?",
    answer:
      "Usage-based pricing comes in well under standard GitHub Actions runners, with AI optimizations included.",
  },
  {
    question: "Is my code secure?",
    answer:
      "Builds run in isolated environments and your source is never retained beyond the build.",
  },
];
