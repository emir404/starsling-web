import type { PricingTier } from "@/types/content";

/** Headline above the pricing cards (Figma 234:924). */
export const PRICING_HEADER = {
  title: "2,000 free minutes. Then $0.008/min.",
  subtitle: "AI-powered optimizations included with every minute.",
};

/** Pricing plans (Figma 234:927). Figures are placeholders pending final pricing. */
export const PRICING_TIERS: PricingTier[] = [
  {
    name: "Free Trial",
    price: "Free",
    description: "2,000 minutes your first month",
    features: [
      "2,000 minutes included",
      "AI optimizations included",
      "Unlimited concurrency",
      "No credit card required",
    ],
    cta: "Join Waitlist",
    href: "/#waitlist",
  },
  {
    name: "Usage Based",
    price: "$0.008",
    priceUnit: "/min",
    description: "33% cheaper than GitHub Actions",
    features: [
      "AI optimizations included",
      "Queue time never billed",
      "Unlimited concurrency",
      "99.99% SLA",
    ],
    cta: "Join Waitlist",
    href: "/#waitlist",
    highlighted: true,
  },
  {
    // Figma's eyebrow reads "Usage Based" (a copy-paste slip); using "Enterprise"
    // to match the "Custom" price and the enterprise feature set below.
    name: "Enterprise",
    price: "Custom",
    description: "Volume discounts available",
    features: [
      "Custom minute allocation",
      "SSO/SAML + dedicated account manager",
      "<1hr incident response",
      "Custom SLAs",
    ],
    cta: "Join Waitlist",
    href: "/#waitlist",
  },
];

/** YC-alumni discount note under the cards (Figma 234:1012). */
export const PRICING_YC_NOTE = {
  prefix: "Are you a",
  /** Rendered next to the YC mark, in YC orange. */
  brand: "Combinator",
  suffix: "alumni?",
  cta: { label: "Click for discounts", href: "/#waitlist" },
} as const;
