/**
 * Central site configuration. Single source of truth for metadata, the
 * primary CTA target, and social links. Update URLs here as they are finalized.
 */
export const SITE_CONFIG = {
  name: "Starsling",
  url: "https://starsling.dev",
  tagline: "Self-driving CI",
  description:
    "Faster GitHub Actions runners with AI agents that continuously improve your build speeds.",
  ogImage: "/og/starsling-runners-org.jpg",
  ogImageAlt: "Starsling — AI-native CI and fast GitHub Actions runners",
  /** Handle used for the Twitter/X card attribution. */
  twitterHandle: "@starslingdev",
  /** Primary CTA anchors to the waitlist band on the home page. */
  links: {
    waitlist: "/#waitlist",
    demo: "/#waitlist",
    twitter: "https://x.com/starslingdev",
    linkedin: "https://www.linkedin.com/company/starslingdev",
    github: "https://github.com/starsling",
  },
} as const;
