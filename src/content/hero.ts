import type { HeroContent } from "@/types/content";
import { SITE_CONFIG } from "@/lib/site";

/** Hero concept copy (Figma frames 196:2936 / 196:3247 / 199:3843 / 199:3943). */
export const HERO_CONTENT: HeroContent = {
  badge: { prefix: "Backed by", suffix: "Combinator" },
  headline: SITE_CONFIG.tagline,
  description: "GitHub Actions runners with AI agents that 5x your build speeds",
  form: {
    placeholder: "you@company.com",
    cta: "Join Waitlist",
    href: SITE_CONFIG.links.waitlist,
  },
  steps: [
    { id: "input", label: "INPUT" },
    { id: "planning", label: "PLANNING" },
    { id: "parallel", label: "PARALLEL EXEC." },
    { id: "output", label: "OUTPUT" },
  ],
  caption: ["80% LESS BUILD TIME", "LOREM IPSUM DOLOR", "SIT AMET"],
};
