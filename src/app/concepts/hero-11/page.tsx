import type { Metadata } from "next";

import { HeroConcept11 } from "@/components/concepts/hero-11/hero-concept-11";

export const metadata: Metadata = {
  title: "Hero Concept 11",
  robots: { index: false, follow: false },
};

export default function HeroConcept11Page() {
  return <HeroConcept11 />;
}
