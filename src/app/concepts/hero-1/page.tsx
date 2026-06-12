import type { Metadata } from "next";

import { HeroConcept1 } from "@/components/concepts/hero-1/hero-concept-1";

export const metadata: Metadata = {
  title: "Hero Concept 1",
  robots: { index: false, follow: false },
};

export default function HeroConcept1Page() {
  return <HeroConcept1 />;
}
