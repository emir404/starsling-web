import type { CustomerLogo, Testimonial } from "@/types/content";

/** Customer logos shown in the social-proof band (monochrome SVGs in /public/logos). */
export const CUSTOMER_LOGOS: CustomerLogo[] = [
  { name: "Google", src: "/logos/google.svg", width: 89, height: 30 },
  { name: "Sim", src: "/logos/sim.svg", width: 57, height: 28 },
  { name: "LangChain", src: "/logos/langchain.svg", width: 153, height: 28 },
  { name: "crewAI", src: "/logos/crewai.svg", width: 96, height: 32 },
  { name: "Composio", src: "/logos/composio.svg", width: 146, height: 28 },
  { name: "Alchemy", src: "/logos/alchemy.svg", width: 131, height: 28 },
  { name: "Dify", src: "/logos/dify.svg", width: 63, height: 28 },
];

/**
 * Customer testimonials shown in the testimonials carousel.
 * The first entry is the real quote from the Figma (node 234:748). NOTE: the
 * Figma attributes Abhi Aiyer to "Founder, Better Auth" while showing the Mastra
 * wordmark — replicated verbatim; confirm the correct company/role.
 */
export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "At Mastra we move so fast that the bottleneck becomes reviews and CI. Time spent compounds and @starslingdev helps you realize how much time you're losing.",
    highlight: "@starslingdev",
    author: "Abhi Aiyer",
    role: "Founder, Better Auth",
    company: "Mastra",
    avatarSrc: "/avatars/abhi-aiyer.png",
    logoSrc: "/logos/mastra.svg",
  },
  // TODO: placeholder copy + identity — replace with a real second testimonial.
  {
    quote:
      "We swapped one line and our pipeline got faster every week without us touching it.",
    author: "Platform Engineer",
    role: "Founder",
    company: "crewAI",
    avatarSrc: "/avatars/testimonial-2.png",
  },
];
