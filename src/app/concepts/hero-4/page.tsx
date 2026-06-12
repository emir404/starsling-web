import type { Metadata } from "next";

import { HeroConcept4 } from "@/components/concepts/hero-4/hero-concept-4";

export const metadata: Metadata = {
  title: "Hero Concept 4",
  robots: { index: false, follow: false },
};

export default function HeroConcept4Page() {
  return <HeroConcept4 />;
}
