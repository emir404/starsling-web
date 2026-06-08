import { Bot, DollarSign, Gauge } from "lucide-react";

import type { Feature } from "@/types/content";

/** The three "AI in your CI" pillars. */
export const FEATURES: Feature[] = [
  {
    title: "Faster builds",
    description:
      "High-performance runners with smart caching make your GitHub Actions builds dramatically faster.",
    icon: Gauge,
  },
  {
    title: "Self-driving",
    description:
      "AI agents analyze your logs, runs, and telemetry to continuously ship build-optimization PRs.",
    icon: Bot,
  },
  {
    title: "Cheaper than GitHub",
    description:
      "Usage-based pricing that lands well under standard GitHub Actions runners.",
    icon: DollarSign,
  },
];
