import type { Metadata } from "next";

import { HeroConcept3 } from "@/components/concepts/hero-3/hero-concept-3";

export const metadata: Metadata = {
  title: "Hero Concept 3",
  robots: { index: false, follow: false },
};

export default function HeroConcept3Page() {
  return <HeroConcept3 />;
}
