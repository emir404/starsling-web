import type { Metadata } from "next";

import { HeroConcept7 } from "@/components/concepts/hero-7/hero-concept-7";

export const metadata: Metadata = {
  title: "Hero Concept 7",
  robots: { index: false, follow: false },
};

export default function HeroConcept7Page() {
  return <HeroConcept7 />;
}
