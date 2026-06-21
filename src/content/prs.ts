import type { PrsContent } from "@/types/content";

/** Copy for the "The PRs don't stop coming" section (Figma 234:468). */
export const PRS_CONTENT: PrsContent = {
  title: "The PRs don't stop coming.",
  subtitle:
    "One agent doesn't open one PR. It opens them in parallel, all day.",
  timeLabel: "TIME ELAPSED",
  pr: { type: "feature", description: "a boring pr description" },
  agents: [
    { name: "Cursor", logo: "/logos/cursor.svg", width: 76, height: 18 },
    { name: "Claude", logo: "/logos/claude.svg", width: 83, height: 18 },
  ],
  paragraph: [
    {
      text: "A year ago a developer opened a handful of PRs a day. Now a single agent ",
    },
    { text: "opens that many in an hour", highlight: true },
    {
      text: " - and you're running more than one. Claude Code, Cursor, and Codex ",
    },
    {
      text: "push in parallel, around the clock, and every PR lands in the",
      highlight: true,
    },
    { text: " same queue on the same runners. The inflow scaled. The pipeline didn't." },
  ],
};
