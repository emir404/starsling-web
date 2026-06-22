import type { Metadata } from "next";

import { HeroConcept12 } from "@/components/concepts/hero-12/hero-concept-12";

export const metadata: Metadata = {
  title: "Hero Concept 12",
  robots: { index: false, follow: false },
};

export default function HeroConcept12Page() {
  return <HeroConcept12 />;
}
