import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Concepts",
  robots: { index: false, follow: false },
};

/** Internal design explorations — grows as new concepts land. */
const CONCEPTS = [
  {
    href: "/concepts/hero-1",
    label: "Hero Concept 1",
    description:
      "Pipeline step cycle — isometric browser window and planning card",
  },
  {
    href: "/concepts/hero-2",
    label: "Hero Concept 2",
    description: "Animated CI timeline — PR to parallel runners to build passed",
  },
  {
    href: "/concepts/hero-3",
    label: "Hero Concept 3",
    description: "Big full-bleed timeline — the camera pans along with the run",
  },
  {
    href: "/concepts/hero-4",
    label: "Hero Concept 4",
    description:
      "Splitting pipeline panels — input fans out to parallel runners, then the verdict",
  },
  {
    href: "/concepts/hero-5",
    label: "Hero Concept 5",
    description:
      "Blueprint grid — cards materialize on graph paper as the run progresses",
  },
  {
    href: "/concepts/hero-6",
    label: "Hero Concept 6",
    description:
      "Centered hero — hero-1's iso scenes in a framed panel with blueprint margins",
  },
  {
    href: "/concepts/hero-7",
    label: "Hero Concept 7",
    description:
      "Concept 3's timeline, text removed and centered in frame — for an X post",
  },
  {
    href: "/concepts/hero-8",
    label: "Hero Concept 8",
    description:
      "Workflow-run DAG — matrix jobs fan out in parallel and converge on the merge gate, landing a dramatically low build time",
  },
  {
    href: "/concepts/hero-9",
    label: "Hero Concept 9",
    description:
      "Workflow-run graph on the light blueprint — a fan-in CI DAG animates to Success",
  },
  {
    href: "/concepts/hero-10",
    label: "Hero Concept 10",
    description:
      "Figma-exact self-driving CI run in a framed dark panel — matrix agents spin up, fan into the merge gate, then the speed/cost payoff",
  },
  {
    href: "/concepts/hero-11",
    label: "Hero Concept 11",
    description:
      "Figma-exact two-scene parallel run — one test splits/fans out into five parallel jobs (time saved 1m 18s), then they slide left and fan into a test-reports card that feeds agent memory",
  },
  {
    href: "/concepts/hero-12",
    label: "Hero Concept 12",
    description:
      "Time-collapse timeline — one long serial test-suite bar splits into five short parallel shards as the wall-clock counts down 13m 20s → 1m 18s, with a TIME SAVED bracket",
  },
  {
    href: "/concepts/hero-13",
    label: "Hero Concept 13",
    description:
      "Self-driving dispatcher — a central StarSling autopilot hub reads the suite and auto-routes shards along radial spokes to five parallel runners (radar sweep, 10× faster)",
  },
  {
    href: "/concepts/hero-14",
    label: "Hero Concept 14",
    description:
      "Live self-driving CI race — the regular runner and Starsling fill on one sped-up clock; Starsling finishes 30% faster while the regular run keeps ticking, then forks into three parallel shards (sharp connector, @starsling-bot autonomous PRs)",
  },
];

export default function ConceptsPage() {
  return (
    <div className="mx-auto w-full max-w-[90rem] flex-1 px-6 py-16 md:px-12 lg:px-[7.5rem]">
      <h1 className="text-h2 font-medium">Concepts</h1>
      <p className="mt-2 text-muted-foreground">
        Internal design explorations — not linked from the site.
      </p>
      <ul className="mt-8 flex flex-col gap-2">
        {CONCEPTS.map((concept) => (
          <li key={concept.href}>
            <Link
              href={concept.href}
              className="flex flex-col gap-1 border border-hairline bg-card p-5 transition-colors hover:border-rail"
            >
              <span className="font-mono text-base font-medium uppercase">
                {concept.label}
              </span>
              <span className="text-sm text-muted-foreground">
                {concept.description}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
