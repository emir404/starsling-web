import type { Metadata } from "next";

import { HeroConcept5 } from "@/components/concepts/hero-5/hero-concept-5";

export const metadata: Metadata = {
  title: "Hero Concept 5",
  robots: { index: false, follow: false },
};

export default function HeroConcept5Page() {
  return <HeroConcept5 />;
}
