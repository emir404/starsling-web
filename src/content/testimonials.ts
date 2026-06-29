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

// Per-person attribution, spread into each quote below to avoid repetition.
// NOTE (assets): Partcl has no wordmark SVG, so the card renders "Partcl" as
// text (add /logos/partcl.svg to upgrade).
const ABHI = {
  author: "Abhi Aiyer",
  role: "Co-founder & CTO, Mastra",
  company: "Mastra",
  avatarSrc: "/avatars/abhi-aiyer.png",
  logoSrc: "/logos/mastra.svg",
} satisfies Omit<Testimonial, "quote">;

const VAMSHI = {
  author: "Vamshi Balanaga",
  role: "Co-founder & CTO, Partcl",
  company: "Partcl",
  avatarSrc: "/avatars/vamshi-balanaga.png",
} satisfies Omit<Testimonial, "quote">;

const BEREKET = {
  author: "Bereket Engida",
  role: "Founder & CEO, Better Auth",
  company: "Better Auth",
  avatarSrc: "/avatars/bereket-engida.png",
  logoSrc: "/logos/better-auth.svg",
} satisfies Omit<Testimonial, "quote">;

/**
 * Customer testimonials shown in the marquee — quotes from Mastra, Partcl, and
 * Better Auth, interleaved so consecutive cards rotate through companies.
 */
export const TESTIMONIALS: Testimonial[] = [
  {
    ...VAMSHI,
    quote:
      "Within a day of migrating to StarSling Runners, their agents opened up a PR that literally made our Rust CI tests 2x faster!",
  },
  {
    ...BEREKET,
    quote:
      "Most CI providers just give you faster machines. StarSling gives us that and made our tests faster, so we could stay focused on making Better Auth even better.",
  },
  {
    ...ABHI,
    quote:
      "Our team is really loving StarSling. The runners are just handled, so nobody on my team thinks about CI infrastructure anymore, and the agents keep optimizing for the one thing I care about, minutes saved.",
  },
  {
    ...VAMSHI,
    quote:
      "Most CI vendors just bill you for faster machines. StarSling's agents actively find ways to cut what each minute costs you, and those savings compound as your volume grows, while you stay focused on your product.",
  },
  {
    ...BEREKET,
    quote:
      "StarSling agents are like a CI engineer we never had to hire. They find the slow spots, test out fixes, find the ones that work and open the PRs themselves.",
  },
  {
    ...ABHI,
    quote:
      "At Mastra we move so fast that the bottleneck becomes reviews and CI. Time spent compounds, and StarSling helps you realize how much time you're losing.",
  },
  {
    ...VAMSHI,
    quote:
      "We build chip design and simulation software that's far faster than traditional methods. StarSling is the same idea pointed at CI.",
  },
  {
    ...BEREKET,
    quote:
      "Before StarSling, speeding up CI was the sort of work that didn't make it into a release. There was always a feature that mattered more than shaving a minute off the test suite. Now we can actually ship CI improvements with new releases.",
  },
  {
    ...ABHI,
    quote:
      "Our test suite grows every week. It used to mean someone had to stop and make it fast again; now that just happens in the background while we keep shipping.",
  },
  {
    ...VAMSHI,
    quote:
      "The agents went through every workflow we had and did the annoying but valuable work we'd never gotten to: caching builds across shards, parallelizing our tests, right-sizing each job to the machine it actually needed. All on their own. I just reviewed the PRs and merged.",
  },
  {
    ...BEREKET,
    quote:
      "We've been using StarSling for Better Auth CI. It's been saving us countless hours, both with fast runners and their agent optimizing our CI.",
  },
  {
    ...ABHI,
    quote:
      "On a busy day, a job could sit close to fifteen minutes in the queue before a single test even ran, and across the matrix that was real time gone every day. Now it's a minute or two.",
  },
  {
    ...VAMSHI,
    quote:
      "We're a chip company, not a DevOps team. We'd been throwing the most powerful machines we could get at our CI and we didn't have time to sit there and optimize it. When it comes down to priorities, our product always comes first so CI just didn't make the cut.",
  },
  {
    ...BEREKET,
    quote:
      "Better Auth is growing fast. We've almost doubled our GitHub Actions usage in the past few months without CI becoming a bottleneck thanks to StarSling.",
  },
];
