import type { CtaContent } from "@/types/content";
import { SITE_CONFIG } from "@/lib/site";

/** Closing CTA band copy (Figma node 234:1143). */
export const CTA_CONTENT: CtaContent = {
  title: "Supercharge your CI with AI.",
  subtitle:
    "Your GitHub Actions, through the ring. 80% faster, 33% cheaper, one line to switch.",
  form: {
    placeholder: "you@company.com",
    cta: "Join Waitlist",
    href: SITE_CONFIG.links.waitlist,
  },
};
