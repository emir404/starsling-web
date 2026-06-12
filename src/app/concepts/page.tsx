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
