import type { CustomerLogo, Testimonial } from "@/types/content";

/** Customer wordmarks shown in the social-proof band. */
export const CUSTOMER_LOGOS: CustomerLogo[] = [
  { name: "Better Auth" },
  { name: "Mastra" },
  { name: "OrgOrg" },
];

/** Customer testimonials. Placeholder copy for the scaffold. */
export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Starsling cut our CI times dramatically and the optimization PRs just keep coming.",
    author: "Engineering Lead",
    role: "CTO",
    company: "Better Auth",
  },
  {
    quote:
      "We swapped one line and our pipeline got faster every week without us touching it.",
    author: "Platform Engineer",
    role: "Founder",
    company: "Mastra",
  },
];
