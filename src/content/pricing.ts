import type { PricingTier } from "@/types/content";

/** Pricing plans. Figures are placeholders pending final pricing. */
export const PRICING_TIERS: PricingTier[] = [
  {
    name: "Free trial",
    price: "$0",
    description: "2,000 minutes to try Starsling. No credit card required.",
    features: ["2,000 build minutes", "AI optimizations", "Community support"],
    cta: "Start free",
    href: "/#waitlist",
  },
  {
    name: "Usage-based",
    price: "$0.008/min",
    description: "Pay only for what you build — AI optimizations included.",
    features: [
      "Unlimited build minutes",
      "AI optimization PRs",
      "Advanced caching",
      "Priority support",
    ],
    cta: "Join the waitlist",
    href: "/#waitlist",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Dedicated support and custom infrastructure for your team.",
    features: ["Custom pricing", "SSO & SAML", "Dedicated support", "SLAs"],
    cta: "Speak with a founder",
    href: "/#waitlist",
  },
];
