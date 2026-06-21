import { Bot, Hourglass } from "lucide-react";

import type { BottleneckContent } from "@/types/content";

/** "CI is the new bottleneck" — the problem statement, with a before/after CI comparison. */
export const BOTTLENECK: BottleneckContent = {
  title: "CI is the new bottleneck.",
  subtitle: "AI made coding 10x faster. CI hasn't kept up, until now.",
  rows: [
    {
      icon: Bot,
      title: "AI made coding 10× faster. CI didn't move.",
      highlight: "10× faster. CI didn't move.",
      body: "Claude Code, Cursor, and Codex pushed PR volume through the roof. Your pipeline is the same one you set up two years ago — and now it's the bottleneck holding back every agent and every engineer behind it.",
    },
    {
      icon: Hourglass,
      title: "Ten minutes per PR. Multiplied by every push.",
      highlight: "every push.",
      body: "Every push, every retry, every rebase — your team waits. ubuntu-latest runs on shared, older hardware with a slow cache, and the minutes compound across a 10-engineer team into days of dead time a month.",
    },
  ],
  bars: [
    {
      chip: "Before AI",
      coding: { label: "Coding", value: "2 hours" },
      ci: { label: "CI", value: "10M" },
      ciShare: "8%",
      ratio: [320, 126],
    },
    {
      chip: "With AI",
      coding: { label: "AI Coding", value: "5M" },
      ci: { label: "CI", value: "10M" },
      ciShare: "67%",
      ratio: [187, 259],
      danger: true,
    },
  ],
};
