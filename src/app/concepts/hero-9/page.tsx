import type { Metadata } from "next";

import { HeroConcept9 } from "@/components/concepts/hero-9/hero-concept-9";

export const metadata: Metadata = {
  title: "Hero Concept 9",
  robots: { index: false, follow: false },
};

export default function HeroConcept9Page() {
  return <HeroConcept9 />;
}
